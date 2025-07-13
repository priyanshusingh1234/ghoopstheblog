import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/utils/firebase";
import Image from "next/image";

export default async function CommunityUserPage({ params }) {
  const { username } = params;

  // Find user by displayName in 'users' collection
  const userQuery = query(
    collection(db, "users"),
    where("displayName", "==", username)
  );

  const userSnap = await getDocs(userQuery);

  if (userSnap.empty) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-red-600">User not found</h1>
      </div>
    );
  }

  const user = userSnap.docs[0].data();

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4">
        <Image
          src={user.photoURL || "/default-avatar.png"}
          alt={user.displayName}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.displayName}</h1>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="text-gray-700 mt-2">
          Joined on: {user.createdAt?.toDate().toDateString()}
        </p>
        {/* Expand this section later with authored posts, bio, etc. */}
      </div>
    </main>
  );
}
