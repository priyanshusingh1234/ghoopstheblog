"use client";
import { useState } from "react";
import { auth, googleProvider } from "@/src/utils/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [showReset, setShowReset] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    setResetMsg("");
    if (!resetEmail) {
      setResetMsg("❌ Please enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMsg("✅ Reset email sent. Check your inbox.");
    } catch (err) {
      setResetMsg(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Log in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p
              onClick={() => setShowReset(true)}
              className="text-sm text-blue-600 hover:underline cursor-pointer text-right mt-1"
            >
              Forgot Password?
            </p>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full bg-black hover:bg-gray-900 text-white p-3 rounded-lg font-semibold shadow-md"
          >
            Log In
          </motion.button>
        </form>

        <div className="my-4 text-center text-sm text-gray-500">or</div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 p-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </motion.button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 underline">
            Sign up
          </Link>
        </p>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-red-600 text-sm text-center mt-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Reset Password Box */}
        <AnimatePresence>
          {showReset && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-300"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Reset Password
              </h2>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded mb-3"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button
                onClick={handlePasswordReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-2"
              >
                Send Reset Email
              </button>
              {resetMsg && (
                <p
                  className={`text-sm ${
                    resetMsg.startsWith("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {resetMsg}
                </p>
              )}
              <button
                onClick={() => {
                  setShowReset(false);
                  setResetMsg("");
                }}
                className="text-sm text-gray-500 mt-2 hover:underline"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
