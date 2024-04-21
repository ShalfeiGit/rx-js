import { interval, mergeMap, of, switchMap, concatMap, exhaustMap } from "rxjs";

const HighOrderOperators = () => {

   const sequenceHighOrderOperators$ = interval(1000)
   .pipe(
      mergeMap(el => of(el)), // MERGEMAP - возвращает поток на основе элементов потока из возвращаемых других поток (например  from(axios)) mergeMap = map + mergeAll() params concurent - количество паралелльных потоков выполняемых
      concatMap(el => of(el)), // CONCATMAP - возвращает поток на основе элементов потока из возвращаемых других поток, НО сохраняет последовательность возвращаемых значений (например  from(axios)) concatMap = map + concatAll() params concurent - количество паралелльных потоков выполняемых
      switchMap(el => of(el)), // SWITCHMAP - возвращает поcледний поток из поступивших и не обработанных на основе элементов потока из возвращаемых других поток (например  from(axios)) switchMap = map + switchAll() params concurent - количество паралелльных потоков выполняемых
      exhaustMap(el => of(el)) // SWITCHMAP - возвращает первый поток из поступивших и не обработанных на основе элементов потока из возвращаемых других поток (например  from(axios)) switchMap = map + switchAll() params concurent - количество паралелльных потоков выполняемых
    ) 

    sequenceHighOrderOperators$.subscribe(
      (value) => { //вызовется при получении нового значения из потока
        console.log(`sequenceHighOrderOperators: ${value}`)
      }, 
      (error) => {console.log(error)}, //вызовется при ошибки
      () => {console.log('completed')}, //вызовется при завершении потока
    )
};

export default HighOrderOperators