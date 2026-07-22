import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function CreateAttendanceModal({
  onClose,
  onSessionCreated,
}) {
  const { user, profile } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const [formData, setFormData] = useState({
    courseId: "",
    courseCode: "",
    courseTitle: "",
    department: "",
    level: "",
    semester: "",
    session: "",

    studentIds: [],
    studentCount: 0,

    venue: "",
    radius: "75",

    verificationMode: "GPS",

    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "courses"),
        where("lecturerId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(data);
    } catch (error) {
      console.log(error);
      setError("Unable to load courses.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseCode") {
      const selected = courses.find(
        (course) => course.courseCode === value
      );

      setFormData((prev) => ({
        ...prev,

        courseId: selected?.id || "",
        courseCode: selected?.courseCode || "",
        courseTitle: selected?.courseTitle || "",
        department: selected?.department || "",
        level: selected?.level || "",
        semester: selected?.semester || "",
        session: selected?.session || "",

        studentIds: selected?.studentIds || [],
        studentCount: selected?.studentCount || 0,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateAttendanceCode = () => {
    return Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setGeneratedCode("");

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError("End time must be later than start time.");
      return;
    }

    setLoading(true);

    try {
      const activeQuery = query(
        collection(db, "attendanceSessions"),
        where("lecturerId", "==", user.uid),
        where("courseCode", "==", formData.courseCode),
        where("status", "==", "Active")
      );

      const activeSnapshot = await getDocs(activeQuery);

      if (!activeSnapshot.empty) {
        setError(
          "An active attendance session already exists for this course."
        );
        setLoading(false);
        return;
      }

      if (formData.verificationMode === "CODE") {
        try {
          const attendanceCode = generateAttendanceCode();

          setGeneratedCode(attendanceCode);

          await addDoc(collection(db, "attendanceSessions"), {
            ...formData,

            lecturerId: user.uid,
            lecturerName: profile.fullName,

            latitude: null,
            longitude: null,
            radius: null,

            verificationMode: formData.verificationMode,

            attendanceCode,
            attendanceCodeCreatedAt: Timestamp.now(),

            attendanceCodeExpiresAt: Timestamp.fromDate(
              new Date(formData.endTime)
            ),

            codeUsageCount: 0,
            codeEnabled: true,

            startTime: Timestamp.fromDate(
              new Date(formData.startTime)
            ),

            endTime: Timestamp.fromDate(
              new Date(formData.endTime)
            ),

            presentCount: 0,
            presentStudents: [],

            status: "Active",

            createdAt: Timestamp.now(),
          });

          setSuccess(
            `Attendance session created.

Attendance Code:
${attendanceCode}`
          );

          onSessionCreated();

        } catch (err) {
          console.log(err);
          setError("Unable to create attendance session.");
        } finally {
          setLoading(false);
        }

        return;
      }

      if (!navigator.geolocation) {
        setError("Your browser does not support location services.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const attendanceCode =
              formData.verificationMode === "GPS"
                ? null
                : generateAttendanceCode();

            setGeneratedCode(attendanceCode || "");

            await addDoc(collection(db, "attendanceSessions"), {
              ...formData,

              lecturerId: user.uid,
              lecturerName: profile.fullName,

              latitude: position.coords.latitude,
              longitude: position.coords.longitude,

              radius: Number(formData.radius),

              verificationMode: formData.verificationMode,

              attendanceCode,

              attendanceCodeCreatedAt: Timestamp.now(),

              attendanceCodeExpiresAt: Timestamp.fromDate(
                new Date(formData.endTime)
              ),

              codeUsageCount: 0,

              codeEnabled:
                formData.verificationMode !== "GPS",

              startTime: Timestamp.fromDate(
                new Date(formData.startTime)
              ),

              endTime: Timestamp.fromDate(
                new Date(formData.endTime)
              ),

              presentCount: 0,
              presentStudents: [],

              status: "Active",

              createdAt: Timestamp.now(),
            });

            if (formData.verificationMode === "GPS") {
              setSuccess(
                "Attendance session created successfully."
              );
            } else {
              setSuccess(
                `Attendance session created.

Attendance Code:
${attendanceCode}

GPS is the default attendance method. An attendance code has also been generated as a backup option for students who cannot complete GPS verification.`
              );
            }

            onSessionCreated();

          } catch (err) {
            console.log(err);
            setError("Unable to create attendance session.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.log(error);
          setError("Please allow location access to start attendance.");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } catch (error) {
      console.log(error);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-900">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Start Attendance Session
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course
            </label>

            <select
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.courseCode}
                >
                  {course.courseCode} — {course.courseTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Venue
            </label>

            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              placeholder="ICT Hall"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Attendance Radius
            </label>

            <select
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="30">30 metres</option>
              <option value="50">50 metres</option>
              <option value="75">75 metres</option>
              <option value="100">100 metres</option>
              <option value="150">150 metres</option>
              <option value="7500">7000 metres</option>
              <option value="12000">12000 metres</option>
              <option value="25000">25000 metres</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification Method
            </label>

            <select
              name="verificationMode"
              value={formData.verificationMode}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="GPS">
                GPS Only
              </option>

              <option value="CODE">
                Attendance Code Only
              </option>

              <option value="BOTH">
                GPS + Backup Attendance Code (Recommended)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Time
              </label>

              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Time
              </label>

              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#3D78DA] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300">

            {formData.verificationMode === "GPS" &&
              "Students must be within the selected GPS radius to mark attendance."}

            {formData.verificationMode === "CODE" &&
              "Students will enter a one-time attendance code provided by the lecturer."}

            {formData.verificationMode === "BOTH" &&
              "Students should normally mark attendance using GPS. If GPS verification fails due to network or device issues, they may use the attendance code provided by the lecturer as an alternative."}

          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="whitespace-pre-line rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              {success}
            </div>
          )}

          {generatedCode && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">

              <p className="font-semibold text-green-800 dark:text-green-300">
                Attendance Code
              </p>

              <p className="mt-2 text-3xl font-bold tracking-widest text-green-700 dark:text-green-200">
                {generatedCode}
              </p>

              <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                Use this code only when students are unable to complete GPS attendance. This code remains valid until the session ends.
              </p>

            </div>
          )}

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
              {loading ? "Creating Session..." : "Start Session"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
