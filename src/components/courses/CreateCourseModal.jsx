import { useState } from "react";
import { X } from "lucide-react";

import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";


export default function CreateCourseModal({ 
  onClose, 
  onCourseCreated 
}) {


  const { user, profile } = useAuth();


  const [formData, setFormData] = useState({
    courseCode: "",
    courseTitle: "",
    department: "",
    level: "",
    semester: "",
    session: "",
  });


  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };




  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!user || !profile) {

      console.error("User information not available");

      return;

    }



    try {

      setLoading(true);



      const courseCode = formData.courseCode.trim().toUpperCase();

const courseRef = doc(db, "courses", courseCode);

// Check if the course already exists
const existingCourse = await getDoc(courseRef);

if (existingCourse.exists()) {
  alert("A course with this code already exists.");
  setLoading(false);
  return;
}

await setDoc(courseRef, {
  ...formData,
  courseCode,
  lecturerId: user.uid,
  lecturerName: profile.fullName,
  status: "Active",
  studentCount: 0,
  studentIds: [],
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});



      // Refresh courses list
      onCourseCreated();



      // Close modal
      onClose();



    } catch (error) {

      console.error(
        "Error creating course:",
        error
      );


    } finally {

      setLoading(false);

    }

  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-900">


        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Course
          </h2>


          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          >

            <X size={22} />

          </button>


        </div>





        <form 
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          {/* Course Code */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course Code
            </label>


            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
              placeholder="e.g. CSC401"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

          </div>





          {/* Course Title */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course Title
            </label>


            <input
              type="text"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              required
              placeholder="Software Engineering"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />


          </div>





          {/* Department */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>


            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="Computer Science"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />


          </div>





          {/* Level */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Level
            </label>


            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >

              <option value="">
                Select Level
              </option>

              <option value="100">
                100 Level
              </option>

              <option value="200">
                200 Level
              </option>

              <option value="300">
                300 Level
              </option>

              <option value="400">
                400 Level
              </option>

              <option value="600">
                600 Level
              </option>

              <option value="700">
                700 Level
              </option>

              <option value="800">
                800 Level
              </option>

              <option value="900">
                900 Level
              </option>


            </select>


          </div>





          {/* Semester */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Semester
            </label>


            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >

              <option value="">
                Select Semester
              </option>

              <option value="First">
                First Semester
              </option>

              <option value="Second">
                Second Semester
              </option>


            </select>


          </div>






          {/* Academic Session */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Academic Session
            </label>


            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >

              <option value="">
                Select Session
              </option>

              <option value="2025/2026">
                2025/2026
              </option>

              <option value="2026/2027">
                2026/2027
              </option>

              <option value="2027/2028">
                2027/2028
              </option>


            </select>


          </div>







          {/* Buttons */}
          <div className="flex gap-3 pt-2">


            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >

              Cancel

            </button>





            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#3D78DA] py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >

              {loading ? "Creating..." : "Create Course"}

            </button>


          </div>



        </form>


      </div>


    </div>
  );
}