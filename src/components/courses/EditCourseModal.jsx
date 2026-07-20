import { useState } from "react";
import { X } from "lucide-react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";


export default function EditCourseModal({
  course,
  onClose,
  onCourseUpdated,
}) {


  const [formData, setFormData] = useState({
    courseCode: course.courseCode || "",
    courseTitle: course.courseTitle || "",
    department: course.department || "",
    level: course.level || "",
    semester: course.semester || "",
    session: course.session || "",
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


    try {

      setLoading(true);


      const courseRef = doc(
        db,
        "courses",
        course.id
      );


      await updateDoc(courseRef, {

        ...formData,

        updatedAt: Timestamp.now(),

      });

      await onCourseUpdated();
    
      onClose();



    } catch (error) {

      console.error(
        "Error updating course:",
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
            Edit Course
          </h2>


          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >

            <X size={22} />

          </button>

        </div>




        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          <input
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />



          <input
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />



          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />



          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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

          </select>



          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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




          <select
            name="session"
            value={formData.session}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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




          <div className="flex gap-3 pt-2">


            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border py-3"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#3D78DA] py-3 text-white"
            >

              {loading ? "Saving..." : "Save Changes"}

            </button>


          </div>


        </form>


      </div>


    </div>

  );

}