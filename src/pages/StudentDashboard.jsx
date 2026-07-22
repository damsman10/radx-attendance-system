import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import {
  CalendarCheck,
  BookOpen,
  MapPin,
  Clock3,
  Users,
} from "lucide-react";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";


export default function StudentDashboard() {

  const navigate = useNavigate();

  const { user } = useAuth();


  // const [profile, setProfile] = useState(null);

  const [courses, setCourses] = useState([]);

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [attendanceSessions, setAttendanceSessions] = useState([]);

  const [loading, setLoading] = useState(true);



  /* ======================================
      LOAD STUDENT PROFILE
  ====================================== */

  // useEffect(() => {

  //   if (!user) return;


  //   const unsubscribe = onSnapshot(
  //     collection(db, "users"),
  //     (snapshot) => {

  //       const student = snapshot.docs.find(
  //         (doc) => doc.id === user.uid
  //       );


  //       if (student) {

  //         setProfile({
  //           id: student.id,
  //           ...student.data(),
  //         });

  //       }

  //     }
  //   );


  //   return unsubscribe;


  // }, [user]);





  /* ======================================
      LOAD ENROLLED COURSES
  ====================================== */

  useEffect(() => {

    if (!user) return;


    const q = query(
      collection(db, "courses"),
      where(
        "studentIds",
        "array-contains",
        user.uid
      )
    );


    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        setCourses(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );


      }
    );


    return unsubscribe;


  }, [user]);





  /* ======================================
      LOAD ATTENDANCE RECORDS
  ====================================== */

  useEffect(() => {

    if (!user) return;


    const q = query(
      collection(db, "attendanceRecords"),
      where(
        "studentId",
        "==",
        user.uid
      )
    );


    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        setAttendanceRecords(

          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

        );

        setLoading(false);

      }
    );


    return unsubscribe;


  }, [user]);





  /* ======================================
      LOAD ATTENDANCE SESSIONS
  ====================================== */

  useEffect(() => {


    const unsubscribe = onSnapshot(

      collection(
        db,
        "attendanceSessions"
      ),

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





  if (loading) {

    return (

      <div className="p-6">

        <div className="rounded-3xl bg-white p-10 text-center shadow dark:bg-gray-900">

          Loading dashboard...

        </div>

      </div>

    );

  }





  const enrolledCourseCodes =
    courses.map(
      (course) => course.courseCode
    );



  const studentActiveSessions =
    attendanceSessions.filter(
      (session) =>
        session.status === "Active" &&
        enrolledCourseCodes.includes(
          session.courseCode
        )
    );



  const classesAttended =
    attendanceRecords.filter(
      (record) =>
        record.status === "Present" ||
        record.status === "Late"
    ).length;



  const attendanceRate =
    attendanceRecords.length > 0
      ? Math.round(
          (classesAttended /
            attendanceRecords.length) *
            100
        )
      : 0;



  const latestRecords =
    [...attendanceRecords]
      .sort(
        (a, b) =>
          (b.markedAt?.seconds || 0) -
          (a.markedAt?.seconds || 0)
      )
      .slice(0, 5);



  const activeSession =
    studentActiveSessions[0];



  return (

    <div className="space-y-8 p-6">


      {/* Header */}

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">


        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


          <div>


            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">

              Student Dashboard

            </span>



            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">

              Track your attendance

            </h1>



            <p className="mt-3 max-w-xl text-slate-600 dark:text-gray-400">

              View your courses, attendance history and active attendance sessions.

            </p>



            <button
            disabled={studentActiveSessions.length === 0}
            onClick={() => navigate("/student/active-attendance")}
            className={`mt-6 rounded-xl px-5 py-3 font-semibold text-white transition ${
              studentActiveSessions.length === 0
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {studentActiveSessions.length === 0
              ? "No Active Session"
              : "Join Attendance Session"}
          </button>


          </div>




          <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-900/20">


            <MapPin className="text-blue-600 dark:text-blue-400" />


            <p className="mt-3 text-sm text-slate-500 dark:text-gray-400">

              Location Verification

            </p>


            <p className="mt-1 font-semibold text-emerald-600">

              GPS Ready

            </p>


          </div>


        </div>


      </section>





      {/* Stats */}

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

          <BookOpen className="text-blue-600" />

          <p className="mt-4 text-sm text-gray-500">

            Courses Enrolled

          </p>

          <h2 className="mt-2 text-4xl font-bold">

            {courses.length}

          </h2>

        </div>


        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

          <CalendarCheck className="text-emerald-600" />

          <p className="mt-4 text-sm text-gray-500">

            Attendance Rate

          </p>

          <h2 className="mt-2 text-4xl font-bold">

            {attendanceRate}%

          </h2>

        </div>


        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

          <Users className="text-purple-600" />

          <p className="mt-4 text-sm text-gray-500">

            Classes Attended

          </p>

          <h2 className="mt-2 text-4xl font-bold">

            {classesAttended}

          </h2>

        </div>


        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">

          <Clock3 className="text-orange-600" />

          <p className="mt-4 text-sm text-gray-500">

            Active Sessions

          </p>

          <h2 className="mt-2 text-4xl font-bold">

            {studentActiveSessions.length}

          </h2>

        </div>


      </section>


      {/* Active Attendance Session */}

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">


        <div className="flex items-center justify-between">


          <div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">

              Active Attendance Session

            </h2>


            <p className="text-sm text-gray-500 dark:text-gray-400">

              Available attendance sessions for your courses

            </p>

          </div>



          {activeSession && (

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">

              Active

            </span>

          )}


        </div>





        {!activeSession ? (

          <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-gray-500 dark:bg-gray-800">

            No active attendance sessions.

          </div>

        ) : (

          <div className="mt-6 grid gap-4 md:grid-cols-3">


            <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

              <p className="text-sm text-gray-500">

                Course Code

              </p>

              <p className="font-semibold">

                {activeSession.courseCode}

              </p>

            </div>



            <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

              <p className="text-sm text-gray-500">

                Course Title

              </p>

              <p className="font-semibold">

                {activeSession.courseTitle}

              </p>

            </div>



            <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

              <p className="text-sm text-gray-500">

                Venue

              </p>

              <p className="font-semibold">

                {activeSession.venue || "-"}

              </p>

            </div>



            <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

              <p className="text-sm text-gray-500">

                Lecturer

              </p>

              <p className="font-semibold">

                {activeSession.lecturerName || "-"}

              </p>

            </div>



            <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

              <p className="text-sm text-gray-500">

                Verification Method

              </p>

              <p className="font-semibold">

                {activeSession.verificationMode || "GPS"}

              </p>

            </div>



            <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

              <p className="text-sm text-gray-500">

                Time Remaining

              </p>


              <p className="flex items-center gap-2 font-semibold text-orange-600">

                <Clock3 size={18} />

                {activeSession.endTime
                  ? activeSession.endTime
                      .toDate()
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                  : "-"}

              </p>

            </div>



          </div>

        )}


      </section>





      {/* Recent Attendance */}


      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">


        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">

          Recent Attendance

        </h2>



        <div className="mt-5 space-y-3">


          {latestRecords.length === 0 ? (

            <div className="rounded-xl bg-slate-50 p-6 text-center text-gray-500 dark:bg-gray-800">

              No attendance records found.

            </div>

          ) : (


            latestRecords.map((record) => (

              <div

                key={record.id}

                className="grid gap-3 rounded-xl bg-slate-50 p-4 dark:bg-gray-800 md:grid-cols-4"

              >


                <span className="font-medium text-gray-900 dark:text-white">

                  {record.courseCode}

                </span>



                <span
                  className={
                    record.status === "Present" ||
                    record.status === "Late"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }
                >

                  {record.status}

                </span>



                <span className="text-gray-500">

                  {record.markedAt
                    ?.toDate()
                    .toLocaleDateString() || "-"}

                </span>



                <span className="text-gray-500">

                  {record.markedAt
                    ?.toDate()
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "-"}

                </span>



              </div>

            ))

          )}


        </div>


      </section>


    </div>

  );

}
