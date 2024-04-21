import { Connectable, connectable, ConnectableObservable, interval, multicast, publish, refCount, share, Subject } from "rxjs";

const MultiCasting = () => {
  const sequenceSubject$ = new Subject(); 
  const sequenceInterval$ = interval(1000).pipe(multicast(sequenceSubject$)) as ConnectableObservable<any>; // MULTICAST делаем из холодного потока горячий
  sequenceInterval$.subscribe((v) => console.log('Sub 1', v))
  setTimeout(() => sequenceInterval$.subscribe((v) => console.log('Sub 2', v)), 3000)
  sequenceInterval$.connect();

  const sequenceInterval2$ = interval(1000).pipe(publish()) as ConnectableObservable<any>; // PUBLISH замена multicat + new Subject
  sequenceInterval2$.subscribe((v) => console.log('Sub 3', v))
  setTimeout(() => sequenceInterval2$.subscribe((v) => console.log('Sub 4', v)), 3000)
  sequenceInterval2$.connect();

  const sequenceInterval3$ = interval(1000).pipe(publish(), refCount()) // REFCOUNT замена теперь не нужен commit
  sequenceInterval3$.subscribe((v) => console.log('Sub 5', v))
  setTimeout(() => sequenceInterval3$.subscribe((v) => console.log('Sub 6', v)), 3000)

  const sequenceInterval4$ = connectable(interval(1000)) as Connectable<number> // CONNECTABLE полный текущий аналог multicat
  sequenceInterval4$.subscribe((v) => console.log('Sub 7', v))
  setTimeout(() => sequenceInterval4$.subscribe((v) => console.log('Sub 8', v)), 3000)
  sequenceInterval4$.connect();

  const sequenceInterval5$ = interval(1000).pipe(share()) // SHARE полный обновленный аналог publish, refCount
  sequenceInterval5$.subscribe((v) => console.log('Sub 9', v))
  setTimeout(() => sequenceInterval5$.subscribe((v) => console.log('Sub 10', v)), 3000)
};

export default MultiCasting