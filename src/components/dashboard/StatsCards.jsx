import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Users,
  MapPinned,
  ChartSpline,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function StatsCards() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const courseQuery = query(
      collection(db, "courses"),
      where("lecturerId", "==", user.uid)
    );

    const unsubscribeCourses = onSnapshot(
      courseQuery,
      (snapshot) => {
        setCourses(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      console.log
    );

    const sessionQuery = query(
      collection(db, "attendanceSessions"),
      where("lecturerId", "==", user.uid)
    );

    const unsubscribeSessions = onSnapshot(
      sessionQuery,
      (snapshot) => {
        setSessions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      console.log
    );

    return () => {
      unsubscribeCourses();
      unsubscribeSessions();
    };
  }, [user]);

  const stats = useMemo(() => {
    const myCourses = courses.length;

    const registeredStudents = courses.reduce(
      (sum, course) =>
        sum + (course.studentCount || 0),
      0
    );

    const activeSessions = sessions.filter(
      (session) => session.status === "Active"
    ).length;

    const totalStudents = sessions.reduce(
      (sum, session) =>
        sum + (session.studentCount || 0),
      0
    );

    const totalPresent = sessions.reduce(
      (sum, session) =>
        sum + (session.presentCount || 0),
      0
    );

    const attendanceRate =
      totalStudents > 0
        ? Math.round(
            (totalPresent / totalStudents) * 100
          )
        : 0;

    return [
      {
        title: "My Courses",
        value: myCourses,
        icon: BookOpen,
        color:
          "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
        trend: `${myCourses} course${
          myCourses !== 1 ? "s" : ""
        }`,
      },
      {
        title: "Registered Students",
        value: registeredStudents,
        icon: Users,
        color:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
        trend: `${registeredStudents} enrolled`,
      },
      {
        title: "Active Sessions",
        value: activeSessions,
        icon: MapPinned,
        color:
          "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
        trend:
          activeSessions > 0
            ? `${activeSessions} currently running`
            : "No active sessions",
      },
      {
        title: "Average Attendance",
        value: `${attendanceRate}%`,
        icon: ChartSpline,
        color:
          "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300",
        trend: "Across all sessions",
      },
    ];
  }, [courses, sessions]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  {stat.title}
                </p>

                <h3 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </h3>

                <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
                  {stat.trend}
                </p>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <Icon size={26} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}