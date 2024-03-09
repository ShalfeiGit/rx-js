import React, { useState } from 'react';
import { Button, Divider, Input } from 'antd';
import { Observable, Subscription } from 'rxjs';
 
const Observables: React.FC = () => {
  const [inputValue1, setInputValue1] = useState(0);
  const [unsubscribe, setUnsubscribe] = useState<Subscription | null>(null);

  let counter = 0;
  const sequence$ = new Observable<number>((subscriber)=> {
    const intervalId = setInterval(() => {
      subscriber.next(++counter)
    }, 100);
    return () => {
      clearInterval(intervalId)
    }
  });

  const handleStartTimer = (sequence$: Observable<number>) => () => {
    if(!unsubscribe){
      const unsubscribeRef = sequence$.subscribe((value) => {
        setInputValue1(value)
      })
      setUnsubscribe(unsubscribeRef)
    }
  }

  const handleStopTimer = () => {
    unsubscribe?.unsubscribe()
    setInputValue1(counter = 0)
    setUnsubscribe(null)
  }
 
  return (
    <>
      <br />
      <Input disabled value={inputValue1} style={{maxWidth: 130}}/> 
      <br />
      <Button type="primary" onClick={handleStartTimer(sequence$)}>Start timer</Button>
      <Button type="primary" onClick={handleStopTimer} >Stop timer</Button>
      <Divider />
    </>
  )

}

export default Observables