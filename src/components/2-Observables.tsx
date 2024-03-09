import React, { useState, useRef } from 'react';
import { Button, Divider, Input, Typography, Badge, Avatar } from 'antd';
import { Observable, Subscription, interval, from, iif, of, filter, skip, take, range } from 'rxjs';
import { AjaxResponse, ajax } from 'rxjs/ajax';
 

const { Title } = Typography

interface IAvatar {
  login: string;
  avatar_url: string;
}
 
const Observables: React.FC = () => {
  const [timerValue, setTimerValue] = useState(0);
  const [intervalValue, setIntervalValue] = useState(0);
  const [iifValue, setIIFValue] = useState<number[] | null>(null);
  const [fromValue, setFromValue] = useState<number[] | null>(null);
  const [ofValue, setOfValue] = useState<number[] | null>(null);
  const [rangeValue, setRangeValue] = useState<number[] | null>(null);
  const [avatarsValue, setAvatarsValue] = useState<IAvatar[] | null>(null);

  const counter = useRef<number>(0);
  const fromValueRef = useRef<number[] | null>(null);
  const ofValueRef = useRef<number[] | null>(null);
  const iifValueRef = useRef<number[] | null>(null);
  const rangeValueRef = useRef<number[] | null>(null);
  const avatarsValueRef = useRef<IAvatar[] | null>(null);
    
  const unsubscribe = useRef<Subscription | null>(null);
  const unsubscribeInterval = useRef<Subscription | null>(null);
  const unsubscribeIIFInterval = useRef<Subscription | null>(null);

  const sequence$ = new Observable<number>((subscriber)=> {
    const intervalId = setInterval(() => {
      subscriber.next(++counter.current)
    }, 100);
    return () => {
      clearInterval(intervalId)
    }
  });

  const handleStartTimer = (sequence$: Observable<number>) => () => {
    if(!timerValue){
      unsubscribe.current = sequence$.subscribe((value) => {
        setTimerValue(value)
      })
    }
  }

  const handleStopTimer = () => {
    if(unsubscribe.current){
      setTimerValue(counter.current = 0)
      unsubscribe.current.unsubscribe()
    }
  }

  const handleStartObservableOperatorInterval = () => {
    if(!intervalValue){
      unsubscribeInterval.current = interval(100).subscribe((value) => {
        setIntervalValue(value)
      })
    }
  }

  const handleStopObservableOperatorInterval = () => {
    if(unsubscribeInterval.current){
      setIntervalValue(counter.current = 0)
      unsubscribeInterval.current.unsubscribe()
    }
  }

  const handleStartObservableOperatorFrom = () => {
    if(!fromValue){
      from([10, 20, 30]).subscribe((value) => {
        fromValueRef.current = [...(fromValueRef.current ?? []), value]
        setFromValue([...(fromValueRef.current ?? [])])
      })
    }
  }

  const handleStopObservableOperatorFrom = () => {
    setFromValue(fromValueRef.current = null)
  }

  const handleStartObservableOperatorOf = () => {
    if(!ofValue){
      of(10, 20, 30).subscribe((value) => {
        ofValueRef.current = [...(ofValueRef.current ?? []), value]
        setOfValue([...(ofValueRef.current ?? [])])
      })
    }
  }

  const handleStopObservableOperatorOf = () => {
    setOfValue(ofValueRef.current = null)
  }

  const handleStartObservableOperatorIIF = (value: boolean) => () => {
    if(!iifValue){
      unsubscribeIIFInterval.current = iif(() => value, 
        interval(100).pipe(skip(1), take(20), filter(x=> !!x && x%2 === 0)), 
        interval(100).pipe(skip(1), take(20), filter(x=> x%2 !== 0))
      )
        .subscribe((value) => {
          iifValueRef.current = [...(iifValueRef.current ?? []), value]
          setIIFValue([...(iifValueRef.current ?? [])])
      })
    }
  }

  const handleStopObservableOperatorIIF = () => {
    if(unsubscribeIIFInterval.current){
      setIIFValue(iifValueRef.current = null)
      unsubscribeIIFInterval.current.unsubscribe()
    }
  }

  const handleStartObservableOperatorRange= ({start, end}: {start: number, end: number}) => () => {
    if(!rangeValue){
      range(start, end)
        .subscribe((value) => {
          rangeValueRef.current = [...(rangeValueRef.current ?? []), value]
          setRangeValue([...(rangeValueRef.current ?? [])])
      })
    }
  }

  const handleStopObservableOperatorRange = () => {
    setRangeValue(rangeValueRef.current = null)
  }

  const handleLoadObservable = () => {
    if(!avatarsValue){
      ajax<IAvatar[]>('https://api.github.com/users?per_page=5').subscribe((avatars: AjaxResponse<IAvatar[]>) => {
        avatarsValueRef.current = [...(avatars?.response ?? []).map(item => ({
          login: item.login,
          avatar_url: item.avatar_url
        }))]
        setAvatarsValue([...(avatarsValueRef.current ?? [])])
      })
    }
  }

  const handleStopObservable = () => {
    setAvatarsValue(avatarsValueRef.current = null)
  }

  return (
    <>
      <Title>Custom Observable:</Title>
      <br />
      <Input disabled value={timerValue} style={{maxWidth: 130}}/> 
      <br />
      <Button type="primary" onClick={handleStartTimer(sequence$)}>Start timer</Button>
      <Button type="primary" onClick={handleStopTimer} >Stop timer</Button>
      <Divider />
      <Title>Observable operation (interval):</Title>
      <br />
      <Input disabled value={intervalValue} style={{maxWidth: 130}}/> 
      <br />
      <Button type="primary" onClick={handleStartObservableOperatorInterval}>Start interval</Button>
      <Button type="primary" onClick={handleStopObservableOperatorInterval} >Stop interval</Button>
      <Divider />
      <Title>Observable operation (from):</Title>
      {(fromValue ?? []).map((value, i) => <Badge key={i} count={value} />)}
      <br />
      <Button type="primary" onClick={handleStartObservableOperatorFrom}>Start from</Button>
      <Button type="primary" onClick={handleStopObservableOperatorFrom}>Stop from</Button>
      <Divider />
      <Title>Observable operation (of):</Title>
      {(ofValue ?? []).map((value, i) => <Badge color={'blue'} key={i} count={value} />)}
      <br />
      <Button type="primary" onClick={handleStartObservableOperatorOf}>Start of</Button>
      <Button type="primary" onClick={handleStopObservableOperatorOf}>Stop of</Button>
      <Divider />
      <Title>Observable operation (iif):</Title>
      {(iifValue ?? []).map((value, i) => <Badge color={'green'} key={i} count={value} />)}
      <br />
      <Button type="primary" onClick={handleStartObservableOperatorIIF(true)}>Show even</Button>
      <Button type="primary" onClick={handleStartObservableOperatorIIF(false)}>Start odd</Button>
      <Button type="primary" onClick={handleStopObservableOperatorIIF}>Refresh</Button>
      <Divider />
      <Title>Observable operation (range):</Title>
      {(rangeValue ?? []).map((value, i) => <Badge color={'cyan'} key={i} count={value} />)}
      <br />
      <Button type="primary" onClick={handleStartObservableOperatorRange({start: 1, end: 10})}>Show range</Button>
      <Button type="primary" onClick={handleStopObservableOperatorRange}>Stop range</Button>
      <Divider />
      <Title>Observable operation (ajax):</Title>
      <div style={{display: 'flex', justifyContent: 'space-around'}} >
        {(avatarsValue ?? []).map((avatar: IAvatar, i:number) =>
          <div key={i}>
            <Avatar src={avatar?.avatar_url} />
            <div>{avatar?.login}</div>
          </div>
        )}
      </div>
      <br />
      <Button type="primary" onClick={handleLoadObservable}>Load avatars</Button>
      <Button type="primary" onClick={handleStopObservable}>Clear</Button>
      <Divider />
    </>
  )

}

export default Observables