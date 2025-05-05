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
            const participant = challenge.participants.find(participant => participant.user_id === user.user_id);
            
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

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (challenges.length === 0) {
    return <div className="empty-list">등록된 챌린지가 없습니다.</div>;
  }

  return (
    <ul className='challenges'>
      {
        challenges.map(challenge => (
          <ChallengeItem 
            key={challenge.challenge_id}
            challenge={challenge}
            onSelectPage={onSelectPage}
          />
        ))
      }
    </ul>
  );
}