import { useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useUser } from '../contexts/UserContext';

function ChallengeItem({challenge, onSelectPage}) {
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [badgeImageUrl, setBadgeImageUrl] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const { user, setUser } = useUser();

  useEffect(() => {
    async function fetchBgData() {
      const { data } = await supabase.storage.from('images').getPublicUrl('challengeBg');
      setBgImageUrl(data.publicUrl);
    }
    async function fetchBadgeData() {
      const { data } = await supabase.storage.from('images').getPublicUrl('challengeBadge');
      setBadgeImageUrl(data.publicUrl);
    }
    async function fetchProfileData() {
      const { data } = await supabase.storage.from('images').getPublicUrl('profileImg');
      setProfileImageUrl(data.publicUrl);
    }
    fetchBgData();
    fetchBadgeData();
    fetchProfileData();
  }, [challenge.image]);


  return (
    <li className='challenge_item' style={{
      backgroundImage: `
        linear-gradient(
          180deg, rgba(0, 0, 0, 0.00) 18.75%, ${challenge.color} 55.38%), 
          url(${bgImageUrl}/${challenge.image})
      `,
      backgroundPosition: 'left top',
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      backgroundClip: 'border-box',
      backgroundOrigin: 'border-box',

    }}>
      <div className='title'>
      <h2>{challenge.title}</h2>
      </div>
      <div className='challengers'>
        {
          challenge.participant_count ? 
            <>
              <div className='avatars'>
                {challenge.participants.map((participant, i) => (
                  <span 
                    key={`${participant.enrollment_id}-${i}`}
                    style={{
                      backgroundImage: `url(${profileImageUrl}/${participant.profile_image})`,
                      backgroundSize: '100% auto',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >{participant.name}</span>
                ))}
              </div>
              <b>{`${challenge.participant_count}명 참여`}</b> 
            </> :
            <b>참여자가 없습니다.</b>
        }
      </div>
      <div className='info'>
        <div className='badge'><img src={`${badgeImageUrl}/${challenge.badge_image}`} /></div>
        <p className='description'>{challenge.description}</p>
        { (() => {
            const participant = challenge.participants.find(
              participant => participant.user_id === user.user_id
            );
            
            const getButtonConfig = () => {
              if (!participant) return {
                text: '시작하기',
                className: 'btn trans small'
              };
              
              switch (participant.status) {
                case 'in_progress': return {
                  text: '참여중',
                  className: 'btn trans small active'
                };
                case 'completed': return {
                  text: '성공!',
                  className: 'btn trans small success'
                };
                case 'failed': return {
                  text: '다시시작',
                  className: 'btn trans small warning'
                };
                case 'padding': return {
                  text: '시작하기',
                  className: 'btn trans small'
                };
                default: return {
                  text: '시작하기',
                  className: 'btn trans small'
                };
              }
            };

            const buttonConfig = getButtonConfig();

            return (
              <button 
                className={buttonConfig.className}
                onClick={() => onSelectPage('challengeDetail', 'challenge_id')}
              >
                {buttonConfig.text}
              </button>
            );
          })()
        }
      </div>
    </li>
  );
}
// 챌린지 헤더
function ChallengeHeader() {
  return (
    <div className='app_head'>
      <button className='ico_btn back'>
      <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path style={{fill: 'var(--text-primary)'}} d="M15.707 4.293C15.8945 4.48053 15.9998 4.73484 15.9998 5C15.9998 5.26516 15.8945 5.51947 15.707 5.707L9.41403 12L15.707 18.293C15.8892 18.4816 15.99 18.7342 15.9877 18.9964C15.9854 19.2586 15.8803 19.5094 15.6948 19.6948C15.5094 19.8802 15.2586 19.9854 14.9964 19.9877C14.7342 19.99 14.4816 19.8892 14.293 19.707L7.29303 12.707C7.10556 12.5195 7.00024 12.2652 7.00024 12C7.00024 11.7348 7.10556 11.4805 7.29303 11.293L14.293 4.293C14.4806 4.10553 14.7349 4.00021 15 4.00021C15.2652 4.00021 15.5195 4.10553 15.707 4.293Z"/>
      </svg>
      </button>
      <h1 className='sub_title'>챌린지</h1>
    </div>
  );
}
// 챌린지 아이템을 children으로 안길수 있도록 셋팅하는 컴포넌트
function ChallengeContent({children}) {
  return (
    <main className='app_body'>
      <ul className='challenges'>
        {children}
      </ul>
    </main>
  );
}
// 로딩 및 에러 상태 컴포넌트
function ChallengeStatus({loading, error}) {
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  return null;
}
// 메인 컴포넌트 
function ChallengeContainer({children}) {
  return (
    <>
      <ChallengeHeader />
      {children}
    </>
  );
}
export default function ChallengeList({onSelectPage}) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading || error) {
    <ChallengeContainer>
      <ChallengeStatus loading={loading} error={error}/>
    </ChallengeContainer>
  }

  return (
    <ChallengeContainer>
      <ChallengeContent>
        {
          challenges.map(challenge => (
            <ChallengeItem 
              key={challenge.challenge_id}
              challenge={challenge}
              onSelectPage={onSelectPage}
            />
          ))
        }
      </ChallengeContent>
    </ChallengeContainer>
  );
}