import { useEffect, useMemo, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

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

        data.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );

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

  const report = useMemo(() => {
    const totalSessions = sessions.length;

    const totalStudents = sessions.reduce(
      (sum, session) => sum + (session.studentCount || 0),
      0
    );

    const totalPresent = sessions.reduce(
      (sum, session) => sum + (session.presentCount || 0),
      0
    );

    const totalAbsent = totalStudents - totalPresent;

    const attendanceRate =
      totalStudents > 0
        ? Math.round((totalPresent / totalStudents) * 100)
        : 0;

    return {
      totalSessions,
      totalStudents,
      totalPresent,
      totalAbsent,
      attendanceRate,
    };
  }, [sessions]);

  return (
    <div className="space-y-8 p-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Reports & Analytics
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Analyse attendance performance, student participation and session history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Total Sessions
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {report.totalSessions}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Attendance Rate
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {report.attendanceRate}%
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Students Tracked
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {report.totalStudents}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Total Absentees
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {report.totalAbsent}
          </h2>
        </div>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Attendance Overview
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-green-50 p-5 dark:bg-green-900/20">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Present
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {report.attendanceRate}%
            </p>

          </div>

          <div className="rounded-xl bg-orange-50 p-5 dark:bg-orange-900/20">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Late
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              0%
            </p>

          </div>

          <div className="rounded-xl bg-red-50 p-5 dark:bg-red-900/20">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Absent
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {report.totalStudents > 0
                ? Math.round(
                    (report.totalAbsent /
                      report.totalStudents) *
                      100
                  )
                : 0}%
            </p>

          </div>

        </div>

      </div>

      <div className="rounded-2xl bg-white shadow dark:bg-gray-900">

        <div className="border-b p-6 dark:border-gray-700">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Course Attendance Performance
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b dark:border-gray-700">

              <tr>

                <th className="px-6 py-4">
                  Course
                </th>

                <th className="px-6 py-4">
                  Date
                </th>

                <th className="px-6 py-4">
                  Present
                </th>

                <th className="px-6 py-4">
                  Attendance
                </th>

              </tr>

            </thead>

                        <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading reports...
                  </td>

                </tr>

              ) : sessions.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No attendance sessions found.
                  </td>

                </tr>

              ) : (

                sessions.map((session) => {

                  const attendance =
                    session.studentCount > 0
                      ? Math.round(
                          (session.presentCount /
                            session.studentCount) *
                            100
                        )
                      : 0;

                  return (

                    <tr
                      key={session.id}
                      className="border-b last:border-none dark:border-gray-700"
                    >

                      <td className="px-6 py-4">

                        <p className="font-medium">
                          {session.courseCode}
                        </p>

                        <p className="text-sm text-gray-500">
                          {session.courseTitle}
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        {session.createdAt
                          ?.toDate()
                          .toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4">

                        {session.presentCount}/
                        {session.studentCount}

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            attendance >= 75
                              ? "bg-green-100 text-green-700"
                              : attendance >= 50
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {attendance}%
                        </span>

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Reports;