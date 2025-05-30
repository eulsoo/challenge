import { useUser } from '../contexts/UserContext';

export default function ChallengeListItem({challenge, onSelectPage}) {
  const { user, setUser } = useUser();

  return (
    <li className='challenge_item' style={{
      backgroundImage: `
        linear-gradient(
          180deg, rgba(0, 0, 0, 0.00) 18.75%, ${challenge.color} 55.38%), 
          url(${challenge.image})
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
      <div className='challenge_participants'>
        {
          challenge.participant_count ? 
            <>
              <div className='avatars'>
                {challenge.participants.map((participant, i) => (
                  <span 
                    key={`${participant.enrollment_id}-${i}`}
                    style={{
                      backgroundImage: `url(${participant.profile_image})`,
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
        <div className='badge'><img src={`${challenge.badge_image}`} /></div>
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
                  text: '완료',
                  className: 'btn trans small success'
                };
                case 'failed': return {
                  text: '다시시작',
                  className: 'btn trans small warning'
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
                onClick={() => onSelectPage('challengeDetail', challenge.challenge_id)}
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