import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

// 컨텍스트 생성
export const UserContext = createContext();

// 커스텀 훅 생성
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  console.log('UserContext 렌더링');

  useEffect(() => {
    console.log('UserContext useEffect 시작, loading:', loading);
    
    async function fetchUserData() {
      try {
        console.log('fetchUserData 시작');
        console.log('세션 체크 시작');
        const { data } = await supabase.auth.getSession();
        console.log('세션 확인 결과:', data);
        
        if (data.session) {
          console.log('세션 있음');
          setUser({
            user_id: data.session.user.id,
            // 임시로 기본 사용자 정보만 설정
            name: 'User',
            profile_image: null
          });
        } else {
          console.log('세션 없음');
          setUser(null);
        }
        setLoading(false);
        console.log('setLoading(false) 호출됨');
      } catch (error) {
        console.error('오류 발생:', error);
        setLoading(false);
        console.log('오류 후 setLoading(false) 호출됨');
      }
    }
    
    fetchUserData();
  }, []);
  
  console.log('UserContext 현재 상태:', { user, loading });
  
  // UserContext.jsx에서 확실한 상태 업데이트 보장
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth 이벤트:', event, Boolean(session));
    
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
      if (session) {
        setUser({
          user_id: session.user.id,
          name: 'User',
          profile_image: null
        });
      } else {
        setUser(null);
      }
      // 상태 업데이트가 확실히 반영되도록 로딩 상태 변경
      setLoading(false);
    }
  });
  
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}