import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useUser } from '../contexts/UserContext'; // 이미 임포트됨
import { useParticipantActivities } from '../contexts/UseParticipantActivities';
import AppStateDisplay from './AppStateDisplay'; 
import AppSubHeader from './AppSubHeader';
import AppContent from './AppContent';
import AppIcon from './AppIcon';
import ChallengeListItem from './ChallengeListItem';
import ChallengeDetailContent from './ChallengeDetailContent';
import { useChallenges } from '../contexts/UseChallenges';

export default function Challenge({onSelectPage, pageName, challengeId}) {
  const { user, setUser } = useUser();
  const { challenges, loading, error } = useChallenges(); 

  // 0. challengeDetail 페이지일 때 사용할 challenge와 activities
  const selectedChallenge = challengeId ? challenges.find(
    challenge => challenge.challenge_id === challengeId
  ) : null;

  // 1. 현재 유저의 enrollment_id 찾기
  const currentParticipant = selectedChallenge?.participants.find(
    participant => participant.user_id === user.user_id
  );
  
  // 2. useParticipantActivities 훅 사용 수정
  const { activities, loading: activitiesLoading } = useParticipantActivities(
    currentParticipant?.enrollment_id  
  );


  // 로그아웃 핸들
  const handleLogout = async () => {
    try {
      console.log('로그아웃 시도');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('로그아웃 성공');
      // onSelectPage('login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  if (loading || error) {
    return (
      <AppStateDisplay loading={loading} error={error}/>
    );
  }
  if (pageName === 'challengeList') {
    return (
      <>
        <AppSubHeader>
          <AppSubHeader.Left>
            {/* <button className='ico_btn back'>
              <AppIcon name={'back'} />
            </button> */}
          </AppSubHeader.Left>
          <AppSubHeader.Center>
            <h1 className='sub_title'>{'챌린지'}</h1>
          </AppSubHeader.Center>
          <AppSubHeader.Right>
            <button 
              className='btn small line'
              onClick={handleLogout}
            >로그아웃</button>
          </AppSubHeader.Right>
        </AppSubHeader>
        <AppContent>
          <ul className='challenges'>
            {
              challenges.map(challenge => (
                <ChallengeListItem 
                  key={challenge.challenge_id}
                  challenge={challenge}
                  onSelectPage={onSelectPage}
                />
              ))
            }
          </ul>
        </AppContent>
      </>
    );
  }
  if (pageName === 'challengeDetail') {
    const selectedChallenge = challenges.find(
      challenge => challenge.challenge_id === challengeId
    );
    console.log(selectedChallenge);
    
    return (
      <>
        <AppSubHeader>
          <AppSubHeader.Left>
            <button 
              className='ico_btn back' 
              onClick={() => onSelectPage('challengeList')}
            >
              <AppIcon name={'back'} />
            </button>
          </AppSubHeader.Left>
          <AppSubHeader.Center>
            <h1 className='sub_title'>{'챌린지'}</h1>
          </AppSubHeader.Center>
          <AppSubHeader.Right>
            <button className='btn small line'>그만두기</button>
          </AppSubHeader.Right>
        </AppSubHeader>
        <AppContent>
          <ChallengeDetailContent 
            challenge={selectedChallenge}
            activities={activities}
            activitiesLoading={activitiesLoading}
          />
        </AppContent>
      </>
    );
  }
}