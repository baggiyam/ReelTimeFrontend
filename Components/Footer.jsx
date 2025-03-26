// src/components/Footer.jsx
import React from "react";
import "../Styles/footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Reeltime. All Rights Reserved.</p>
        <div className="social-links">
          <a href="#" className="social-icon">Facebook</a>
          <a href="#" className="social-icon">Twitter</a>
          <a href="#" className="social-icon">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
