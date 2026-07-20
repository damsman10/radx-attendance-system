import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  increment,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import {
  BookOpen,
  MapPin,
  Clock3,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ActiveAttendance() {
  const { user, profile } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [markedSessions, setMarkedSessions] = useState({});
  const [loading, setLoading] = useState(true);

  const [submittingId, setSubmittingId] = useState(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let unsubscribeSessions = null;

    const unsubscribeAttendance = onSnapshot(
      query(
        collection(db, "attendanceRecords"),
        where("studentId", "==", user.uid)
      ),
      (snapshot) => {
        const records = {};

        snapshot.forEach((doc) => {
          records[doc.data().sessionId] = true;
        });

        setMarkedSessions(records);
      }
    );

    const loadSessions = async () => {
      try {
        const coursesSnapshot = await getDocs(
          query(
            collection(db, "courses"),
            where("studentIds", "array-contains", user.uid)
          )
        );

        const enrolledCourseCodes = coursesSnapshot.docs.map(
          (doc) => doc.data().courseCode
        );

        if (enrolledCourseCodes.length === 0) {
          setSessions([]);
          setLoading(false);
          return;
        }

        unsubscribeSessions = onSnapshot(
          query(
            collection(db, "attendanceSessions"),
            where("status", "==", "Active")
          ),
          (snapshot) => {
            const data = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((session) =>
                enrolledCourseCodes.includes(session.courseCode)
              );

            setSessions(data);
            setLoading(false);
          }
        );
      } catch (err) {
        console.log(err);
        setError("Unable to load attendance sessions.");
        setLoading(false);
      }
    };

    loadSessions();

    return () => {
      unsubscribeAttendance();

      if (unsubscribeSessions) {
        unsubscribeSessions();
      }
    };
  }, [user]);

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371000;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  const handleMarkAttendance = (session) => {
    setError("");
    setSuccess("");

    if (markedSessions[session.id]) {
      setError("Attendance already marked.");
      return;
    }

    const now = new Date();

    const endTime = session.endTime?.toDate();

    if (endTime && now > endTime) {
    setError("This attendance session has ended.");
    return;
    }

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setSubmittingId(session.id);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            session.latitude,
            session.longitude
          );

          if (distance > session.radius) {

            console.log("Lecturer Location:", {
  latitude: session.latitude,
  longitude: session.longitude,
});

console.log("Student Location:", {
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy,
});

console.log("Radius:", session.radius);
console.log("Distance:", distance);

            setError(
              "You are outside the attendance radius."
            );
            setSubmittingId(null);
            return;
          }

          const duplicateSnapshot = await getDocs(
            query(
              collection(db, "attendanceRecords"),
              where("sessionId", "==", session.id),
              where("studentId", "==", user.uid)
            )
          );

          if (!duplicateSnapshot.empty) {
            setError("Attendance already marked.");
            setSubmittingId(null);
            return;
          }

          console.log(profile);

                    await addDoc(
            collection(db, "attendanceRecords"),
            {
              sessionId: session.id,

              courseCode: session.courseCode,
              courseTitle: session.courseTitle,

              lecturerId: session.lecturerId,

              studentId: user.uid,
              studentName: profile.fullName,
              matricNumber: profile.matricNumber || "N/A",

              latitude: position.coords.latitude,
              longitude: position.coords.longitude,

              distance: Math.round(distance),

              status: "Present",

              markedAt: Timestamp.now(),
            }
          );

          await updateDoc(
            doc(db, "attendanceSessions", session.id),
            {
              presentCount: increment(1),
            }
          );

          setMarkedSessions((prev) => ({
            ...prev,
            [session.id]: true,
          }));

          setSuccess("Attendance marked successfully.");

        } catch (err) {
          console.log(err);
          setError("Unable to mark attendance.");
        } finally {
          setSubmittingId(null);
        }
      },
      (err) => {
        console.log(err);

        setError(
          "Please allow location access to mark attendance."
        );

        setSubmittingId(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <section>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Active Attendance
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Mark attendance for your active classes.
        </p>

      </section>

      {success && (
        <div className="rounded-xl bg-green-100 p-4 text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-gray-900">
          Loading attendance sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-gray-900">
          No active attendance sessions found.
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
                      {sessions.map((session) => {
            const alreadyMarked = !!markedSessions[session.id];

            const startDate = session.startTime?.toDate();

            return (
              <div
                key={session.id}
                className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {session.courseCode}
                    </h2>

                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {session.courseTitle}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Active
                  </span>

                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-300">

                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{session.venue}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} />
                    <span>
                      {startDate?.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={18} />
                    <span>
                      {startDate?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span>
                      Radius: {session.radius}m
                    </span>
                  </div>

                </div>

                <button
                  disabled={
                    alreadyMarked ||
                    submittingId === session.id
                  }
                  onClick={() =>
                    handleMarkAttendance(session)
                  }
                  className={`mt-6 w-full rounded-xl py-3 font-medium transition ${
                    alreadyMarked
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : submittingId === session.id
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#3D78DA] text-white hover:bg-blue-700"
                  }`}
                >
                  {alreadyMarked ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} />
                      Attendance Marked
                    </span>
                  ) : submittingId === session.id ? (
                    "Marking..."
                  ) : (
                    "Mark Attendance"
                  )}
                </button>

              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}