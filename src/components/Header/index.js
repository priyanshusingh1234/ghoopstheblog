"use client";
import Link from "next/link";
import Logo from "./Logo";
import {
  DribbbleIcon,
  GithubIcon,
  LinkedinIcon,
  MoonIcon,
  SunIcon,
  TwitterIcon,
} from "../Icons";
import siteMetadata from "@/src/utils/siteMetaData";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useState } from "react";
import { cx } from "@/src/utils";

const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const [click, setClick] = useState(false);

  const toggle = () => setClick(!click);

  return (
    <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between relative z-50">
      <Logo />

      {/* Hamburger Button for Mobile */}
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
              style={{
                opacity: click ? 0 : 1,
              }}
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

      {/* ✅ Mobile Dropdown Navigation */}
      <nav
        className={cx(
          "sm:hidden flex flex-col items-center fixed top-20 left-1/2 -translate-x-1/2 w-11/12 max-w-xs z-40 bg-light dark:bg-dark text-dark dark:text-light rounded-xl shadow-xl border border-dark/10 dark:border-light/10 transition-all duration-300 ease-in-out overflow-hidden",
          click
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <Link
          href="/"
          className="py-3 w-full text-center border-b border-light/40 dark:border-dark/40 hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={() => setClick(false)}
        >
          Home
        </Link>
        <Link
          href="/about"
          className="py-3 w-full text-center border-b border-light/40 dark:border-dark/40 hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={() => setClick(false)}
        >
          About
        </Link>
        <Link
          href="/contact"
          className="py-3 w-full text-center border-b border-light/40 dark:border-dark/40 hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={() => setClick(false)}
        >
          Contact
        </Link>
        <Link
          href="/privacy-policies"
          className="py-3 w-full text-center hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={() => setClick(false)}
        >
          Privacy Policy
        </Link>

        <div className="py-2">
          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className={cx(
              "w-8 h-8 ease ml-2 flex items-center justify-center rounded-full p-1",
              mode === "light"
                ? "bg-dark text-light"
                : "bg-light text-dark"
            )}
            aria-label="theme-switcher"
          >
            {mode === "light" ? (
              <MoonIcon className={"fill-dark"} />
            ) : (
              <SunIcon className={"fill-dark"} />
            )}
          </button>
        </div>
      </nav>

      {/* ✅ Desktop Navigation */}
      <nav className="w-max py-3 px-8 border border-solid border-dark rounded-full font-medium capitalize items-center hidden sm:flex fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-40">
        <Link href="/" className="mr-2">
          Home
        </Link>
        <Link href="/about" className="mx-2">
          About
        </Link>
        <Link href="/contact" className="mx-2">
          Contact
        </Link>
        <Link href="/privacy-policies" className="mx-2">
          Privacy
        </Link>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className={cx(
            "w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1",
            mode === "light"
              ? "bg-dark text-light"
              : "bg-light text-dark"
          )}
          aria-label="theme-switcher"
        >
          {mode === "light" ? (
            <MoonIcon className={"fill-dark"} />
          ) : (
            <SunIcon className={"fill-dark"} />
          )}
        </button>
      </nav>

      {/* ✅ Social Icons */}
      {/* <div className="hidden sm:flex items-center">
        <a
          href={siteMetadata.linkedin}
          rel="noopener noreferrer"
          className="inline-block w-6 h-6 mr-4"
          aria-label="Reach out to me via LinkedIn"
          target="_blank"
        >
          <LinkedinIcon className="hover:scale-125 transition-all ease duration-200" />
        </a>
        <a
          href={siteMetadata.twitter}
          rel="noopener noreferrer"
          className="inline-block w-6 h-6 mr-4"
          aria-label="Reach out to me via Twitter"
          target="_blank"
        >
          <TwitterIcon className="hover:scale-125 transition-all ease duration-200" />
        </a>
        <a
          href={siteMetadata.github}
          rel="noopener noreferrer"
          className="inline-block w-6 h-6 mr-4"
          aria-label="Check my profile on Github"
          target="_blank"
        >
          <GithubIcon className="hover:scale-125 transition-all ease duration-200 dark:fill-light" />
        </a>
        <a
          href={siteMetadata.dribbble}
          rel="noopener noreferrer"
          className="inline-block w-6 h-6 mr-4"
          aria-label="Check my profile on Dribbble"
          target="_blank"
        >
          <DribbbleIcon className="hover:scale-125 transition-all ease duration-200" />
        </a>
      </div> */}
    </header>
  );
};

export default Header;
