import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useUser } from '../contexts/UserContext';
import { useChallenges } from '../contexts/UseChallenges';
import AppStateDisplay from './AppStateDisplay'; 
import AppSubHeader from './AppSubHeader';
import AppContent from './AppContent';
import AppIcon from './AppIcon';
import ChallengeListItem from './ChallengeListItem';
import ChallengeDetailContent from './ChallengeDetailContent';

export default function Challenge({onSelectPage, pageName, challengeId}) {
  const { user, setUser } = useUser();
  const { challenges, loading, error, enhanceChallengesWithActivities } = useChallenges(); 
  const [enhancedChallenges, setEnhancedChallenges] = useState([]);

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

  useEffect(() => {
    if (pageName === 'challengeList' && challenges.length > 0 && user) {
      enhanceChallengesWithActivities(challenges, user.user_id)
        .then(enhanced => {
          setEnhancedChallenges(enhanced);
          console.log('Enhanced challenges:', enhanced);
        });
    }
  }, [pageName, challenges, user]);
  
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
              enhancedChallenges.map(challenge => (
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
    const selectedChallenge = enhancedChallenges.find(
      challenge => challenge.challenge_id === challengeId
    );
    
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
          />
        </AppContent>
      </>
    );
  }
}