import Link from "next/link";
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

const YouTubeLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
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
  { name: "Instagram", href: "https://www.instagram.com/hindonix.handles?igsh=eTlidHJhdG54OGY1", icon: InstagramLogo },
  { name: "Facebook", href: "https://www.facebook.com/share/1BjnmmbXY1/", icon: FacebookLogo },
  { name: "YouTube", href: "https://youtube.com/@hindonix?si=Brk-vBuUaCcPNOzX", icon: YouTubeLogo },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#eaeaea' }}>
      {/* Top nav links row */}
      <div className="border-b" style={{ borderColor: '#eaeaea14' }}>
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {footerTopLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:text-white"
                style={{ color: '#eaeaea99' }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Center brand block */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center space-y-8">
          <h3
            className="text-sm md:text-xl font-normal leading-none tracking-[0.2em] md:tracking-[0.3em]"
            style={{ fontFamily: '"Times New Roman", Times, serif', color: '#eaeaea' }}
          >
            HINDONIX<sup className="text-xs ml-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>®</sup>
          </h3>
          <div className="space-y-2.5">
            <p className="flex items-center justify-center gap-2 text-sm font-light" style={{ color: '#f3f3f399' }}>
              <Phone className="w-4 h-4" style={{ color: '#f3f3f3' }} />
              <a href="tel:+918850765050" className="hover:text-white transition-colors tracking-wide">
                T: +91 8850765050
              </a>
            </p>
            <p className="flex items-center justify-center gap-2 text-sm font-light" style={{ color: '#f3f3f399' }}>
              <Mail className="w-4 h-4" style={{ color: '#f3f3f3' }} />
              <a href="mailto:info@hindonix.com" className="hover:text-white transition-colors tracking-wide">
                E: info@hindonix.com
              </a>
            </p>
          </div>
          {/* Social icons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ color: '#f3f3f3', border: '1px solid #f3f3f322' }}
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t" style={{ borderColor: '#eaeaea14' }}>
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <p className="text-xs text-center tracking-wide font-light" style={{ color: '#eaeaea40' }}>
            Hindonix is a registered trademark of Hindonix Architectural Hardware. © 2026. Hindonix all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
