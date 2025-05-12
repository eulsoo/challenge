function AppSubHeader({ children }) {
  return (
    <div className='app_head'>
      { children }
    </div>
  );
}
function Left({ children }) {
  return <>{ children }</>;
}
function Center({children }) {
  return <>{ children }</>;
}
function Right({ children }) {
  return <>{ children }</>;
}

AppSubHeader.Left = Left;
AppSubHeader.Center = Center;
AppSubHeader.Right = Right;

export default AppSubHeader;