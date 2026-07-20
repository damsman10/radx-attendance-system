import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import CreateAttendanceModal from "../components/attendance/CreateAttendanceModal";

const Attendance = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {

  if (!user) return;

  setLoading(true);

  const q = query(
    collection(db, "attendanceSessions"),
    where("lecturerId", "==", user.uid)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSessions(data);
      setLoading(false);

    },
    (error) => {

      console.log(error);
      setLoading(false);

    }
  );

  return () => unsubscribe();

}, [user]);

  const activeSessions = sessions.filter(
    (s) => s.status === "Active"
  ).length;

  const completedSessions = sessions.filter(
    (s) => s.status === "Completed"
  ).length;

  const totalAttendance = sessions.reduce(
    (sum, s) => sum + (s.presentCount || 0),
    0
  );

  const averageAttendance =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (sum, s) => sum + (s.attendancePercentage || 0),
            0
          ) / sessions.length
        )
      : 0;

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Attendance Management
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Create and monitor geolocation-based attendance sessions.
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-[#3D78DA] px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Start Attendance Session
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Active Sessions</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {activeSessions}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Today's Attendance</p>
          <h2 className="mt-2 text-3xl font-bold">
            {totalAttendance}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Completed Sessions</p>
          <h2 className="mt-2 text-3xl font-bold">
            {completedSessions}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Average Attendance</p>
          <h2 className="mt-2 text-3xl font-bold">
            {averageAttendance}%
          </h2>
        </div>

      </div>

            {/* Sessions */}
      <div>

        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
          Attendance Sessions
        </h2>

        {loading ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-gray-900">
            Loading attendance sessions...
          </div>

        ) : sessions.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-gray-900">

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              No Attendance Sessions
            </h3>

            <p className="mt-2 text-gray-500">
              Start your first attendance session to begin tracking student attendance.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-4">

            {sessions.map((session) => (

              <div
                key={session.id}
                className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {session.courseCode}
                    </h3>

                    <p className="text-gray-500">
                      {session.courseTitle}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      session.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {session.status}
                  </span>

                </div>

                <div className="mt-5 space-y-2 text-sm">

                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {session.startTime?.toDate().toLocaleDateString()}
                  </p>

                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {session.startTime?.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {session.endTime?.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p>
                    <span className="font-medium">Venue:</span>{" "}
                    {session.venue}
                  </p>

                  <p>
                    <span className="font-medium">Radius:</span>{" "}
                    {session.radius}m
                  </p>

                  <p>
                    <span className="font-medium">Present:</span>{" "}
                    {session.presentCount}
                  </p>

                </div>

                <button
                  onClick={() =>
                    navigate(`/attendance/${session.id}`)
                  }
                  className="mt-6 w-full rounded-xl border border-blue-500 py-2 text-blue-600 transition hover:bg-blue-50"
                >
                  View Session
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

      {showModal && (
        <CreateAttendanceModal
            onClose={() => setShowModal(false)}
            onSessionCreated={() => setShowModal(false)}
        />
      )}

    </div>
  );
};

export default Attendance;