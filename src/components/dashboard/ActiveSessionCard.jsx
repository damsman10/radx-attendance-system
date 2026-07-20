import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Clock3,
  MapPin,
  Radio,
  Users,
} from "lucide-react";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function ActiveSessionCard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "attendanceSessions"),
      where("lecturerId", "==", user.uid),
      where("status", "==", "Active")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const sessions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        sessions.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );

        setSession(sessions[0] || null);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleEndSession = async () => {
    if (!session) return;

    const confirmed = window.confirm(
      "End this attendance session?"
    );

    if (!confirmed) return;

    try {
      setEnding(true);

      await updateDoc(
        doc(db, "attendanceSessions", session.id),
        {
          status: "Completed",
          endedAt: Timestamp.now(),
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        Loading active session...
      </section>
    );
  }

  if (!session) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-xl font-semibold">
          Active Attendance Session
        </h2>

        <p className="mt-4 text-gray-500">
          No active attendance session.
        </p>
      </section>
    );
  }

  const remainingMinutes = Math.max(
    Math.ceil(
      (session.endTime?.toDate() - new Date()) / 60000
    ),
    0
  );

  const absentCount =
    (session.studentCount || 0) -
    (session.presentCount || 0);

      return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Active Attendance Session
          </h2>

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Live attendance monitoring
          </p>

        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">

          <Radio size={14} />

          Live

        </span>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {session.courseCode}
          </h3>

          <p className="text-slate-500 dark:text-gray-400">
            {session.courseTitle}
          </p>

          <div className="mt-6 space-y-4 text-slate-700 dark:text-gray-300">

            <div className="flex items-center gap-3">

              <MapPin
                size={18}
                className="text-blue-600"
              />

              {session.venue}

            </div>

            <div className="flex items-center gap-3">

              <Users
                size={18}
                className="text-emerald-600"
              />

              {session.presentCount} / {session.studentCount} Students Present

            </div>

            <div className="flex items-center gap-3">

              <Clock3
                size={18}
                className="text-orange-500"
              />

              {remainingMinutes} Minutes Remaining

            </div>

          </div>

        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-slate-50 p-6 dark:bg-gray-800">

          <div className="space-y-4 text-slate-700 dark:text-gray-300">

            <div className="flex justify-between">

              <span>Radius</span>

              <strong className="text-slate-900 dark:text-white">
                {session.radius} m
              </strong>

            </div>

            <div className="flex justify-between">

              <span>Present</span>

              <strong className="text-green-600">
                {session.presentCount}
              </strong>

            </div>

            <div className="flex justify-between">

              <span>Absent</span>

              <strong className="text-red-600">
                {absentCount}
              </strong>

            </div>

            <div className="flex justify-between">

              <span>Status</span>

              <strong className="text-emerald-600">
                {session.status}
              </strong>

            </div>

          </div>

          <div className="mt-8 flex gap-3">

            <button
              onClick={() =>
                navigate(`/attendance/${session.id}`)
              }
              className="flex-1 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              View Live
            </button>

            <button
              onClick={handleEndSession}
              disabled={ending}
              className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {ending ? "Ending..." : "End Session"}
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}