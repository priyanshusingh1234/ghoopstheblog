"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/utils/firebase";
import {
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setPhotoURL(currentUser.photoURL || "");
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: photoURL.trim(),
      });
      alert("Profile updated successfully!");
      router.replace("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => router.replace("/"));
  };

  if (loading) return null;

  return (
    <main className="max-w-xl mx-auto p-6 mt-10 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Photo URL</label>
          <input
            type="text"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
          />
        </div>

        {photoURL && (
          <div className="mt-4">
            <label className="block text-sm mb-1">Preview</label>
            <img
              src={photoURL}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover border"
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleLogout}
            className="text-red-600 text-sm hover:underline"
          >
            Logout
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
