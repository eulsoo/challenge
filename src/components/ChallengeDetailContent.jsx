import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useUser } from '../contexts/UserContext';

export default function ChallengeDetailContent({ challenge }) {

  return (
    <div className="challenge_detail">
      <div className="about_challenge">
        <div className="about_title">
          <h1>열흘만 써봅시다</h1>
          <strong className="state_tag">시작전</strong>
        </div>
        <div className="about_body">
          <p className="description">“예수님과의 친밀한 관계에 눈 뜨기” 예수님과 친밀하다고 느낀 경험이 있는지 적어보십시오.</p>
          <div className="sequence_indicator">
            <div className='badge'><img src={challenge.badge_image} /></div>
            <span className="seq_item"></span>
          </div>
        </div>

      </div>
    </div>
  );
}