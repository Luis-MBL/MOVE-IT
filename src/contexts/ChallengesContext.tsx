import { createContext, useState, ReactNode, useEffect } from 'react';

import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

interface ChallengesProviderProps {
  children: ReactNode;
  level:number,
  currentExperience: number,
  challengesCompleted: number
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
  closeLevelUpModal: ()=> void,
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }:ChallengesProviderProps ) {
  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 1);
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 1);

  const [activeChallenge, setActiveChallenge] = useState(null);

  const[isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow((level+1) * 4, 2)

  

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted])

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  function levelUp(){
    setLevel(level + 1);
    setIsLevelUpModalOpen(true);
  }

  function closeLevelUpModal(){
    setIsLevelUpModalOpen(false);
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
      finalExperience = (finalExperience - experienceToNextLevel);
    }
    
    setCurrentExperience(finalExperience);
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
    closeLevelUpModal
    }}>
    {children}

    {isLevelUpModalOpen && <LevelUpModal />}
  </ChallengesContext.Provider>  
  )
 }