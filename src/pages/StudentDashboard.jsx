import {
  CalendarCheck,
  BookOpen,
  Trophy,
  MapPin,
  Target,
  Clock3,
} from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Student Dashboard
            </span>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              Track your attendance progress
            </h1>

            <p className="mt-3 max-w-xl text-slate-600 dark:text-gray-400">
              View your attendance records, join active attendance sessions,
              complete challenges, and monitor your performance.
            </p>

            <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Join Attendance Session
            </button>
          </div>


          <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-900/20">

            <MapPin className="text-blue-600 dark:text-blue-400" />

            <p className="mt-3 text-sm text-slate-500 dark:text-gray-400">
              Location Verification
            </p>

            <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
              GPS Ready
            </p>

          </div>

        </div>

      </section>



      {/* Stats */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">


        <div className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <BookOpen className="text-blue-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Courses Enrolled
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            6
          </h2>

        </div>



        <div className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <CalendarCheck className="text-emerald-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Attendance Rate
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            91%
          </h2>

        </div>



        <div className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <Trophy className="text-yellow-500" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Points Earned
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            850
          </h2>

        </div>



        <div className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <Target className="text-purple-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Challenges Completed
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            12
          </h2>

        </div>


      </section>



      {/* Current Attendance */}
      <section className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Active Attendance Session
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Available nearby attendance
            </p>
          </div>


          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            Active
          </span>

        </div>



        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Course
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              CSC401
            </p>

          </div>


          <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lecturer
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              Dr. Ajisafe
            </p>

          </div>


          <div className="rounded-xl bg-slate-50 p-4 dark:bg-gray-800">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Time Remaining
            </p>

            <p className="flex items-center gap-2 font-semibold text-orange-600">
              <Clock3 size={18}/>
              14 minutes
            </p>

          </div>

        </div>

      </section>



      {/* Recent Attendance */}
      <section className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Attendance
        </h2>


        <div className="mt-5 space-y-3">

          {[
            ["CSC401", "Present", "Today"],
            ["CSC402", "Present", "Yesterday"],
            ["CSC404", "Late", "Monday"],
          ].map((item) => (

            <div
              key={item[0]}
              className="flex justify-between rounded-xl bg-slate-50 p-4 dark:bg-gray-800"
            >

              <span className="text-gray-900 dark:text-white">
                {item[0]}
              </span>


              <span className="text-emerald-600">
                {item[1]}
              </span>


              <span className="text-gray-500 dark:text-gray-400">
                {item[2]}
              </span>

            </div>

          ))}

        </div>

      </section>


    </div>
  );
}