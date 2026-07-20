import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Users,
  BarChart4,
  Trophy,
  Target,
  X,
  MapPin,
} from "lucide-react";

import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { profile } = useAuth();

  const baseClass =
    "block px-4 py-2 rounded-[8px] hover:bg-[#b9cff2] hover:text-[#303D54] transition-colors";

  const activeClass = "bg-[#3D78DA] text-white";


  const lecturerMenu = [
    {
      name: "Dashboard",
      path: "/lecturer-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: ClipboardCheck,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart4,
    },
    {
      name: "Challenges",
      path: "/challenges",
      icon: Target,
    },
    {
      name: "Leaderboard",
      path: "/leaderboard",
      icon: Trophy,
    },
  ];


  const studentMenu = [
    {
      name: "Dashboard",
      path: "/student-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      path: "/my-courses",
      icon: BookOpen,
    },
    {
      name: "My Attendance",
      path: "/my-attendance",
      icon: ClipboardCheck,
    },
    {
      name: "Active Attendance",
      icon: MapPin,
      path: "/active-attendance",
    },
    {
      name: "My Challenges",
      path: "/my-challenges",
      icon: Target,
    },
    {
      name: "My Leaderboard",
      path: "/my-leaderboard",
      icon: Trophy,
    },
  ];


  const menuItems =
    profile?.role === "student" ? studentMenu : lecturerMenu;


  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}


      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 border-r border-gray-700 flex flex-col justify-between transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >

        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-2">

          <div className="text-[1.5rem] font-bold text-white leading-tight">
            Smart Attendance
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>

        </div>


        {/* Navigation */}
        <nav className="flex-1 mt-10 text-white">

          <ul className="space-y-2 w-[85%] mx-auto">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `${baseClass} ${isActive ? activeClass : ""}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.name}
                    </div>
                  </NavLink>
                </li>
              );
            })}

          </ul>

        </nav>


        {/* Bottom */}
        <div className="flex flex-col items-center justify-center gap-3 text-gray-400 text-sm pb-6">

          <DarkModeToggle />

          <div className="text-xs tracking-wide text-gray-500">
            v 1.0.0
          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;