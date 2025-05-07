// 챌린지 컨텐츠들이 children으로 안길수 있도록 셋팅하는 컴포넌트
export default function ChallengeContent({children}) {
  return (
    <main className='app_body'>
      {children}
    </main>
  );
}