import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Dashboards
import LecturerDashboard from "./pages/LecturerDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Lecturer Pages
import Courses from "./pages/Courses";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import AttendanceSession from "./pages/AttendanceSession";
import Reports from "./pages/Reports";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";

// Student Pages
import MyCourses from "./pages/MyCourses";
import StudentCourseDetails from "./pages/StudentCourseDetails";
import MyAttendance from "./pages/MyAttendance";
import ActiveAttendance from "./pages/ActiveAttendance";
import MyChallenges from "./pages/MyChallenges";
import MyLeaderboard from "./pages/MyLeaderboard";

// Error Page
import NotFound from "./pages/NotFound";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <Router>

      <ScrollToTop />


      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />


        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>

              <div className="flex min-h-screen dark:bg-[#1E293B] dark:text-white">

                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />


                <div className="flex-1 flex flex-col">


                  <Topbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />


                  <main className="flex-1 p-6 md:ml-[16rem] bg-[#f1f3f4] dark:bg-gray-700">


                    <Routes>


                      {/* Lecturer Dashboard */}
                      <Route
                        path="lecturer-dashboard"
                        element={<LecturerDashboard />}
                      />


                      {/* Student Dashboard */}
                      <Route
                        path="student-dashboard"
                        element={<StudentDashboard />}
                      />


                      {/* Lecturer Routes */}
                      <Route
                        path="courses"
                        element={<Courses />}
                      />

                      <Route
                        path="students"
                        element={<Students />}
                      />

                      <Route
                        path="attendance"
                        element={<Attendance />}
                      />

                      <Route
                        path="attendance/:sessionId"
                        element={<AttendanceSession />}
                      />

                      <Route
                        path="reports"
                        element={<Reports />}
                      />

                      <Route
                        path="challenges"
                        element={<Challenges />}
                      />

                      <Route
                        path="leaderboard"
                        element={<Leaderboard />}
                      />


                      {/* Student Routes */}
                      <Route
                        path="my-courses"
                        element={<MyCourses />}
                      />

                      <Route
                        path="course/:courseCode"
                        element={<StudentCourseDetails />}
                      />

                      <Route
                        path="my-attendance"
                        element={<MyAttendance />}
                      />

                      <Route
                        path="active-attendance"
                        element={<ActiveAttendance />}
                      />

                      <Route
                        path="my-challenges"
                        element={<MyChallenges />}
                      />

                      <Route
                        path="my-leaderboard"
                        element={<MyLeaderboard />}
                      />


                      {/* Unknown Route */}
                      <Route
                        path="*"
                        element={<NotFound />}
                      />


                    </Routes>


                  </main>


                  <Footer />


                </div>


              </div>

            </PrivateRoute>
          }
        />

      </Routes>


    </Router>
  );
}


export default App;