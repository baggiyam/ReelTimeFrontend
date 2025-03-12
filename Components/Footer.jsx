import React from 'react';
import "../Styles/footer.css"; // Importing the footer CSS

function Footer() {
  return (
    <footer id="footer">
      <div className="footer-content">
      
        <div className="footer-left">
          <p>© 2025 ReelTime</p>
        </div>

        <div className="footer-right">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook.png" alt="Facebook" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/twitter.png" alt="Twitter" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
