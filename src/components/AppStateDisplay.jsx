export default function AppStateDisplay({loading, error}) {
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  return null;
}