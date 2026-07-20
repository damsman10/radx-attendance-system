import { useEffect, useState } from "react";

import {
  CheckCircle2,
  XCircle,
  Clock3,
  MapPin,
  CalendarDays,
} from "lucide-react";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function MyAttendance() {

  const { user } = useAuth();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
  ============================================
  Attendance Records
  ============================================
  */

  useEffect(() => {

    if (!user) return;

    const attendanceQuery = query(
      collection(db, "attendanceRecords"),
      where("studentId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      attendanceQuery,
      (snapshot) => {

        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAttendanceRecords(records);

      },
      console.log
    );

    return unsubscribe;

  }, [user]);



  /*
  ============================================
  Courses Student Is Enrolled In
  ============================================
  */

  useEffect(() => {

    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "courses"),

      (courseSnapshot) => {

        const myCourses = courseSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(course =>
            course.studentIds?.includes(user.uid)
          );

        const courseCodes = myCourses.map(
          course => course.courseCode
        );

        const unsubscribeSessions = onSnapshot(

          collection(db, "attendanceSessions"),

          (sessionSnapshot) => {

            const sessions = sessionSnapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter(session =>
                courseCodes.includes(session.courseCode)
              )
              .filter(session =>
                session.status === "Completed"
              );

            setCompletedSessions(sessions);

            setLoading(false);

          },

          (error) => {

            console.log(error);
            setLoading(false);

          }

        );

        return unsubscribeSessions;

      },

      (error) => {

        console.log(error);
        setLoading(false);

      }

    );

    return unsubscribe;

  }, [user]);



  /*
  ============================================
  Statistics
  ============================================
  */

  const totalSessions = completedSessions.length;

  const presentCount = attendanceRecords.filter(
    record => record.status === "Present"
  ).length;

  const lateCount = attendanceRecords.filter(
    record => record.status === "Late"
  ).length;

  const absentCount =
    Math.max(
      totalSessions - presentCount - lateCount,
      0
    );



  const presentPercentage =
    totalSessions > 0
      ? Math.round(
          (presentCount / totalSessions) * 100
        )
      : 0;



  const latePercentage =
    totalSessions > 0
      ? Math.round(
          (lateCount / totalSessions) * 100
        )
      : 0;



  const absentPercentage =
    totalSessions > 0
      ? Math.round(
          (absentCount / totalSessions) * 100
        )
      : 0;

        return (

    <div className="space-y-8 p-6">

      {/* Header */}
      <section>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Attendance
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View your attendance history and location verification records.
        </p>

      </section>

      {/* Summary Cards */}
      <section className="grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

          <CheckCircle2 className="text-emerald-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Present
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            {presentPercentage}%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {presentCount} of {totalSessions} sessions
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

          <Clock3 className="text-orange-500" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Late
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            {latePercentage}%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {lateCount} session(s)
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

          <XCircle className="text-red-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Absent
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            {absentPercentage}%
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {absentCount} session(s)
          </p>

        </div>

      </section>

      {/* Attendance Records */}
      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Attendance Records
        </h2>

        <div className="mt-6 overflow-x-auto">

          {loading ? (

            <p className="text-gray-500">
              Loading attendance records...
            </p>

          ) : attendanceRecords.length === 0 ? (

            <p className="text-gray-500">
              No attendance records found.
            </p>

          ) : (

            <table className="w-full text-left">

              <thead className="border-b border-gray-200 dark:border-gray-700">

                <tr className="text-sm text-gray-500 dark:text-gray-400">

                  <th className="pb-3">
                    Course
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Location
                  </th>

                </tr>

              </thead>

              <tbody>

                {attendanceRecords.map((record) => {

                  const markedDate = record.markedAt?.toDate();

                  return (

                    <tr
                      key={record.id}
                      className="border-b border-gray-100 last:border-none dark:border-gray-700"
                    >

                      <td className="py-4">

                        <p className="font-medium text-gray-900 dark:text-white">
                          {record.courseCode}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {record.courseTitle}
                        </p>

                      </td>

                      <td className="text-gray-700 dark:text-gray-300">

                        <div className="flex items-center gap-2">

                          <CalendarDays size={16} />

                          {markedDate
                            ? markedDate.toLocaleDateString()
                            : "-"}

                        </div>

                      </td>

                      <td className="text-gray-700 dark:text-gray-300">

                        {markedDate
                          ? markedDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}

                      </td>

                      <td>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            record.status === "Present"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : record.status === "Late"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >

                          {record.status}

                        </span>

                      </td>

                      <td>

                        <div className="flex items-center gap-2 text-sm text-emerald-600">

                          <MapPin size={16} />

                          Verified ({record.distance}m)

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          )}

        </div>

      </section>

    </div>

  );
}