import { createContext, useContext, useState } from 'react';

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

// Provider 컴포넌트
export function UserProvider({ children }) {
  const [user, setUser] = useState({
    user_id: "5250b8a4-9e90-4a18-95e7-244c1bde327c",
    isAuthenticated: true
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}