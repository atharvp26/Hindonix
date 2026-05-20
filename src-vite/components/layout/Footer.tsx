import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { type SVGProps } from "react";

const LinkedInLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.09 20.452H3.56V9h3.53v11.452zM5.323 7.433a2.047 2.047 0 1 1 .003-4.095 2.047 2.047 0 0 1-.003 4.095zM20.452 20.452h-3.53v-5.569c0-1.328-.027-3.038-1.85-3.038-1.85 0-2.133 1.445-2.133 2.937v5.67H9.41V9h3.389v1.561h.047c.472-.896 1.623-1.84 3.34-1.84 3.574 0 4.266 2.352 4.266 5.408v6.323z" />
  </svg>
);

const InstagramLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const footerTopLinks = [
  { name: "About", path: "/about" },
  { name: "Catalogue", path: "/products" },
  { name: "Blogs", path: "/blogs" },
  { name: "Get Quote", path: "/contact" },
];

const socialLinks = [
  { name: "LinkedIn", href: "#", icon: LinkedInLogo },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hindonix.handles?igsh=eTlidHJhdG54OGY1",
    icon: InstagramLogo,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1BjnmmbXY1/",
    icon: FacebookLogo,
  },
];

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      {/* Top Links Section */}
      <div className="border-b border-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {footerTopLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground/80 hover:text-foreground text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Center Content Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          {/* Brand Name */}
          <h3
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
            className="text-2xl font-normal text-foreground tracking-wide leading-none"
          >
            H I N D O N I X<sup className="text-xs ml-0.5">®</sup>
          </h3>

          {/* Contact Info */}
          <div className="space-y-2">
            <p className="flex items-center justify-center gap-2 text-foreground/80 text-sm">
              <Phone className="w-4 h-4" />
              <a
                href="tel:+918850765050"
                className="hover:text-foreground transition-colors"
              >
                T: +91 8850765050
              </a>
            </p>
            <p className="flex items-center justify-center gap-2 text-foreground/80 text-sm">
              <Mail className="w-4 h-4" />
              <a
                href="mailto:info@hindonix.com"
                className="hover:text-foreground transition-colors"
              >
                E: info@hindonix.com
              </a>
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center hover:bg-foreground/30 transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <p className="text-foreground/60 text-xs text-center max-w-4xl mx-auto leading-relaxed">
            Hindonix is a registered trademark of Hindonix Architectural
            Hardware. © 2026. Hindonix all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
