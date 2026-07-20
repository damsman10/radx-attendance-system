import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

import { db } from "../firebase";

export default function AttendanceSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "attendanceSessions", sessionId),
      (snapshot) => {
        if (snapshot.exists()) {
          setSession({
            id: snapshot.id,
            ...snapshot.data(),
          });
        } else {
          setSession(null);
        }

        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "attendanceRecords"),
      where("sessionId", "==", sessionId)
    ),
    (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAttendanceRecords(records);
    },
    (error) => {
      console.log(error);
    }
  );

  return () => unsubscribe();

}, [sessionId]);

  const handleEndSession = async () => {
    if (!session || session.status === "Completed") return;

    const confirmed = window.confirm(
      "End this attendance session?"
    );

    if (!confirmed) return;

    try {
      setEnding(true);

      await updateDoc(
        doc(db, "attendanceSessions", sessionId),
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

  const handleDeleteSession = async () => {
    if (!session) return;

    // Prevent deleting completed sessions with attendance records
    if (session.presentCount > 0) {
      alert(
        "This session already contains attendance records and cannot be deleted."
      );
      return;
    }

    // Prevent deleting an active session
    if (session.status === "Active") {
      alert(
        "Please end the attendance session before deleting it."
      );
      return;
    }

    const confirmed = window.confirm(
      "Delete this attendance session?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "attendanceSessions", sessionId)
      );

      navigate("/attendance");
    } catch (error) {
      console.log(error);
      alert("Unable to delete attendance session.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading attendance session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6">
        Attendance session not found.
      </div>
    );
  }

  const attendancePercentage =
    session.studentCount > 0
      ? Math.round(
          (session.presentCount / session.studentCount) * 100
        )
      : 0;

  return (
  <div className="space-y-8 p-6">

    {/* Header */}
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

      <div>

        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-[#3D78DA] hover:underline"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {session.courseCode}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {session.courseTitle}
        </p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={handleDeleteSession}
          disabled={ending}
          className="rounded-xl border border-red-600 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete Session
        </button>

        <button
          onClick={handleEndSession}
          disabled={
            session.status === "Completed" || ending
          }
          className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {session.status === "Completed"
            ? "Session Ended"
            : ending
            ? "Ending..."
            : "End Session"}
        </button>

      </div>

    </div>

    {/* Summary */}
    <div className="grid gap-6 md:grid-cols-4">

      <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
        <MapPin className="mb-3 text-blue-600" />
        <p className="text-gray-500">Venue</p>
        <h2 className="mt-2 text-xl font-bold">
          {session.venue}
        </h2>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
        <Users className="mb-3 text-green-600" />
        <p className="text-gray-500">Present</p>
        <h2 className="mt-2 text-xl font-bold">
          {session.presentCount}
        </h2>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
        <Clock className="mb-3 text-yellow-600" />
        <p className="text-gray-500">Status</p>

        <h2
          className={`mt-2 text-xl font-bold ${
            session.status === "Active"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {session.status}
        </h2>

      </div>

      <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
        <CheckCircle className="mb-3 text-purple-600" />
        <p className="text-gray-500">Attendance</p>
        <h2 className="mt-2 text-xl font-bold">
          {attendancePercentage}%
        </h2>
      </div>

    </div>

    {/* Session Details */}
    <div className="grid gap-6 md:grid-cols-2">

      <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

        <h2 className="mb-4 text-xl font-bold">
          Session Information
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Course:</strong> {session.courseCode}
          </p>

          <p>
            <strong>Title:</strong> {session.courseTitle}
          </p>

          <p>
            <strong>Department:</strong> {session.department}
          </p>

          <p>
            <strong>Level:</strong> {session.level}
          </p>

          <p>
            <strong>Semester:</strong> {session.semester}
          </p>

          <p>
            <strong>Academic Session:</strong> {session.session}
          </p>

          <p>
            <strong>Radius:</strong> {session.radius}m
          </p>

        </div>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

        <h2 className="mb-4 text-xl font-bold">
          GPS Coordinates
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Latitude:</strong> {session.latitude}
          </p>

          <p>
            <strong>Longitude:</strong> {session.longitude}
          </p>

        </div>

      </div>

    </div>

    {/* Students */}
    <div className="rounded-2xl bg-white shadow dark:bg-gray-900">

      <div className="border-b p-6 dark:border-gray-700">
        <h2 className="text-xl font-bold">
          Students Present
        </h2>
      </div>

      <div className="overflow-x-auto p-6">

  {attendanceRecords.length === 0 ? (

    <div className="text-center text-gray-500">
      No attendance records yet.
    </div>

  ) : (

    <table className="w-full text-left text-sm">

      <thead className="border-b dark:border-gray-700">
        <tr>
          <th className="px-4 py-3">Student Name</th>
          <th className="px-4 py-3">Matric Number</th>
          <th className="px-4 py-3">Distance</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Time</th>
        </tr>
      </thead>

      <tbody>

        {attendanceRecords.map((record) => (

          <tr
            key={record.id}
            className="border-b dark:border-gray-700"
          >

            <td className="px-4 py-3">
              {record.studentName}
            </td>

            <td className="px-4 py-3">
              {record.matricNumber}
            </td>

            <td className="px-4 py-3">
              {record.distance}m
            </td>

            <td className="px-4 py-3 text-green-600">
              {record.status}
            </td>

            <td className="px-4 py-3">
              {record.markedAt?.toDate().toLocaleTimeString()}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )}

</div>

    </div>

  </div>
);}