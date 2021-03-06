import { createContext, useState, ReactNode, useEffect } from 'react';

import challenges from '../../challenges.json';

interface ChallengesProviderProps {
  children: ReactNode;
}

interface ActiveData 
  {
    type: 'body' | 'eye', 
    description: string, 
    amount: number,
}

interface ChallengesContextData {
  level: number;
  currentExperience: number,
  challengesCompleted: number,
  activeChallenge: null | ActiveData,
  experienceToNextLevel: number,
  levelUp: ()=> void,
  startNewChallenge: ()=> void,
  resetChallenge: ()=> void,
  completeChallenge: ()=> void,
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }:ChallengesProviderProps ) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow((level+1) * 4, 2)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  function levelUp(){
    setLevel(level + 1);
  }

  function startNewChallenge(){
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];
    setActiveChallenge(challenge);
    if(Notification.permission ==='granted'){
      new Notification("Novo desafio!!!", {
        body: `Valendo ${challenge.amount} XP`
      })
    }

  }
  function resetChallenge(){
    setActiveChallenge(null);
  }
  function completeChallenge(){
    if(!activeChallenge){
      return;
    }
    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if(finalExperience >= experienceToNextLevel){
      levelUp();
      finalExperience = finalExperience - experienceToNextLevel;
      setCurrentExperience(finalExperience);
      setActiveChallenge(null);
      setChallengesCompleted(challengesCompleted + 1);
    }

    setChallengesCompleted(challengesCompleted +1);
    setActiveChallenge(null);
  }
   return (
    <ChallengesContext.Provider 
    value={{
      level,
      currentExperience,
      challengesCompleted,
      activeChallenge,
      experienceToNextLevel,
      levelUp,
      startNewChallenge,
      resetChallenge,
      completeChallenge,
      }}>
      {children}
    </ChallengesContext.Provider>  
   )
 }