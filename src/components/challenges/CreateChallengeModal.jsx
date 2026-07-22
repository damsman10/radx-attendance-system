import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";


export default function CreateChallengeModal({
  onClose,
  onChallengeCreated,
}) {


  const { user, profile } = useAuth();


  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);



  const [formData, setFormData] = useState({

    title: "",

    description: "",

    courseCode: "",

    courseTitle: "",

    // challengeType: "Quiz",

    totalPoints: "",

    deadline: "",

    status: "Draft",

  });





  useEffect(()=>{

    if(user){

      loadCourses();

    }

  },[user]);






  const loadCourses = async()=>{


    try{


      const q = query(

        collection(
          db,
          "courses"
        ),

        where(
          "lecturerId",
          "==",
          user.uid
        )

      );



      const snapshot =
      await getDocs(q);



      const courseList =
      snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

      }));



      setCourses(courseList);



    }
    catch(error){

      console.error(error);

    }


  };








  const handleChange=(e)=>{


    const {
      name,
      value
    } = e.target;



    if(name==="courseCode"){


      const selectedCourse =
      courses.find(
        course =>
        course.courseCode===value
      );



      setFormData(prev=>({

        ...prev,

        courseCode:value,

        courseTitle:
        selectedCourse?.courseTitle || ""

      }));


      return;

    }



    setFormData(prev=>({

      ...prev,

      [name]:value

    }));


  };









  const handleSubmit = async(e)=>{


    e.preventDefault();



    if(!user || !profile)
      return;





    const selectedDeadline =
    new Date(
      formData.deadline
    );




    if(
      selectedDeadline < new Date()
    ){


      alert(
        "Deadline cannot be in the past."
      );


      return;


    }






    try{


      setLoading(true);




      await addDoc(

        collection(
          db,
          "challenges"
        ),

        {


          title:
          formData.title.trim(),



          description:
          formData.description.trim(),



          courseCode:
          formData.courseCode,



          courseTitle:
          formData.courseTitle,



          // challengeType:
          // formData.challengeType,



          totalPoints:
          Number(
            formData.totalPoints
          ),



          deadline:
          Timestamp.fromDate(
            selectedDeadline
          ),



          status:
          formData.status,



          questions:
          [],



          lecturerId:
          user.uid,



          lecturerName:
          profile.fullName,



          createdAt:
          Timestamp.now(),



          updatedAt:
          Timestamp.now(),


        }

      );




      onChallengeCreated();

      onClose();



    }
    catch(error){


      console.error(
        "Error creating challenge:",
        error
      );


    }
    finally{


      setLoading(false);


    }


  };



  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/50
      px-4
    ">


      <div className="
        max-h-[90vh]
        w-full
        max-w-lg
        overflow-y-auto
        rounded-3xl
        bg-white
        p-6
        shadow-xl
        dark:bg-gray-900
      ">



        <div className="
          mb-6
          flex
          items-center
          justify-between
        ">


          <h2 className="
            text-xl
            font-bold
            text-gray-900
            dark:text-white
          ">
            Create Challenge
          </h2>



          <button
            onClick={onClose}
            className="
              rounded-lg
              p-1
              text-gray-500
              hover:bg-gray-100
              dark:hover:bg-gray-800
            "
          >

            <X size={22}/>

          </button>


        </div>






        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >



          <div>

            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Challenge Title
            </label>


            <input

              type="text"

              name="title"

              required

              value={formData.title}

              onChange={handleChange}

              placeholder="Software Engineering Quiz"

              className="
                w-full
                rounded-xl
                border
                p-3
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
              "

            />

          </div>






          <div>

            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Description
            </label>


            <textarea

              rows="4"

              name="description"

              required

              value={formData.description}

              onChange={handleChange}

              placeholder="Enter challenge description..."

              className="
                w-full
                rounded-xl
                border
                p-3
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
              "

            />

          </div>







          <div>

            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Course
            </label>


            <select

              name="courseCode"

              required

              value={formData.courseCode}

              onChange={handleChange}

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

              <option value="">
                Select Course
              </option>


              {
                courses.map(course=>(

                  <option

                    key={course.courseCode}

                    value={course.courseCode}

                  >

                    {course.courseCode} - {course.courseTitle}

                  </option>

                ))
              }


            </select>


          </div>








          <div>

            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Challenge Type
            </label>


            {/* <select

              name="challengeType"

              value={formData.challengeType}

              onChange={handleChange}

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

              <option value="Quiz">
                Quiz
              </option>

              <option value="Assignment">
                Assignment
              </option>

              <option value="Essay">
                Essay
              </option>


            </select> */}


          </div>







          <div>

            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Total Points
            </label>


            <input

              type="number"

              min="1"

              required

              name="totalPoints"

              value={formData.totalPoints}

              onChange={handleChange}

              placeholder="100"

              className="
                w-full
                rounded-xl
                border
                p-3
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
              "

            />


          </div>







          <div>

            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Deadline
            </label>


            <input

              type="date"

              required

              name="deadline"

              min={
                new Date()
                .toISOString()
                .split("T")[0]
              }

              value={formData.deadline}

              onChange={handleChange}

              className="
                w-full
                rounded-xl
                border
                p-3
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
              "

            />


          </div>








          <div>

            <label className="mb-2 block text-sm font-medium dark:text-gray-300">
              Status
            </label>


            <select

              name="status"

              value={formData.status}

              onChange={handleChange}

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

              <option value="Draft">
                Draft
              </option>


              <option value="Active">
                Active
              </option>


            </select>


          </div>








          <div className="
            flex
            gap-3
            pt-2
          ">


            <button

              type="button"

              onClick={onClose}

              disabled={loading}

              className="
                flex-1
                rounded-xl
                border
                py-3
                dark:border-gray-700
                dark:text-gray-300
              "

            >

              Cancel

            </button>





            <button

              type="submit"

              disabled={loading}

              className="
                flex-1
                rounded-xl
                bg-[#3D78DA]
                py-3
                text-white
                disabled:opacity-50
              "

            >

              {
                loading
                ?
                "Creating..."
                :
                "Create Challenge"
              }


            </button>


          </div>



        </form>



      </div>


    </div>

  );

}
