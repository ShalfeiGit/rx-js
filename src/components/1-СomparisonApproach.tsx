
import React, { useEffect, useRef, useState } from 'react';
import { Divider, Button, Input } from 'antd';
import { fromEvent } from 'rxjs';
import Title from 'antd/es/typography/Title';


const СomparisonApproach: React.FC = () => {
  const [countByPromise, setCountByPromise] = useState(0);
  
  const callPromiseFn = () => new Promise((res) => {
    setCountByPromise(countByPromise + 1); //значение react отличается от промис на 1
    res(countByPromise);
  }).then(value => console.log('callPromiseFn: ' + value))
  //----------------------------------------------------------------

  const [countByGenerator, setCountByGenerator] = useState(0);
  
  const iterator = function*() {
    setCountByGenerator(countByGenerator + 1) //значение react отличается от генератора на 1
    yield countByGenerator
  }()

  const callGeneratorFn = () => {
    const value = iterator.next().value
    console.log('callGeneratorFn: ' + value)
  } 
  //----------------------------------------------------------------
  const [countByRxjs, setCountByRxjs] = useState(0);
  const buttonRef = useRef<HTMLElement>(null); 

  let count = 0;
  useEffect(() => {
    if(buttonRef.current){
      const subscription = fromEvent(document.getElementById('clickMe') as HTMLElement, 'click')
        .subscribe(() => {
          setCountByRxjs(++count)
        }
      );
      return () => subscription.unsubscribe()
    }
  }, [count])

  return (
    <>
    <Title>
      Сomparison approach:
    </Title>
    <Button type="primary" onClick={callPromiseFn} >Counter by Promise</Button>
    <br />
    <br />
     <Input disabled value={countByPromise} style={{maxWidth: 155}}/> 
     <Divider />
     <Button type="primary" onClick={callGeneratorFn} >Counter by Generator</Button>
    <br />
    <br />
     <Input disabled value={countByGenerator} style={{maxWidth: 164}}/> 
     <Divider />
     <Button type="primary" ref={buttonRef} id='clickMe'>Counter by Rxjs</Button>
    <br />
    <br />
     <Input disabled value={countByRxjs}  style={{maxWidth: 130}}/> 
    </>
  )
}

export default СomparisonApproach
