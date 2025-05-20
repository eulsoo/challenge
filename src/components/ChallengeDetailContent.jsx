import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ChallengeDetailContent({ 
  challenge, 
  activities, 
  activitiesLoading 
}) {
  const { user, setUser } = useUser();
  const completedCount = challenge.participants.filter(p => p.status === 'completed').length;

  // 회차 날짜 계산 함수
  const calculateSequenceDates = () => {
    const dates = [];
    const startDate = new Date(challenge.start_date);
    
    for (let i = 0; i < challenge.duration_days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // YYYY-MM-DD 형식으로 포맷팅 수정
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      dates.push(formattedDate);
    }
    return dates;
  };
  

  // 3. 각 회차별 완료 여부 확인을 위한 함수 추가
  const isDateCompleted = (date) => {
    return activities?.some(activity => 
      activity.date === date && activity.completed
    );
  };

  // 회차 날짜 배열
  const sequenceDates = calculateSequenceDates();


  return (
    <div className="challenge_detail">
      <div className="about_challenge" style={{
        backgroundColor: `${challenge.color}`
      }}>
        <div className="about_title" style={{
          backgroundImage: `
          linear-gradient(
            180deg, rgba(0, 0, 0, 0) 20%, ${challenge.color} 100%), 
            url(${challenge.image})
          `,
          backgroundPosition: 'left top',
          backgroundSize: '100% auto',
          backgroundRepeat: 'no-repeat',
          backgroundClip: 'border-box',
          backgroundOrigin: 'border-box',
        }}>
          <h1>{challenge.title}</h1>
          {
            (() => {
              const participant = user && challenge.participants.find(
                participant => participant.user_id === user.user_id
              );
              const getStateTagText = () => {
                if (!participant) return '시작전';
                switch (participant.status) {
                  case 'in_progress' : return '참여중';
                  case 'completed' : return '완료';
                  case 'failed' : return '실패';
                  default : return '시작전';
                }
              };
              return (
                <span className='state_tag'>{getStateTagText()}</span>
              );
            })()
          }
          
        </div>
        <div className="about_body">
          <p className="description">{ challenge.description }</p>
          <div className="sequence_wrap">
            {/* Swiper 컴포넌트로 회차 표시 */}
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={10}
              slidesPerView="auto"
              // centeredSlides={true}
              // pagination={{ clickable: true }}
              // navigation={true}
              className="sequence_indicator"
            >
              {/* 배지 슬라이드를 먼저 추가 */}
                <SwiperSlide key="badge" className="badge-slide seq_item" style={{ width: '84px' }}>
                  <div className='badge'>
                    <img src={challenge.badge_image} alt="Badge" />
                  </div>
                </SwiperSlide>
                
                {/* 회차 슬라이드 별도로 추가 */}
                {Array(challenge.duration_days).fill().map((_, index) => {
                  const currentDate = sequenceDates[index];
                  const isComplete = isDateCompleted(currentDate);
                  
                  return (
                    <SwiperSlide 
                      key={`day-${index}`} 
                      className={`seq_item ${isComplete ? 'completed' : ''}`}
                      style={{ width: '84px' }}
                    >
                      <button className="btn">
                        <b>{index + 1}</b>
                        <i>회차</i>
                      </button>
                      <time>{currentDate}</time>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>

      </div>
      <div className="challenge_participants">
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
      <div className="challenge_info">
        <strong>
          <b>챌린지 횟수</b><i>{challenge.duration_days}회</i>
        </strong>
        <strong>
          <b>목표기간</b><i>{challenge.start_date} ~ {challenge.end_date}</i>
        </strong>
        <strong>
          <b>참여자</b>
          <i>{completedCount ? completedCount + '명 성공 /' : ''} {challenge.participant_count ? challenge.participant_count + '명' : '없음'}</i>
        </strong>
      </div>
      <button
        className='btn big round' 
        style={{backgroundColor: `${challenge.color}`}}
      >시작하기</button>

    </div>
  );
}