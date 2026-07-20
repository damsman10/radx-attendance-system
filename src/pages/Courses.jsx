import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import CreateCourseModal from "../components/courses/CreateCourseModal";
import EditCourseModal from "../components/courses/EditCourseModal";


const Courses = () => {

  const { user } = useAuth();


  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [deletingId, setDeletingId] = useState(null);



  const fetchCourses = async () => {

    if (!user) return;


    try {

      setLoading(true);


      const coursesQuery = query(
        collection(db, "courses"),
        where("lecturerId", "==", user.uid)
      );


      const snapshot = await getDocs(coursesQuery);


      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));


      setCourses(data);


    } catch (error) {

      console.error("Error loading courses:", error);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchCourses();

  }, [user]);





 const handleDelete = async (courseId) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this course?"
  );


  if (!confirmDelete) return;


  try {

    setDeletingId(courseId);


    await deleteDoc(
      doc(db, "courses", courseId)
    );


    await fetchCourses();


  } catch (error) {

    console.error("Delete failed:", error);

  } finally {

    setDeletingId(null);

  }

};





  return (

    <div className="space-y-8 p-6">


      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Courses
          </h1>


          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your courses and attendance activities.
          </p>

        </div>



        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-[#3D78DA] px-5 py-3 text-white hover:bg-blue-700"
        >
          + Create Course
        </button>


      </div>





      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-4">


        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Total Courses
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {courses.length}
          </h2>
        </div>



        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Students
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              courses.reduce(
                (total, course) =>
                  total + (course.studentCount || 0),
                0
              )
            }
          </h2>
        </div>



        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Semester
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Current
          </h2>
        </div>



        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">
            Attendance
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            0%
          </h2>
        </div>


      </div>





      {/* Courses */}

      {!loading && courses.length > 0 && (

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


          {courses.map((course) => (

            <div
              key={course.id}
              className="rounded-2xl bg-white p-5 shadow transition hover:shadow-lg dark:bg-gray-900"
            >


              <div className="mb-5">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {course.courseCode}
                </h2>


                <p className="text-sm text-gray-500">
                  {course.courseTitle}
                </p>

              </div>



              <div className="space-y-3 text-sm">


                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Department
                  </span>

                  <span>
                    {course.department}
                  </span>
                </div>



                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Level
                  </span>

                  <span>
                    {course.level}
                  </span>
                </div>



                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Semester
                  </span>

                  <span>
                    {course.semester}
                  </span>
                </div>


              </div>




              <div className="mt-5 flex justify-end gap-2">


                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowEditModal(true);
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Edit
                </button>



                <button
                  onClick={() => handleDelete(course.id)}
                  disabled={deletingId === course.id}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === course.id ? "Deleting..." : "Delete"}
                </button>


              </div>


            </div>

          ))}


        </div>

      )}





      {showCreateModal && (

        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onCourseCreated={fetchCourses}
        />

      )}



      {showEditModal && (

        <EditCourseModal
          course={selectedCourse}
          onClose={() => setShowEditModal(false)}
          onCourseUpdated={fetchCourses}
        />

      )}



    </div>

  );

};


export default Courses;