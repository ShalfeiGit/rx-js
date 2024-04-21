import {  asyncScheduler, asapScheduler, queueScheduler, observeOn, of } from "rxjs";
// asap - micro
// asyncScheduler - marco
// queue

const Schedular = () => {
  of(5,6,7,8).pipe(observeOn(asyncScheduler)).subscribe((v) => {console.log(v)})
  of(1,2,3,4).pipe(observeOn(asapScheduler)).subscribe((v) => {console.log(v)})
  of(0).pipe(observeOn(queueScheduler)).subscribe((v) => {console.log(v)})
};

export default Schedular