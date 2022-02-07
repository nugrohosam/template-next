const Footer: React.FC = () => {
  return (
    <footer className="footer__pama">
      <h4 className="text__grey-50">
        {new Date().getFullYear()} &copy; PT Pamapersada Nusantara
      </h4>
    </footer>
  );
};

export default Footer;
