const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl py-8">
        <div className="text-text-muted text-center text-xs tracking-widest uppercase">
          IS207 Phát triển ứng dụng Web - Fashion Store @
          {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
