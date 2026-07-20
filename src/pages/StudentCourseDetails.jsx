import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import {
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  Users,
} from "lucide-react";

import { db } from "../firebase";

export default function StudentCourseDetails() {
  const { courseCode } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  setLoading(true);

  const q = query(
    collection(db, "courses"),
    where("courseCode", "==", courseCode)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {

      if (!snapshot.empty) {
        setCourse(snapshot.docs[0].data());
      } else {
        setCourse(null);
      }

      setLoading(false);

    },
    (error) => {

      console.log(error);
      setLoading(false);

    }
  );

  return () => unsubscribe();

}, [courseCode]);

  

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!course) {
    return (
      <div className="p-6">
        Course not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">

      <div>

        <button
          onClick={() => navigate(-1)}
          className="mb-5 text-[#3D78DA] font-medium hover:underline"
        >
          ← Back to My Courses
        </button>

        <h1 className="text-3xl font-bold">
          {course.courseTitle}
        </h1>

        <p className="mt-2 text-blue-600 font-semibold">
          {course.courseCode}
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

          <BookOpen className="mb-3 text-blue-600" />

          <p className="text-gray-500">
            Course Code
          </p>

          <h3 className="text-xl font-bold">
            {course.courseCode}
          </h3>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

          <User className="mb-3 text-blue-600" />

          <p className="text-gray-500">
            Lecturer
          </p>

          <h3 className="text-xl font-bold">
            {course.lecturerName}
          </h3>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

          <GraduationCap className="mb-3 text-blue-600" />

          <p className="text-gray-500">
            Department
          </p>

          <h3 className="text-xl font-bold">
            {course.department}
          </h3>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

          <GraduationCap className="mb-3 text-blue-600" />

          <p className="text-gray-500">
            Level
          </p>

          <h3 className="text-xl font-bold">
            {course.level}
          </h3>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

          <Calendar className="mb-3 text-blue-600" />

          <p className="text-gray-500">
            Semester
          </p>

          <h3 className="text-xl font-bold">
            {course.semester}
          </h3>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-900">

          <Users className="mb-3 text-blue-600" />

          <p className="text-gray-500">
            Students
          </p>

          <h3 className="text-xl font-bold">
            {course.studentCount}
          </h3>

        </div>

      </div>

    </div>
  );
}