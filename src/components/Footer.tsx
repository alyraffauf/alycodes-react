import React from "react";
import "./Footer.css";

// Social links configuration
const SOCIAL_LINKS = [
  {
    href: "https://linkedin.com/in/alyraffauf",
    label: "LinkedIn",
    ariaLabel: "LinkedIn profile",
  },
  {
    href: "https://github.com/alyraffauf",
    label: "GitHub",
    ariaLabel: "GitHub profile",
  },
  {
    href: "https://bsky.app/profile/aly.ruffruff.party",
    label: "Bluesky",
    ariaLabel: "Bluesky profile",
  },
  {
    href: "mailto:aly@aly.codes",
    label: "Email",
    ariaLabel: "Email contact",
  },
];

const Footer: React.FC = () => {
  const currentYear: number = new Date().getFullYear();

  // Render social links section
  const renderSocialLinks = () => (
    <div className="social-links">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="social-link"
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={link.ariaLabel}
        >
          {link.label}
        </a>
      ))}
    </div>
  );

  // Render footer bottom with copyright
  const renderFooterBottom = () => (
    <div className="footer-bottom text-center">
      <p className="text-muted font-mono text-sm">
        &copy; {currentYear} Aly Raffauf. Built with React.js + vibes.
      </p>
    </div>
  );

  return (
    <footer className="footer section" role="contentinfo">
      <div className="container">
        <div className="footer-content text-center">
          {renderSocialLinks()}
          {renderFooterBottom()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
