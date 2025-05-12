import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useUser } from '../contexts/UserContext'; // 이미 임포트됨
import AppStateDisplay from './AppStateDisplay'; 
import AppSubHeader from './AppSubHeader';
import AppContent from './AppContent';
import AppIcon from './AppIcon';
import ChallengeListItem from './ChallengeListItem';
import ChallengeDetailContent from './ChallengeDetailContent';

export default function Challenge({onSelectPage, pageName}) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('챌린지');
  const { user, setUser } = useUser(); // useUser 훅 사용

  // 챌린지 데이터 작업
  useEffect(() => {
    async function fetchChallenges() {
      try {
        setLoading(true);

        // 1. 챌린지 데이터 불러오기 
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select(`
            *,
            participants:participants(
              enrollment_id,
              user_id,
              status,
              users:users!user_id(
                user_id, 
                name, 
                profile_image
              )
            )
          `)
          .order('created_at', { ascending: true }); // 생성 순서로 정렬 (최신순)

          console.log("원본 데이터:", challengesData);
        if (challengesError) throw challengesError;

        // 2. 챌린지별 참여자 수 계산하여 데이터 가공
        const processedChallenges = challengesData.map(challenge => {
          // 참여자 정보 가공
          const participants = challenge.participants?.map(p => {
            return {
              enrollment_id: p.enrollment_id,
              user_id: p.user_id,
              status: p.status,
              name: p.users?.name || '알 수 없음',
              profile_image: p.users?.profile_image || null
            };
          }) || [];
          
          return {
            ...challenge,
            participants,
            participant_count: participants.length
          };
        });
        console.log("가공 데이터:", processedChallenges);
        setChallenges(processedChallenges);
      } catch(err) {
        console.error('챌린지 데이터 불러오기 오류:', err);
        setError('챌린지 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, []);

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
          <ChallengeDetailContent />
        </AppContent>
      </>
    );
  }
}