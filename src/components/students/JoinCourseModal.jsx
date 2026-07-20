import { useState } from "react";
import { X } from "lucide-react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function JoinCourseModal({
  onClose,
  onJoined,
}) {
  const { user } = useAuth();

  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "courses"),
        where("courseCode", "==", courseCode.trim().toUpperCase())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Course not found.");
        setLoading(false);
        return;
      }

      const courseDoc = snapshot.docs[0];
      const course = courseDoc.data();

      if (course.studentIds?.includes(user.uid)) {
        setError("You have already joined this course.");
        setLoading(false);
        return;
      }

      await updateDoc(doc(db, "courses", courseDoc.id), {
        studentIds: arrayUnion(user.uid),
        studentCount: increment(1),
      });

      onJoined();
      onClose();
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 dark:bg-gray-900">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Join Course
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        <form
          onSubmit={handleJoin}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-medium">
              Course Code
            </label>

            <input
              type="text"
              value={courseCode}
              onChange={(e) =>
                setCourseCode(e.target.value)
              }
              placeholder="e.g. CSC401"
              className="w-full rounded-xl border p-3 outline-none focus:border-[#3D78DA]"
              required
            />

          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#3D78DA] py-3 text-white"
            >
              {loading ? "Joining..." : "Join Course"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}