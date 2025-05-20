import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 챌린지 데이터 작업
  useEffect(() => {
    async function fetchChallenges() {
      try {
        // 데이터 로딩 시작 전에 로딩 상태 활성화
        setLoading(true);
        
        // 1. 이미지 URL 먼저 가져오기
        const [badgeResponse, bgResponse, profileResponse] = await Promise.all([
          supabase.storage.from('images').getPublicUrl('challengeBadge'),
          supabase.storage.from('images').getPublicUrl('challengeBg'),
          supabase.storage.from('images').getPublicUrl('profileImg'),
        ]);
        const badgeImageUrl = badgeResponse.data.publicUrl;
        const bgImageUrl = bgResponse.data.publicUrl;
        const profileImageUrl = profileResponse.data.publicUrl;

        // 2. 챌린지 데이터 불러오기 
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

      
        // 3. 챌린지별 참여자 수 계산하여 데이터 가공
        const processedChallenges = challengesData.map(challenge => {
          // 참여자 정보 가공
          const participants = challenge.participants?.map(p => {
            return {
              enrollment_id: p.enrollment_id,
              user_id: p.user_id,
              status: p.status,
              name: p.users?.name || '알 수 없음',
              profile_image: `${profileImageUrl}/${p.users?.profile_image}` || null
            };
          }) || [];
          
          return {
            ...challenge,
            participants,
            participant_count: participants.length,
            badge_image: `${badgeImageUrl}/${challenge.badge_image}`,
            image: `${bgImageUrl}/${challenge.image}`
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
  return { challenges, loading, error }
}