import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {
  BookOpen,
  Users,
  Download,
  Eye,
} from "lucide-react";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Students() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);



  /* ==========================================
      LECTURER COURSES
  ========================================== */

  useEffect(() => {

    if (!user) return;

    const q = query(
      collection(db, "courses"),
      where("lecturerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      setCourses(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

    });

    return unsubscribe;

  }, [user]);



  /* ==========================================
      STUDENTS
  ========================================== */

  useEffect(() => {

    const q = query(
      collection(db, "users"),
      where("role", "==", "student")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      setStudents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

    });

    return unsubscribe;

  }, []);



  /* ==========================================
      ATTENDANCE RECORDS
  ========================================== */

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "attendanceRecords"),
      (snapshot) => {

        setAttendanceRecords(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

      }
    );

    return unsubscribe;

  }, []);




  /* ==========================================
      ATTENDANCE SESSIONS
  ========================================== */

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "attendanceSessions"),
      (snapshot) => {

        setAttendanceSessions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

      }
    );

    return unsubscribe;

  }, []);




  /* ==========================================
      GROUP STUDENTS BY COURSE
  ========================================== */

  const courseGroups = useMemo(() => {

    return courses.map((course) => {

      const enrolledStudents = students.filter((student) =>
        course.studentIds?.includes(student.id)
      );


      const totalSessions = attendanceSessions.filter(
        (session) =>
          session.courseCode === course.courseCode
      ).length;



      const studentData = enrolledStudents.map((student) => {


        const records = attendanceRecords.filter(
          (record) =>
            record.studentId === student.id &&
            record.courseCode === course.courseCode
        );


        const present = records.filter(
          (record) =>
            record.status === "Present" ||
            record.status === "Late"
        ).length;



        const attendance =
          totalSessions > 0
            ? Math.round(
                (present / totalSessions) * 100
              )
            : 0;



        const lastAttendance =
          records.length > 0
            ? records.sort(
                (a, b) =>
                  b.markedAt?.seconds -
                  a.markedAt?.seconds
              )[0]
            : null;



        return {
          ...student,
          attendance,
          present,
          totalSessions,
          lastAttendance,
        };

      });



      return {
        ...course,
        students: studentData,
      };

    });

  }, [
    courses,
    students,
    attendanceRecords,
    attendanceSessions,
  ]);




  /* ==========================================
      SUMMARY
  ========================================== */

  const totalCourses = courses.length;


  const totalStudents = new Set(
    courseGroups.flatMap((course) =>
      course.students.map((student) => student.id)
    )
  ).size;



  /* ==========================================
      EXPORT CSV
  ========================================== */

  const exportAttendance = (course) => {

    const rows = course.students.map((student) => ({
      Name: student.fullName,
      "Matric Number": student.matricNumber,
      Email: student.email,
      "Attendance (%)": student.attendance,
      Present: student.present,
      "Total Sessions": student.totalSessions,
      "Last Attendance":
        student.lastAttendance?.markedAt
          ?.toDate()
          .toLocaleString() || "N/A",
      "Verification Method":
        student.lastAttendance?.verificationMethod ||
        "N/A",
    }));


    if (rows.length === 0) {

      alert("No students available to export.");

      return;

    }


    const headers = Object.keys(rows[0]);


    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map(
            (header) =>
              `"${row[header] ?? ""}"`
          )
          .join(",")
      ),
    ].join("\n");



    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );


    const url = URL.createObjectURL(blob);


    const link = document.createElement("a");

    link.href = url;

    link.download =
      `${course.courseCode}_Attendance_Report.csv`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

  };



  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Students
          </h1>

          <p className="mt-2 text-slate-500 dark:text-gray-400">
            View students enrolled in your courses and monitor their attendance.
          </p>

        </div>

      </div>



      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-gray-400">
                My Courses
              </p>

              <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                {totalCourses}
              </h2>

            </div>

            <div className="rounded-2xl bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">

              <BookOpen size={28} />

            </div>

          </div>

        </div>



        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-gray-400">
                Total Students
              </p>

              <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                {totalStudents}
              </h2>

            </div>


            <div className="rounded-2xl bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">

              <Users size={28} />

            </div>

          </div>

        </div>

      </div>

      {/* Courses */}

      <div className="space-y-8">

        {courseGroups.map((course) => (

          <div
            key={course.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >

            {/* Course Header */}

            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-gray-700 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {course.courseCode}
                </h2>

                <p className="text-slate-500 dark:text-gray-400">
                  {course.courseTitle}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {course.students.length} Student
                  {course.students.length !== 1 && "s"}
                </p>

              </div>


              <button
                onClick={() => exportAttendance(course)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
              >

                <Download size={18} />

                Export Attendance

              </button>


            </div>




            {/* Students Table */}

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b border-slate-200 dark:border-gray-700">

                  <tr className="text-left text-sm text-slate-500 dark:text-gray-400">


                    <th className="px-6 py-4">
                      Student
                    </th>


                    <th className="px-6 py-4">
                      Matric Number
                    </th>


                    <th className="px-6 py-4">
                      Email
                    </th>


                    <th className="px-6 py-4">
                      Attendance
                    </th>


                    <th className="px-6 py-4">
                      Action
                    </th>


                  </tr>

                </thead>



                <tbody>


                  {course.students.length === 0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-500 dark:text-gray-400"
                      >

                        No enrolled students found.

                      </td>

                    </tr>


                  ) : (


                    course.students.map((student) => (


                      <tr
                        key={student.id}
                        className="border-b border-slate-200 last:border-none dark:border-gray-700"
                      >


                        <td className="px-6 py-4">


                          <p className="font-medium text-slate-900 dark:text-white">

                            {student.fullName}

                          </p>


                        </td>



                        <td className="px-6 py-4 text-slate-600 dark:text-gray-300">

                          {student.matricNumber}

                        </td>



                        <td className="px-6 py-4 text-slate-600 dark:text-gray-300">

                          {student.email}

                        </td>




                        <td className="px-6 py-4">


                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              student.attendance >= 75
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : student.attendance >= 50
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >

                            {student.attendance}%

                          </span>


                        </td>





                        <td className="px-6 py-4">


                          <button
                            onClick={() =>
                              navigate(
                                `/lecturer/students/${student.id}/${course.courseCode}`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >

                            <Eye size={16} />

                            View

                          </button>


                        </td>



                      </tr>


                    ))


                  )}



                </tbody>


              </table>


            </div>


          </div>


        ))}


      </div>


    </div>

  );

}
