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
  const [timeRemaining, setTimeRemaining] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

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
        console.error(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [sessionId]);


  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "attendanceRecords"),
        where("sessionId", "==", sessionId)
      ),
      (snapshot) => {
        setAttendanceRecords(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => {
        console.error(error);
      }
    );

    return unsubscribe;
  }, [sessionId]);


  useEffect(() => {
    if (!session?.endTime) {
      setTimeRemaining("--");
      return;
    }

    const updateCountdown = () => {
      const end = session.endTime.toDate().getTime();
      const now = Date.now();

      if (session.status === "Completed") {
        setTimeRemaining("Session Ended");
        return;
      }

      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Expired");
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (hours > 0) {
        setTimeRemaining(
          `${hours}h ${String(minutes).padStart(2, "0")}m ${String(
            seconds
          ).padStart(2, "0")}s`
        );
      } else {
        setTimeRemaining(
          `${String(minutes).padStart(2, "0")}m ${String(
            seconds
          ).padStart(2, "0")}s`
        );
      }
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [session]);


  const handleCopyCode = async () => {
    if (!session?.attendanceCode) return;

    await navigator.clipboard.writeText(
      session.attendanceCode
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };


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
          codeEnabled: false,
        }
      );

    } catch (error) {
      console.error(error);

    } finally {
      setEnding(false);
    }
  };


  const handleDeleteSession = async () => {
    if (!session) return;

    if (
      session.presentCount > 0 ||
      attendanceRecords.length > 0
    ) {
      alert(
        "This session already contains attendance records and cannot be deleted."
      );
      return;
    }

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
      console.error(error);
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
      ? Math.min(
          100,
          Math.round(
            (session.presentCount / session.studentCount) * 100
          )
        )
      : 0;


  const statusColor =
    timeRemaining === "Session Ended" ||
    timeRemaining === "Expired"
      ? "text-red-600"
      : "text-green-600";


  return (
    <div className="space-y-8 p-6">

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


      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <MapPin className="mb-3 text-blue-600" />
          <p className="text-gray-500">Venue</p>
          <h2 className="mt-2 text-xl font-bold">
            {session.venue ?? "-"}
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

          <p className="text-gray-500">
            Time Remaining
          </p>

          <h2 className={`mt-2 text-xl font-bold ${statusColor}`}>
            {timeRemaining}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {session.status}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <CheckCircle className="mb-3 text-purple-600" />
          <p className="text-gray-500">Attendance</p>
          <h2 className="mt-2 text-xl font-bold">
            {attendancePercentage}%
          </h2>
        </div>

      </div>


      {/* Attendance Verification */}

      {session.verificationMode !== "GPS" &&
        session.codeEnabled && (

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow dark:border-green-800 dark:bg-green-900/20">

          <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
            Attendance Verification
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Method:{" "}
            {session.verificationMode === "CODE"
              ? "Attendance Code Only"
              : "GPS + Backup Attendance Code"}
          </p>

          <div className="mt-5">

            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Attendance Code
            </p>

            <p className="mt-2 text-4xl font-bold tracking-widest text-green-700 dark:text-green-300">
              {session.attendanceCode}
            </p>

          </div>

          <button
            onClick={handleCopyCode}
            className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
          >
            {copied ? "✓ Code copied" : "Copy Code"}
          </button>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {session.verificationMode === "CODE"
              ? "Students can use this code to mark attendance until the session ends."
              : "Use this code only when students are unable to complete GPS attendance. This code remains valid until the session ends."}
          </p>

          {session.attendanceCodeExpiresAt && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Valid until:{" "}
              {session.attendanceCodeExpiresAt
                .toDate()
                .toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
          )}

        </div>
      )}



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
              <strong>Department:</strong> {session.department ?? "-"}
            </p>

            <p>
              <strong>Level:</strong> {session.level ?? "-"}
            </p>

            <p>
              <strong>Semester:</strong> {session.semester ?? "-"}
            </p>

            <p>
              <strong>Academic Session:</strong> {session.session ?? "-"}
            </p>

            <p>
              <strong>Radius:</strong> {session.radius}m
            </p>

            <p>
              <strong>Verification:</strong>{" "}
              {session.verificationMode === "GPS"
                ? "GPS Only"
                : session.verificationMode === "CODE"
                ? "Attendance Code Only"
                : "GPS + Backup Attendance Code"}
            </p>

          </div>

        </div>


        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

          <h2 className="mb-4 text-xl font-bold">
            GPS Coordinates
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Latitude:</strong>{" "}
              {session.latitude ?? "-"}
            </p>

            <p>
              <strong>Longitude:</strong>{" "}
              {session.longitude ?? "-"}
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

                  <th className="px-4 py-3">
                    Student Name
                  </th>

                  <th className="px-4 py-3">
                    Matric Number
                  </th>

                  <th className="px-4 py-3">
                    Distance
                  </th>

                  <th className="px-4 py-3">
                    Method
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Time
                  </th>

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
                      {record.distance ?? "-"}m
                    </td>


                    <td className="px-4 py-3 font-medium text-blue-600">
                      {record.verificationMethod || "GPS"}
                    </td>


                    <td className="px-4 py-3 text-green-600">
                      {record.status}
                    </td>


                    <td className="px-4 py-3">

                      {record.markedAt?.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>


    </div>
  );
}
