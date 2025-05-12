import { useState, useEffect } from 'react'
import { supabase } from '../supabase';
import { useUser } from '../contexts/UserContext';

export default function ChallengeListItem({challenge, onSelectPage}) {
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
            const participant = user && challenge.participants.find(
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