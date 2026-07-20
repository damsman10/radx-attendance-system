import { useEffect, useState } from "react";
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
} from "lucide-react";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import JoinCourseModal from "../components/students/JoinCourseModal";

export default function MyCourses() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

  

  useEffect(() => {

  if (!user) return;

  setLoading(true);

  const q = query(
    collection(db, "courses"),
    where("studentIds", "array-contains", user.uid)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(data);
      setLoading(false);

    },
    (error) => {

      console.log(error);
      setLoading(false);

    }
  );

    return () => unsubscribe();

  }, [user]);

  return (
    <>
      <div className="space-y-8 p-6">

        {/* Header */}
        <section className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Courses
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View and join your registered courses.
            </p>

          </div>

          <button
            onClick={() => setShowJoinModal(true)}
            className="rounded-xl bg-[#3D78DA] px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Join Course
          </button>

        </section>

        {/* Content */}
        {loading ? (

          <div className="rounded-2xl bg-white p-8 shadow dark:bg-gray-900">
            Loading courses...
          </div>

        ) : courses.length === 0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow dark:bg-gray-900">

            <BookOpen
              size={50}
              className="mx-auto mb-4 text-blue-600"
            />

            <h2 className="text-2xl font-bold">
              No Courses Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Click <strong>Join Course</strong> to enroll using your course code.
            </p>

          </div>

        ) : (

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course) => (

              <div
                key={course.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-xl font-bold">
                      {course.courseTitle}
                    </h2>

                    <p className="text-blue-600 font-semibold">
                      {course.courseCode}
                    </p>

                  </div>

                  <BookOpen className="text-blue-600" />

                </div>

                <div className="mt-6 space-y-3 text-sm">

                  <p>
                    <strong>Lecturer:</strong> {course.lecturerName}
                  </p>

                  <p>
                    <strong>Department:</strong> {course.department}
                  </p>

                  <p>
                    <strong>Level:</strong> {course.level}
                  </p>

                  <div className="flex items-center gap-2">

                    <Users size={16} />

                    {course.studentCount || 0} Students

                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(`/course/${course.courseCode}`)
                  }
                  className="mt-6 w-full rounded-xl bg-[#3D78DA] py-3 font-medium text-white hover:bg-blue-700"
                >
                  View Course
                </button>

              </div>

            ))}

          </section>

        )}

      </div>

      {showJoinModal && (
        <JoinCourseModal
          onClose={() => setShowJoinModal(false)}
          onJoined={() => setShowJoinModal(false)}
        />
      )}
    </>
  );
}