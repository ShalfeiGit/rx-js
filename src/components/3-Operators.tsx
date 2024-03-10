import React, { useRef, useState } from 'react';
import { Typography, Badge, Button } from 'antd';
import { combineLatest, delay, interval, map, concat, take, forkJoin, merge, partition, race, zip } from 'rxjs';

const { Title, Text } = Typography

const Operators: React.FC = () => {

  const [combineLatestState, setCombineLatestState] = useState<number[][]>([]);
  const combineLatestValue = useRef<number[][]>([]);

  const [concatState, setConcatState] = useState<number[]>([]);
  const concatValue = useRef<number[]>([]);

  const [forkJoinState, setForkJoinState] = useState<{firstSequence$: number; secondSequence$: number}[]>([]);
  const forkJoinValue = useRef<{firstSequence$: number; secondSequence$: number}[]>([]);

  const [mergeState, setMergeState] = useState<number[]>([]);
  const mergeValue = useRef<number[]>([]);
  
  const [partitionState, setPartitionState] = useState<number[]>([]);
  const partitionValue = useRef<number[]>([]);
  
  const [raceState, setRaceState] = useState<number[]>([]);
  const raceValue = useRef<number[]>([]);

  const [zipState, setZipState] = useState<number[]>([]);
  const zipValue = useRef<number[]>([]);

  const handleStartJoinCreationOperators = () => {
    if(!combineLatestState.length){
      const firstSequence$ =  interval(500).pipe(map(x => (x + 1)*10), take(5))
      const secondSequence$ = interval(1000).pipe(map(x => (x + 1)), take(2))
      combineLatest([firstSequence$, secondSequence$]).subscribe((value) => {
        combineLatestValue.current = [...combineLatestValue.current, value]
        setCombineLatestState(combineLatestValue.current)
      });
    }

    if(!concatState.length){
      const firstSequence$ =  interval(100).pipe(map(x => (x + 1)*10), take(3))
      const secondSequence$ = interval(200).pipe(delay(1000), map(x => (x + 1)), take(2))
      concat(firstSequence$, secondSequence$).subscribe((value) => {
        concatValue.current = [...concatValue.current, value]
        setConcatState(concatValue.current)
      });
    }
    
    if(!forkJoinState.length){
      const firstSequence$ =  interval(100).pipe(map(x => (x + 1)*10), take(3))
      const secondSequence$ = interval(1000).pipe(delay(1000), map(x => (x + 1)), take(2))
      forkJoin({firstSequence$, secondSequence$}).subscribe((value) => {
        forkJoinValue.current = [value]
        setForkJoinState(forkJoinValue.current)
      });
    }
    
    if(!mergeState.length){
      const firstSequence$ =  interval(200).pipe(map(x => (x + 1)*10), take(3))
      const secondSequence$ = interval(300).pipe( map(x => (x + 1)), take(2))
      merge(firstSequence$, secondSequence$).subscribe((value) => {
        mergeValue.current = [...mergeValue.current, value]
        setMergeState(mergeValue.current)
      });
    }
    
    if(!partitionState.length){
      const sequence$ =  interval(100).pipe(map(x => x + 1), take(10))
      const [evens$, odds$] = partition(sequence$, value => value % 2 === 0)
      concat(evens$, odds$).subscribe((value) => {
        partitionValue.current = [...partitionValue.current, value]
        setPartitionState(partitionValue.current)
      });
    }
    
    if(!raceState.length){
      const firstSequence$ =  interval(100).pipe(map(x => (x + 1)*10), take(3))
      const secondSequence$ = interval(1000).pipe(delay(1000), map(x => (x + 1)), take(2))
      race(firstSequence$, secondSequence$).subscribe((value) => {
        raceValue.current = [...raceValue.current, value]
        setRaceState(raceValue.current)
      });
    }
    
    if(!zipState.length){
      const firstSequence$ =  interval(100).pipe(map(x => (x + 1)*10), take(3))
      const secondSequence$ = interval(1000).pipe(delay(1000), map(x => (x + 1)), take(4))
      zip(firstSequence$, secondSequence$).subscribe((value) => {
        zipValue.current = [...zipValue.current, value[0]*value[1]]
        setZipState(zipValue.current)
      });
    }
  }
  

  const handleStopJoinCreationOperators = () => {
    combineLatestValue.current = [];
    setCombineLatestState([]);

    concatValue.current = [];
    setConcatState([]);

    forkJoinValue.current = [];
    setForkJoinState([]);
    
    mergeValue.current = [];
    setMergeState([]);
    
    partitionValue.current = [];
    setPartitionState([]);
    
    raceValue.current = [];
    setRaceState([]);
  }
  
 
  return (
    <>
      <Title>Join Creation Operators:</Title>
      <div><Text>combineLatest:</Text></div>
      <div>
        {combineLatestState.map((value, i) => <>
          <Badge color={'cyan'} key={i} count={value[0]} />{`-`}
          <Badge color={'red'} key={i} count={value[1]} />{`--------`}
        </>)}
      </div>
      <div><Text>concat:</Text></div>
      <div>
        {concatState.map((value, i) => <>
          <Badge color={'green'} key={i} count={value} />{`--`}
        </>)}
      </div>
      <div><Text>forkJoin:</Text></div>
      <div>
        {forkJoinState.map((value, i) => <>
          <Badge color={'green'} key={i} count={value.firstSequence$} />{`--`}
          <Badge color={'cyan'} key={i} count={value.secondSequence$} />{`-`}
        </>)}
      </div>
      <div><Text>merge:</Text></div>
      <div>
        {mergeState.map((value, i) => <>
          <Badge color={'gold'} key={i} count={value} />{`--`}
        </>)}
      </div>
      <div><Text>partition:</Text></div>
      <div>
        {partitionState.map((value, i) => <>
          <Badge color={'lime'} key={i} count={value} />{`--`}
        </>)}
      </div>
      <div><Text>race:</Text></div>
      <div>
        {raceState.map((value, i) => <>
          <Badge color={'purple'} key={i} count={value} />{`--`}
        </>)}
      </div>
      <div><Text>zip:</Text></div>
      <div>
        {zipState.map((value, i) => <>
          <Badge color={'magenta'} key={i} count={value} />{`--`}
        </>)}
      </div>
      <Button type="primary" onClick={handleStartJoinCreationOperators}>Start join creation operators</Button>
      <Button type="primary" onClick={handleStopJoinCreationOperators}>Clear</Button>
    </>
  )

}

export default Operators