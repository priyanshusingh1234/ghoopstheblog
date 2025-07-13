"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/src/utils/firebase";
import {
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [previewURL, setPreviewURL] = useState(""); // live preview
  const [fileId, setFileId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName || "");

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPhotoURL(data.photoURL || currentUser.photoURL || "");
          setFileId(data.fileId || "");
        }
      } catch (err) {
        console.error("Error fetching user doc:", err);
      } finally {
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

      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName.trim(),
        photoURL: photoURL.trim(),
        fileId: fileId || "",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.replace("/profile");
      }, 2000);
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

  const deleteImage = async (id) => {
    if (!id) return;
    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: id }),
      });
      await res.json();
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Show live preview
    const localPreview = URL.createObjectURL(file);
    setPreviewURL(localPreview);

    try {
      if (fileId) await deleteImage(fileId);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setPhotoURL(data.url);
        setFileId(data.fileId);

        await updateDoc(doc(db, "users", user.uid), {
          photoURL: data.url,
          fileId: data.fileId,
        });
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (loading) return null;

  return (
    <main className="relative min-h-screen bg-gray-100 dark:bg-zinc-900 p-6">
      {/* Success Fullscreen Modal */}
      {success && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 text-center px-10 py-8 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ Profile Updated!
            </h2>
            <p className="text-gray-700 dark:text-gray-300">Redirecting...</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto mt-14 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Profile</h1>

        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-black dark:text-white"
              placeholder="Enter display name"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          {/* Live Preview */}
          {(photoURL || previewURL) && (
            <div>
              <label className="block text-sm font-medium mb-1">Avatar Preview</label>
              <img
                src={previewURL || photoURL}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border shadow"
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t dark:border-zinc-600">
            <button
              onClick={handleLogout}
              className="text-red-600 text-sm hover:underline"
            >
              Logout
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
