import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const Students = () => {
  const [students, setStudents] = useState([]);


  useEffect(() => {

  const q = query(
    collection(db, "users"),
    where("role", "==", "student")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {

      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(studentList);

    },
    (error) => {

      console.error("Error fetching students:", error);

    }
    );

    return () => unsubscribe();

  }, []);

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Students
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Create and manage student accounts, enrollment and access.
          </p>
        </div>

        <div />

      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Total Students</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {students.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Active Accounts</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {students.filter(student => (student.status || "Active") === "Active").length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Inactive Accounts</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {students.filter(student => student.status === "Inactive").length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow dark:bg-gray-900">
          <p className="text-gray-500">Assigned Courses</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {students.reduce(
              (total, student) => total + (student.courses?.length || 0),
              0
            )}
          </h2>
        </div>

      </div>

            {/* Student Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow dark:bg-gray-900">

        <table className="w-full text-left">

          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Matric Number</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Courses</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {students.length > 0 ? (

              students.map((student) => (

                <tr
                  key={student.id}
                  className="border-b last:border-none dark:border-gray-700"
                >

                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                    {student.fullName}
                  </td>

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {student.matricNumber}
                  </td>

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {student.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {student.courses?.length || 0}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        (student.status || "Active") === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {student.status || "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">

                      <button className="text-blue-600 hover:underline">
                        View
                      </button>

                      <button className="text-gray-600 hover:underline">
                        Edit
                      </button>

                    </div>
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No students found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      

    </div>
  );
};

export default Students;