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

// Others
import LocationTest from "./pages/LocationTest";
import RoleRoute from "./components/RoleRoute";
import Profile from "./pages/Profile";



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <Router>

      <ScrollToTop />


      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/location-test" element={<LocationTest />} />


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

                      {/* Profile */}
                      <Route
                        path="profile"
                        element={<Profile />}
                      />
                      
                      {/* Lecturer Dashboard */}
                      <Route
                      path="lecturer-dashboard"
                      element={
                        <RoleRoute allowedRoles={["lecturer"]}>
                          <LecturerDashboard />
                        </RoleRoute>
                      }
                    />


                      {/* Student Dashboard */}
                      <Route
                      path="student-dashboard"
                      element={
                        <RoleRoute allowedRoles={["student"]}>
                          <StudentDashboard />
                        </RoleRoute>
                      }
                    />


                      {/* Lecturer Routes */}
                      <Route
                        path="courses"
                        element={
                          <RoleRoute allowedRoles={["lecturer"]}>
                            <Courses />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="students"
                        element={
                          <RoleRoute allowedRoles={["lecturer"]}>
                            <Students />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="attendance"
                        element={
                          <RoleRoute allowedRoles={["lecturer"]}>
                            <Attendance />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="attendance/:sessionId"
                        element={
                          <RoleRoute allowedRoles={["lecturer"]}>
                            <AttendanceSession />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="reports"
                        element={
                          <RoleRoute allowedRoles={["lecturer"]}>
                            <Reports />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="challenges"
                        element={
                          <RoleRoute allowedRoles={["lecturer"]}>
                            <Challenges />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="leaderboard"
                        element={
                          <RoleRoute allowedRoles={["lecturer"]}>
                            <Leaderboard />
                          </RoleRoute>
                        }
                      />


                    
                      {/* Student Routes */}
                      <Route
                        path="my-courses"
                        element={
                          <RoleRoute allowedRoles={["student"]}>
                            <MyCourses />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="course/:courseCode"
                        element={
                          <RoleRoute allowedRoles={["student"]}>
                            <StudentCourseDetails />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="my-attendance"
                        element={
                          <RoleRoute allowedRoles={["student"]}>
                            <MyAttendance />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="active-attendance"
                        element={
                          <RoleRoute allowedRoles={["student"]}>
                            <ActiveAttendance />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="my-challenges"
                        element={
                          <RoleRoute allowedRoles={["student"]}>
                            <MyChallenges />
                          </RoleRoute>
                        }
                      />

                      <Route
                        path="my-leaderboard"
                        element={
                          <RoleRoute allowedRoles={["student"]}>
                            <MyLeaderboard />
                          </RoleRoute>
                        }
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