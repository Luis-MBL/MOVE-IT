import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChallengesContext } from './ChallengesContext';

interface CountdownContextData {
  minutes: number, 
  seconds:number,
  hasFinished: boolean,
  isActive: boolean,
  startCountdown: () => void,
  resetCountdown: () => void,
}
interface CountdownContextProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children }:CountdownContextProps ) {
  const { startNewChallenge } = useContext(ChallengesContext);
  let countdownTimeout: NodeJS.Timeout

  const [time, setTime] = useState(0.1*60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time/60);
  const seconds = time%60;
  function resetCountdown(){
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setTime(0.1*60);
    setHasFinished(false);
  }
  function startCountdown(){
    setIsActive(true);
  }
  useEffect(() => {
    if(isActive && time > 0){
      countdownTimeout = setTimeout(()=>{
        setTime(time - 1);
      }, 1000);
    } else if(isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]);

  
   return (
    <CountdownContext.Provider 
    value={{
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountdown,
      resetCountdown,
      }}>
      {children}
    </CountdownContext.Provider>  
   )
 }