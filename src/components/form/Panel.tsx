const Panel: React.FC = ({ children }) => {
  return (
    <div className="profile-detail">
      <div className="profile-detail__info">{children}</div>
    </div>
  );
};

export default Panel;
