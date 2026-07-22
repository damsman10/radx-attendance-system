import { useEffect, useMemo, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {
  Trophy,
  Medal,
  Crown,
} from "lucide-react";


import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";



export default function MyLeaderboard() {


  const { user } = useAuth();


  const [courses,setCourses] = useState([]);

  const [selectedCourse,setSelectedCourse] = useState("");

  const [submissions,setSubmissions] = useState([]);

  const [loadingCourses,setLoadingCourses] = useState(true);

  const [loadingResults,setLoadingResults] = useState(true);





  // Load student's enrolled courses

  useEffect(()=>{


    if(!user)
      return;



    const q = query(

      collection(db,"studentCourses"),

      where(
        "studentId",
        "==",
        user.uid
      )

    );



    const unsubscribe = onSnapshot(

      q,

      (snapshot)=>{


        const data =
        snapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }));


        setCourses(data);



        if(data.length > 0){

          setSelectedCourse(
            data[0].courseCode
          );

        }



        setLoadingCourses(false);


      },

      (error)=>{

        console.log(error);

        setLoadingCourses(false);

      }

    );



    return unsubscribe;


  },[user]);









  // Load submissions for selected course

  useEffect(()=>{


    if(!selectedCourse)
      return;



    const q = query(

      collection(
        db,
        "challengeSubmissions"
      ),

      where(
        "courseCode",
        "==",
        selectedCourse
      )

    );



    const unsubscribe = onSnapshot(

      q,

      (snapshot)=>{


        const data =
        snapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }));


        setSubmissions(data);

        setLoadingResults(false);


      },

      (error)=>{

        console.log(error);

        setLoadingResults(false);

      }

    );



    return unsubscribe;


  },[selectedCourse]);





  const rankings = useMemo(()=>{


    const students = {};



    submissions.forEach(item=>{


      if(!students[item.studentId]){


        students[item.studentId] = {

          studentId:item.studentId,

          name:
          item.studentName || "Student",

          points:0,

        };


      }



      students[item.studentId].points +=
      Number(item.score || 0);



    });




    return Object.values(students)

      .sort(
        (a,b)=>
        b.points - a.points
      )

      .map(
        (student,index)=>({

          ...student,

          rank:index+1

        })
      );



  },[submissions]);




  const myRank = rankings.find(
    student =>
    student.studentId === user?.uid
  );


  return (

    <div className="space-y-8 p-6">


      <section>

        <h1 className="
          text-3xl
          font-bold
          text-gray-900
          dark:text-white
        ">
          My Leaderboard
        </h1>


        <p className="
          mt-2
          text-gray-600
          dark:text-gray-400
        ">
          Compare your performance with other students by course.
        </p>


      </section>






      {/* COURSE SELECT */}

      <section className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        dark:bg-gray-900
      ">


        <label className="
          mb-2
          block
          text-sm
          font-medium
          dark:text-gray-300
        ">

          Select Course

        </label>



        <select

          value={selectedCourse}

          onChange={(e)=>
            setSelectedCourse(e.target.value)
          }

          className="
            w-full
            rounded-xl
            border
            p-3
            dark:border-gray-700
            dark:bg-gray-800
            dark:text-white
          "

        >

          {
            loadingCourses ?

            <option>
              Loading courses...
            </option>

            :

            courses.length === 0 ?

            <option>
              No courses found
            </option>

            :

            courses.map(course=>(

              <option

                key={course.id}

                value={course.courseCode}

              >

                {course.courseCode}
                {" - "}
                {course.courseTitle}

              </option>

            ))

          }


        </select>


      </section>








      {/* MY RANK */}

      <section className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        dark:bg-gray-900
      ">


        <div className="
          flex
          items-center
          gap-4
        ">


          <div className="
            rounded-2xl
            bg-yellow-100
            p-4
            dark:bg-yellow-900/30
          ">


            <Crown
              className="text-yellow-600"
              size={30}
            />


          </div>




          <div>


            <p className="
              text-sm
              text-gray-500
              dark:text-gray-400
            ">

              Your Current Rank

            </p>



            <h2 className="
              text-4xl
              font-bold
              text-gray-900
              dark:text-white
            ">

              {
                myRank
                ?
                `#${myRank.rank}`
                :
                "-"
              }

            </h2>


          </div>


        </div>


      </section>








      {/* RANKINGS */}

      <section className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        dark:bg-gray-900
      ">



        <div className="
          flex
          items-center
          gap-3
        ">


          <Trophy className="text-yellow-500"/>


          <h2 className="
            text-xl
            font-semibold
            dark:text-white
          ">

            Rankings

          </h2>


        </div>






        {
          loadingResults ?

          <p className="
            mt-6
            text-gray-500
          ">

            Loading leaderboard...

          </p>


          :


          rankings.length === 0 ?


          <p className="
            mt-6
            text-gray-500
          ">

            No submissions yet.

          </p>


          :


          <div className="
            mt-6
            space-y-4
          ">


          {
            rankings.map(student=>(


              <div

                key={student.studentId}

                className={`

                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  p-4

                  ${
                    student.studentId === user?.uid

                    ?

                    "bg-blue-50 dark:bg-blue-900/20"

                    :

                    "bg-gray-50 dark:bg-gray-800"

                  }

                `}

              >




                <div className="
                  flex
                  items-center
                  gap-4
                ">



                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    font-bold
                    dark:bg-gray-700
                    dark:text-white
                  ">


                    {
                      student.rank <= 3

                      ?

                      <Medal size={20}/>

                      :

                      student.rank

                    }


                  </div>






                  <div>


                    <p className="
                      font-semibold
                      dark:text-white
                    ">

                      {
                        student.studentId === user?.uid

                        ?
                        "You"

                        :

                        student.name
                      }


                    </p>


                  </div>


                </div>






                <div className="
                  font-bold
                  text-blue-600
                ">

                  {student.points} pts


                </div>



              </div>


            ))

          }


          </div>


        }


      </section>


    </div>

  );

}
