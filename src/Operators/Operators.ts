import { EMPTY, Observable, catchError, debounceTime, filter, interval, map, of, retry, skip, startWith,  take, takeUntil, tap, withLatestFrom } from "rxjs";

const Operators = () => {
  const customPipe = (sourse$: Observable<[number, number]>) => {
    sourse$.subscribe((value) => { console.log('CUSTOM PIPE SOURSE', value)})
    return new Observable<string>(subscriber => {subscriber.next('Test custom observable') })
  }

   const sequenceOperators$ = interval(1000)
   .pipe(
      startWith(100), // STARTWITH - стартует поток с исходным значением
      debounceTime(100),
      tap(async el => { // TAP - делает сайд эффекты с элементами при этом не видоизменяет исходный поток
        const result = await Promise.resolve(el * 6)
        console.log('tap: ', result)
        return result
      }), 
      map(el => el*el), // MAP - оператор для манипуляций с каждым элементом
      filter(el => el > 20), // FILTER - оператор для фильтрации элеметов потока
      skip(1), // SKIP - пропускает указанное колличество элементы потока
      take(4), // TAKE - берет указанное колличество элементов и завершает поток
      withLatestFrom(interval(2000)), // WITHLATESTFROM - возвращает комбинированное значение потока и послденее последнее переданного значение
      takeUntil(of(1)), // TAKEUNTIL - приостанавливает выполнение потока при получении значений из другого потока (of)
      customPipe, // кастомный поток
      retry(3), // RETRY в случае ошибки три раза повторит поток
      catchError((err) => {console.log(err); return EMPTY}), // CATCHERROR - обработка ошибок  (EMPRTY) - пустой поток
    )  

    sequenceOperators$.subscribe(
      (value) => { //вызовется при получении нового значения из потока
        console.log(`sequenceOperators: ${value}`)
      }, 
      (error) => {console.log(error)}, //вызовется при ошибки
      () => {console.log('completed')}, //вызовется при завершении потока
    )
};

export default Operators