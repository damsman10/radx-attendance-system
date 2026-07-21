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
      (error) => console.log(error)
    );


    return unsubscribe;


  }, [user]);





  useEffect(() => {

    if (!user) return;


    const unsubscribeCourses = onSnapshot(
      collection(db, "courses"),

      (courseSnapshot) => {


        const myCourses =
          courseSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(course =>
            course.studentIds?.includes(user.uid)
          );



        const courseCodes =
          myCourses.map(
            course => course.courseCode
          );



        const unsubscribeSessions = onSnapshot(
          collection(db, "attendanceSessions"),

          (sessionSnapshot) => {


            const sessions =
              sessionSnapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter(session =>
                courseCodes.includes(
                  session.courseCode
                )
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


    return unsubscribeCourses;


  }, [user]);





  const totalSessions =
    completedSessions.length;


  const presentCount =
    attendanceRecords.filter(
      record => record.status === "Present"
    ).length;


  const lateCount =
    attendanceRecords.filter(
      record => record.status === "Late"
    ).length;



  const absentCount =
    Math.max(
      totalSessions -
      presentCount -
      lateCount,
      0
    );



  const presentPercentage =
    totalSessions
      ? Math.round((presentCount / totalSessions) * 100)
      : 0;



  const latePercentage =
    totalSessions
      ? Math.round((lateCount / totalSessions) * 100)
      : 0;



  const absentPercentage =
    totalSessions
      ? Math.round((absentCount / totalSessions) * 100)
      : 0;




  return (

    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">


      {/* Header */}

      <section>

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-gray-900
          dark:text-white
        ">
          My Attendance
        </h1>


        <p className="
          mt-2
          text-sm
          sm:text-base
          text-gray-600
          dark:text-gray-400
        ">
          View your attendance history and location verification records.
        </p>

      </section>





      {/* Summary Cards */}

      <section className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
        sm:gap-6
      ">


        <SummaryCard
          icon={<CheckCircle2 className="text-emerald-600" />}
          title="Present"
          value={`${presentPercentage}%`}
          subtitle={`${presentCount} of ${totalSessions} sessions`}
        />


        <SummaryCard
          icon={<Clock3 className="text-orange-500" />}
          title="Late"
          value={`${latePercentage}%`}
          subtitle={`${lateCount} session(s)`}
        />


        <SummaryCard
          icon={<XCircle className="text-red-600" />}
          title="Absent"
          value={`${absentPercentage}%`}
          subtitle={`${absentCount} session(s)`}
        />


      </section>





      {/* Attendance Records */}

      <section className="
        rounded-3xl
        bg-white
        dark:bg-gray-900
        shadow-sm
        p-4
        sm:p-6
      ">


        <h2 className="
          text-lg
          sm:text-xl
          font-semibold
          text-gray-900
          dark:text-white
        ">
          Attendance Records
        </h2>



        {loading ? (

          <p className="mt-6 text-gray-500">
            Loading attendance records...
          </p>


        ) : attendanceRecords.length === 0 ? (

          <p className="mt-6 text-gray-500">
            No attendance records found.
          </p>


        ) : (


          <div className="
            mt-6
            space-y-4
            md:hidden
          ">


            {attendanceRecords.map(record => {

              const markedDate =
                record.markedAt?.toDate();


              return (

                <div
                  key={record.id}
                  className="
                    rounded-2xl
                    bg-gray-50
                    dark:bg-gray-800
                    p-4
                    space-y-4
                  "
                >

                  <div>

                    <h3 className="
                      font-semibold
                      text-gray-900
                      dark:text-white
                    ">
                      {record.courseCode}
                    </h3>


                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      {record.courseTitle}
                    </p>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Date
                    </span>


                    <span className="dark:text-white">
                      {markedDate
                        ? markedDate.toLocaleDateString()
                        : "-"
                      }
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Time
                    </span>


                    <span className="dark:text-white">
                      {markedDate
                        ? markedDate.toLocaleTimeString([], {
                            hour:"2-digit",
                            minute:"2-digit",
                          })
                        : "-"
                      }
                    </span>

                  </div>


                  <div className="flex justify-between items-center">

                    <span className="
                      text-gray-500
                      text-sm
                    ">
                      Status
                    </span>


                    <span className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${
                        record.status === "Present"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : record.status === "Late"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }
                    `}>
                      {record.status}
                    </span>

                  </div>

                  
                  <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-emerald-600
                  ">

                    <MapPin size={16} />

                    Verified ({record.distance}m)

                  </div>


                </div>

              );

            })}


          </div>

        )}



        {/* Desktop Table */}

        {!loading && attendanceRecords.length > 0 && (

          <div className="
            hidden
            md:block
            mt-6
            overflow-x-auto
          ">

            <table className="w-full text-left">


              <thead className="
                border-b
                border-gray-200
                dark:border-gray-700
              ">

                <tr className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                ">

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


                {attendanceRecords.map(record => {


                  const markedDate =
                    record.markedAt?.toDate();



                  return (

                    <tr
                      key={record.id}
                      className="
                        border-b
                        border-gray-100
                        dark:border-gray-700
                      "
                    >


                      <td className="py-4">

                        <p className="
                          font-medium
                          text-gray-900
                          dark:text-white
                        ">
                          {record.courseCode}
                        </p>


                        <p className="
                          text-sm
                          text-gray-500
                          dark:text-gray-400
                        ">
                          {record.courseTitle}
                        </p>

                      </td>




                      <td className="
                        text-gray-700
                        dark:text-gray-300
                      ">

                        {markedDate
                          ? markedDate.toLocaleDateString()
                          : "-"
                        }

                      </td>





                      <td className="
                        text-gray-700
                        dark:text-gray-300
                      ">

                        {markedDate
                          ? markedDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"
                        }

                      </td>





                      <td>


                        <span className={`

                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-medium

                          ${
                            record.status === "Present"
                            ? 
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"

                            :

                            record.status === "Late"

                            ?

                            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"

                            :

                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"

                          }

                        `}>

                          {record.status}

                        </span>


                      </td>





                      <td>


                        <div className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-emerald-600
                        ">


                          <MapPin size={16}/>


                          Verified ({record.distance}m)


                        </div>


                      </td>



                    </tr>

                  );


                })}



              </tbody>


            </table>


          </div>

        )}



      </section>


    </div>

  );

}





function SummaryCard({
  icon,
  title,
  value,
  subtitle
}) {


  return (

    <div className="
      rounded-3xl
      bg-white
      dark:bg-gray-900
      shadow-sm
      p-5
    ">


      {icon}



      <p className="
        mt-4
        text-sm
        text-gray-500
        dark:text-gray-400
      ">
        {title}
      </p>



      <h2 className="
        mt-2
        text-3xl
        font-bold
        text-gray-900
        dark:text-white
      ">
        {value}
      </h2>



      <p className="
        mt-2
        text-sm
        text-gray-500
        dark:text-gray-400
      ">
        {subtitle}
      </p>



    </div>

  );

}
