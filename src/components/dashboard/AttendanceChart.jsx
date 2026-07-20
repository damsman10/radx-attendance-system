import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  TrendingUp,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function AttendanceChart() {
  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "attendanceSessions"),
      where("lecturerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setSessions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => console.log(error)
    );

    return () => unsubscribe();
  }, [user]);

  const courseData = useMemo(() => {
    const grouped = {};

    sessions.forEach((session) => {
      if (!grouped[session.courseCode]) {
        grouped[session.courseCode] = {
          courseCode: session.courseCode,
          courseTitle: session.courseTitle,
          totalPresent: 0,
          totalExpected: 0,
        };
      }

      grouped[session.courseCode].totalPresent +=
        session.presentCount || 0;

      grouped[session.courseCode].totalExpected +=
        session.studentCount || 0;
    });

    return Object.values(grouped)
      .map((course) => ({
        ...course,
        attendance:
          course.totalExpected > 0
            ? Math.round(
                (course.totalPresent /
                  course.totalExpected) *
                  100
              )
            : 0,
      }))
      .sort((a, b) => b.attendance - a.attendance);
  }, [sessions]);

  const overallAverage =
    courseData.length > 0
      ? Math.round(
          courseData.reduce(
            (sum, course) => sum + course.attendance,
            0
          ) / courseData.length
        )
      : 0;

  const bestCourse = courseData[0];

    return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <BarChart3 className="text-blue-600" />

          <div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Attendance by Course
            </h2>

            <p className="text-sm text-slate-500 dark:text-gray-400">
              Average attendance across all your courses
            </p>

          </div>

        </div>

        <TrendingUp className="text-emerald-600" />

      </div>

      {courseData.length === 0 ? (

        <div className="rounded-xl bg-slate-50 p-8 text-center dark:bg-gray-800">

          <p className="text-slate-500 dark:text-gray-400">
            No attendance sessions available yet.
          </p>

        </div>

      ) : (

        <>
          <div className="space-y-5">

            {courseData.map((course) => (

              <div key={course.courseCode}>

                <div className="mb-2 flex justify-between">

                  <div>

                    <p className="font-medium text-slate-900 dark:text-white">
                      {course.courseCode}
                    </p>

                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      {course.courseTitle}
                    </p>

                  </div>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {course.attendance}%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-200 dark:bg-gray-700">

                  <div
                    className="h-3 rounded-full bg-blue-600 transition-all duration-500"
                    style={{
                      width: `${course.attendance}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Overall Average Attendance
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {overallAverage}%
                </p>

              </div>

              {bestCourse && (

                <div className="text-right">

                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Best Performing Course
                  </p>

                  <p className="mt-1 font-semibold text-blue-800 dark:text-blue-200">
                    {bestCourse.courseCode}
                  </p>

                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {bestCourse.attendance}%
                  </p>

                </div>

              )}

            </div>

          </div>
        </>

      )}

    </section>
  );
}