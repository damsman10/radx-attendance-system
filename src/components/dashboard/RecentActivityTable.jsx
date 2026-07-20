import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function RecentActivityTable() {
  const { user } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const sessionsQuery = query(
      collection(db, "attendanceSessions"),
      where("lecturerId", "==", user.uid)
    );

    const unsubscribeSessions = onSnapshot(
      sessionsQuery,
      (sessionSnapshot) => {
        const sessionIds = sessionSnapshot.docs.map(
          (doc) => doc.id
        );

        if (sessionIds.length === 0) {
          setActivities([]);
          setLoading(false);
          return;
        }

        const unsubscribeAttendance = onSnapshot(
          collection(db, "attendanceRecords"),
          (attendanceSnapshot) => {
            const records = attendanceSnapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((record) =>
                sessionIds.includes(record.sessionId)
              )
              .sort(
                (a, b) =>
                  (b.markedAt?.seconds || 0) -
                  (a.markedAt?.seconds || 0)
              )
              .slice(0, 10);

            setActivities(records);
            setLoading(false);
          },
          (error) => {
            console.log(error);
            setLoading(false);
          }
        );

        return unsubscribeAttendance;
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => unsubscribeSessions();
  }, [user]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

      <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
        Recent Attendance Activity
      </h2>

      <div className="overflow-x-auto">

        {loading ? (

          <p className="text-gray-500">
            Loading activity...
          </p>

        ) : activities.length === 0 ? (

          <p className="text-gray-500">
            No attendance activity yet.
          </p>

        ) : (

          <table className="w-full text-left">

            <thead className="border-b border-slate-200 dark:border-gray-700">

              <tr className="text-sm text-slate-500 dark:text-gray-400">

                <th className="pb-3">
                  Student
                </th>

                <th>
                  Course
                </th>

                <th>
                  Time
                </th>

                <th>
                  Distance
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {activities.map((student) => {

                const markedTime =
                  student.markedAt?.toDate();

                return (

                  <tr
                    key={student.id}
                    className="border-b border-slate-200 last:border-none dark:border-gray-700"
                  >

                    <td className="py-4 text-slate-900 dark:text-white">
                      {student.studentName}
                    </td>

                    <td className="text-slate-700 dark:text-gray-300">
                      {student.courseCode}
                    </td>

                    <td className="text-slate-700 dark:text-gray-300">
                      {markedTime
                        ? markedTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>

                    <td className="text-slate-700 dark:text-gray-300">
                      {student.distance} m
                    </td>

                    <td>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          student.status === "Present"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : student.status === "Late"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {student.status}
                      </span>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        )}

      </div>

    </section>
  );
}