"use client";
import Link from "next/link";
import Logo from "./Logo";
import { MoonIcon, SunIcon } from "../Icons";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useState, useEffect, useRef } from "react";
import { cx } from "@/src/utils";
import { auth } from "@/src/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const [click, setClick] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const toggle = () => setClick(!click);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        window.location.href = "/";
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between relative z-50">
      <Logo />

      {/* Hamburger for mobile */}
      <button
        className="inline-block sm:hidden z-50"
        onClick={toggle}
        aria-label="Hamburger Menu"
      >
        <div className="w-6 cursor-pointer transition-all ease duration-300">
          <div className="relative h-4">
            <span
              className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
              style={{
                transform: click
                  ? "rotate(-45deg) translateY(6px)"
                  : "rotate(0deg) translateY(0px)",
              }}
            />
            <span
              className="absolute top-1.5 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
              style={{ opacity: click ? 0 : 1 }}
            />
            <span
              className="absolute bottom-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
              style={{
                transform: click
                  ? "rotate(45deg) translateY(-6px)"
                  : "rotate(0deg) translateY(0px)",
              }}
            />
          </div>
        </div>
      </button>

      {/* Mobile Navigation */}
      <nav
        className={cx(
          "sm:hidden flex flex-col items-center fixed top-20 left-1/2 -translate-x-1/2 w-11/12 max-w-xs z-40 bg-light dark:bg-dark text-dark dark:text-light rounded-xl shadow-xl border border-dark/10 dark:border-light/10 transition-all duration-300 ease-in-out overflow-hidden",
          click
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {[
          { path: "/", label: "Home" },
          { path: "/about", label: "About" },
          { path: "/contact", label: "Contact" },
          { path: "/privacy-policies", label: "Privacy" },
          { path: "/submit", label: "Write" }, // ✅ added
        ].map(({ path, label }, i) => (
          <Link
            key={i}
            href={path}
            onClick={() => setClick(false)}
            className="py-3 w-full text-center border-b border-light/40 dark:border-dark/40 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            {label}
          </Link>
        ))}



        {/* Mobile Auth Section */}
        <div className="py-3 w-full text-center border-t border-light/40 dark:border-dark/40">
          {user ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm text-dark dark:text-light max-w-[140px] truncate">
                {user.displayName || user.email}
              </span>
              <button
                onClick={() => {
                  setClick(false);
                  handleLogout();
                }}
                className="text-red-600 text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setClick(false)}
                className="text-blue-600 underline block"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setClick(false)}
                className="text-blue-600 underline block"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Theme Switch */}
        <div className="py-3">
          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className={cx(
              "w-8 h-8 ease flex items-center justify-center rounded-full p-1",
              mode === "light" ? "bg-dark text-light" : "bg-light text-dark"
            )}
            aria-label="theme-switcher"
          >
            {mode === "light" ? (
              <MoonIcon className="fill-dark" />
            ) : (
              <SunIcon className="fill-dark" />
            )}
          </button>
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="w-max py-3 px-8 border border-solid border-dark rounded-full font-medium capitalize items-center hidden sm:flex fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-40">
        <Link href="/" className="mr-2">Home</Link>
        <Link href="/about" className="mx-2">About</Link>
        <Link href="/contact" className="mx-2">Contact</Link>
        <Link href="/privacy-policies" className="mx-2">Privacy</Link>
        <Link href="/submit" className="mx-2">Write</Link>
         <Link href="/trending" className="mx-2">Trending</Link>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className={cx(
            "w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1",
            mode === "light" ? "bg-dark text-light" : "bg-light text-dark"
          )}
          aria-label="theme-switcher"
        >
          {mode === "light" ? (
            <MoonIcon className="fill-dark" />
          ) : (
            <SunIcon className="fill-dark" />
          )}
        </button>
      </nav>

      {/* Desktop Auth + Profile Dropdown */}
      <div
        className="hidden sm:flex items-center space-x-3 relative"
        ref={profileRef}
      >
        {user ? (
          <>
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            />
            {showProfileMenu && (
              <div className="absolute right-0 mt-12 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 z-50">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-dark dark:text-light truncate">
                      {user.displayName || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="block text-sm text-blue-600 hover:underline mb-2"
                  onClick={() => setShowProfileMenu(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-x-3 text-sm">
            <Link href="/login" className="text-blue-600 underline">Login</Link>
            <Link href="/sign-up" className="text-blue-600 underline">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
