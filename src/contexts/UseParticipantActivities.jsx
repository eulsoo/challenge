// src/hooks/useParticipantActivities.js

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const useParticipantActivities = (enrollmentId) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('participant_activities')
          .select(`
            id,
            enrollment_id,
            date,
            completed,
            diary_entry_id,
            created_at,
            updated_at
          `)
          .eq('enrollment_id', enrollmentId)
          .order('date', { ascending: true });

        if (error) throw error;
        
        setActivities(data || []);
      } catch (err) {
        console.error('활동 기록 로딩 오류:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (enrollmentId) {
      fetchActivities();
    }
  }, [enrollmentId]);

  return { activities, loading, error };
};