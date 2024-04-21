import { Observable, Subscriber, defer, from, fromEvent, iif, interval, merge, of, zip, combineLatest } from "rxjs";
import { ajax } from "rxjs/ajax";

interface IInitialObject {
  from: number;
  to: number;
  subscribers: Subscriber<number>[];
  [Symbol.iterator]: () => IInitialObject;
  next: () => { done: boolean; value: number; } | { done: boolean; value?: undefined; };
}

interface IInitialObjectWithObserver extends IInitialObject{
  [Symbol.iterator]: () => IInitialObjectWithObserver;
  push: (subscriber: Subscriber<number>) => void;
  notify: (value: number) => void;
}

const ShortVersion = () => {

  const initialColdObject: IInitialObject = {
    from: 1,
    to: 10,
    subscribers: [],
    [Symbol.iterator]: function() {
        return this;
    },
    next: function(){
      if (this.from <= this.to) {
        return {
          done: false,
          value: this.from++
        };
      } else {
        return {
          done: true
        };
      }
    },
  }

  const initialHotObject: IInitialObjectWithObserver = {
    from: 1,
    to: 10,
    subscribers: [],
    [Symbol.iterator]: function() {
        return this;
    },
    next: function(){
      if (this.from <= this.to) {
        if(this.from > 7){
          this.notify(this.from)
        }
        return {
          done: false,
          value: this.from++
        };
      } else {
        return {
          done: true
        };
      }
    },
    push(subscriber: Subscriber<number>){
      this.subscribers.push(subscriber)
    },
    notify(value){
      this.subscribers.map(subscriber => subscriber.next(value))
    }
  }
  // 1) Создание кастомного ХОЛОДНОГО потока (подключаемся при старте передачи данных (старт внутри Observable))
  const customSequenceCold$ = new Observable<number>((subscriber) => { // 
    const iterator = initialColdObject[Symbol.iterator]();
    for(const value of iterator){
      subscriber.next(value); // передать след значение потока
    }
    return () => {
      console.log('unsubscribe');  // отписка от потока
    }
  })

  customSequenceCold$.subscribe(
    (value) => { //вызовется при получении нового значения из потока  
      console.log(`customSequenceCold: ${value}`)
    }, 
    (error) => {console.log(error)}, //вызовется при ошибки
    () => {console.log('completed')}, //вызовется при завершении потока
  )

  // 2) Создание кастомного ГОРЯЧЕГО потока (подключаемся в процессе передачи данных (старт из вне Observable))
  const customSequenceHot$ = new Observable<number>((subscriber) => {
    const iterator = initialHotObject[Symbol.iterator]();
    iterator.push(subscriber);
    while(true){
      const result = iterator.next();
      if (result.done) break;
    }
    return () => {
      console.log('unsubscribe');  // отписка от потока
    }
  })

  customSequenceHot$.subscribe(
    (value) => { //вызовется при получении нового значения из потока  
      console.log(`customSequenceHot: ${value}`)
    }, 
    (error) => {console.log(error)}, //вызовется при ошибки
    () => {console.log('completed')}, //вызовется при завершении потока
  )

  // 3) Создание потока с использованием готовых конструкций
   
    // INTERVAL - поток с интервалом в 1с
    const sequenceInterval$ = interval(1000) 
    const subInterval = sequenceInterval$.subscribe(
      (value) => { //вызовется при получении нового значения из потока
        console.log(`sequenceInterval: ${value}`)
      }, 
      (error) => {console.log(error)}, //вызовется при ошибки
      () => {console.log('completed')}, //вызовется при завершении потока
    )

    // OF - поток из последовательности значений
    const sequenceOf$ = of(1, 2, 3) 
    sequenceOf$.subscribe(
      (value) => { //вызовется при получении нового значения из потока
        console.log(`sequenceOf: ${value}`)
      }, 
      (error) => {console.log(error)}, //вызовется при ошибки
      () => {console.log('completed')}, //вызовется при завершении потока
    )

    // FROM - поток из промисов, массива, итерируемым, объектом (к примеру з запроса в axios)
    const sequenceFrom$ = from([4, 5, 6]) 
    sequenceFrom$.subscribe(
      (value) => { //вызовется при получении нового значения из потока
        console.log(`sequenceFrom: ${value}`)
      }, 
      (error) => {console.log(error)}, //вызовется при ошибки
      () => {console.log('completed')}, //вызовется при завершении потока
    )

    // IIF - для старта выбирается один из потоков в зависмости от условия
    const sequenceIff$ = iif(() => true, of(true),  of(false)) 
    sequenceIff$.subscribe(
      (value) => { //вызовется при получении нового значения из потока
        console.log(`sequenceIff: ${value}`)
      }, 
      (error) => {console.log(error)}, //вызовется при ошибки
      () => {console.log('completed')}, //вызовется при завершении потока
    )

    // DEFER - стартует из вычисленного возвращаемого потока
    const sequenceDefer$ = defer(() => false ? of(true) : of(false)) 
    sequenceDefer$.subscribe(
      (value) => { //вызовется при получении нового значения из потока
        console.log(`sequenceDefer: ${value}`)
      }, 
      (error) => {console.log(error)}, //вызовется при ошибки
      () => {console.log('completed')}, //вызовется при завершении потока
    )

     // AJAX - поток на основан на возразщаемых данных из запроса
     const sequenceAjax$ = ajax<{title: string}>('https://jsonplaceholder.typicode.com/todos/1') 
     sequenceAjax$.subscribe(
       (value) => { //вызовется при получении нового значения из потока
         console.log(`sequenceAjax: ${value?.response?.title}`)
       }, 
       (error) => {console.log(error)}, //вызовется при ошибки
       () => {console.log('completed')}, //вызовется при завершении потока
     )

     // FROMEVENT - событие основан на дом событиях 
     const sequenceFromEvent$ = fromEvent(document.body, 'click') 
     sequenceFromEvent$.subscribe(
       (value) => { //вызовется при получении нового значения из потока
         console.log(`sequenceFromEvent: ${value?.type}`)
       }, 
       (error) => {console.log(error)}, //вызовется при ошибки
       () => {console.log('completed')}, //вызовется при завершении потока
     )

     // MERGE - создает поток из элементов нескольких потоков, путем их объединения в один поток
     const sequenceMerge$ = merge(interval(300), interval(500)) 
     const subMerge = sequenceMerge$.subscribe(
       (value) => { //вызовется при получении нового значения из потока
         console.log(`sequenceMerge: ${value}`)
       }, 
       (error) => {console.log(error)}, //вызовется при ошибки
       () => {console.log('completed')}, //вызовется при завершении потока
     )

     // ZIP - создает поток из элементов нескольких потоков, путем их объединения по эелментно с соответсвующими элементами других потоков
     const sequenceZip$ = zip(of(1,2,3,4), of(5,6,7,8)) 
     sequenceZip$.subscribe(
       (value) => { //вызовется при получении нового значения из потока
         console.log(`sequenceZip: ${value}`)
       }, 
       (error) => {console.log(error)}, //вызовется при ошибки
       () => {console.log('completed')}, //вызовется при завершении потока
     )

     // COMBINELATEST - создает поток из комбинации последних элементов с каждого потока 
     const sequenceCombineLatest$ = combineLatest(of(1,2,3,4), of(5,6,7,8)) 
     sequenceCombineLatest$.subscribe(
       (value) => { //вызовется при получении нового значения из потока
         console.log(`sequenceCombineLatest: ${value}`)
       }, 
       (error) => {console.log(error)}, //вызовется при ошибки
       () => {console.log('completed')}, //вызовется при завершении потока
     )

     document.body.click();

  setTimeout(() => {subInterval.unsubscribe()}, 3000) // отписка от потока
  setTimeout(() => {subMerge.unsubscribe()}, 5000) // отписка от потока

};

export default ShortVersion