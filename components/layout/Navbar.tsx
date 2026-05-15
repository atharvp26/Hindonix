"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Blogs", path: "/blogs" },
  { name: "Get Catalogue", path: "/contact" },
];

function NavbarContent({
  isSignedIn,
  isAdmin,
  showUserButton,
}: {
  isSignedIn: boolean;
  isAdmin: boolean;
  showUserButton: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── HORIZONTAL TOP NAV ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 lg:px-8 py-5 bg-[#eaeaea]">
        {/* Brand — left, flex-1 so it balances the right spacer */}
        <div className="flex-1">
          <Link href="/" aria-label="Hindonix home" className="shrink-0 inline-block">
            <span
              className="text-[#1a1a1a] text-2xl md:text-3xl leading-none"
              style={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 400, letterSpacing: '0.2em' }}
            >
              HINDONIX<sup className="text-[10px] ml-0.5">®</sup>
            </span>
          </Link>
        </div>

        {/* Nav links — centre pill (hidden on mobile) */}
        <div className="hidden md:flex items-center rounded-full border border-[#e0e0e0] bg-[#f5f5f5] px-2 py-1 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "px-5 py-1.5 rounded-full text-base transition-colors tracking-wide",
                pathname === link.path
                  ? "bg-white text-[#1a1a1a] shadow-sm font-medium"
                  : "text-[#555] hover:text-[#1a1a1a] hover:bg-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "px-5 py-1.5 rounded-full text-base transition-colors tracking-wide",
                pathname === "/admin"
                  ? "bg-white text-[#1a1a1a] shadow-sm font-medium"
                  : "text-[#555] hover:text-[#1a1a1a] hover:bg-white/70"
              )}
            >
              Admin
            </Link>
          )}
          {!isSignedIn ? (
            <Link
              href="/sign-in"
              className={cn(
                "px-5 py-1.5 rounded-full text-base transition-colors tracking-wide",
                pathname === "/sign-in"
                  ? "bg-white text-[#1a1a1a] shadow-sm font-medium"
                  : "text-[#555] hover:text-[#1a1a1a] hover:bg-white/70"
              )}
            >
              Login
            </Link>
          ) : (
            showUserButton && (
              <div className="px-2">
                <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
              </div>
            )
          )}
        </div>

        {/* Right spacer — flex-1 mirrors brand side to keep pill centred; shows hamburger on mobile */}
        <div className="flex-1 flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#1a1a1a] flex flex-col gap-[5px]"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <span className="block w-5 h-px bg-[#1a1a1a]" />
              <span className="block w-5 h-px bg-[#1a1a1a]" />
            </>
          )}
        </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER (right slide-in) ──────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-[#1a1a1a]/40" />
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white flex flex-col py-16 px-6 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "block px-3 py-3 text-sm font-medium border-b border-[#e8e8e8] tracking-widest uppercase",
                  pathname === link.path
                    ? "text-[#1a1a1a] font-semibold"
                    : "text-[#777] hover:text-[#1a1a1a]"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "block px-3 py-3 text-sm font-medium border-b border-[#e8e8e8] tracking-widest uppercase",
                  pathname === "/admin"
                    ? "text-[#1a1a1a] font-semibold"
                    : "text-[#777] hover:text-[#1a1a1a]"
                )}
              >
                Admin
              </Link>
            )}
            <div className="pt-4">
              {!isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="block px-3 py-3 text-sm font-medium tracking-widest uppercase text-[#777] hover:text-[#1a1a1a]"
                >
                  Login
                </Link>
              ) : (
                showUserButton && (
                  <div className="px-3 pt-2">
                    <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavbarWithClerk() {
  const { isSignedIn } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/users/me")
        .then((r) => r.json())
        .then((user) => setIsAdmin(user?.role === "admin"))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn]);

  return <NavbarContent isSignedIn={!!isSignedIn} isAdmin={isAdmin} showUserButton={true} />;
}

export function Navbar() {
  return <NavbarWithClerk />;
}
