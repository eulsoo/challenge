import Lottie from 'lottie-react';
import signitureAni from '../assets/Signature.json';

export default function ChallengeDetail({onSelectPage, user}) {
  return (
  <div>
    <h2>상세</h2>
    <Lottie
        animationData={signitureAni}
        loop={true}
        autoplay={true}
        style={{ width: 300, height: 300 }} // 원하는 크기로 조정하세요
      />
  </div>
  )
}