import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from "rxjs";

const CustomSubject = () => {
  const sequenceSubject$ = new Subject(); // SUBJECT = Observable + Subscriber  (поток горячий и бесконечный - т.е. значения из next до подписки не видны)
  sequenceSubject$.next('Subject 1')
  sequenceSubject$.subscribe((v) => console.log(v))
  sequenceSubject$.next('Subject 2')

  const sequenceBehaviorSubject$ = new BehaviorSubject('Initial Behavior'); // BehaviorSubject = тот же Subject но отдает либо инициализируемое значение - либо предыдущее
  sequenceBehaviorSubject$.next('BehaviorSubject 1')
  sequenceBehaviorSubject$.subscribe((v) => console.log(v))
  sequenceBehaviorSubject$.next('BehaviorSubject 2')

  const sequenceReplaySubject$ = new ReplaySubject(); // ReplaySubject = тот же Subject но запоминает переданнное в ReplaySubject количество значений, либо если занчения нет то становится холодным Subject
  sequenceReplaySubject$.next('ReplaySubject 1')
  sequenceReplaySubject$.subscribe((v) => console.log(v))
  sequenceReplaySubject$.next('ReplaySubject 2')

  const sequenceAsyncSubject$ = new AsyncSubject(); // AsyncSubject = тот же Subject, но получаем последнее закешированные значения повызовы complete()
  sequenceAsyncSubject$.subscribe((v) => console.log(v))
  sequenceAsyncSubject$.next('AsyncSubject 2')
  sequenceAsyncSubject$.next('AsyncSubject 1')
  sequenceAsyncSubject$.complete();
};

export default CustomSubject