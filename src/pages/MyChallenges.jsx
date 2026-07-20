import {
  Target,
  Trophy,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const challenges = [
  {
    title: "Software Engineering Quiz",
    course: "CSC401",
    points: 100,
    status: "Completed",
    score: "85%",
  },
  {
    title: "Database Concepts Challenge",
    course: "CSC402",
    points: 80,
    status: "Available",
    score: null,
  },
  {
    title: "Network Security Challenge",
    course: "CSC404",
    points: 120,
    status: "Completed",
    score: "92%",
  },
  {
    title: "AI Fundamentals Quiz",
    course: "CSC406",
    points: 100,
    status: "Available",
    score: null,
  },
];


export default function Challenges() {
  return (
    <div className="space-y-8 p-6">


      {/* Header */}
      <section>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Challenges
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Complete quiz challenges, earn points, and improve your leaderboard ranking.
        </p>

      </section>



      {/* Challenge Summary */}
      <section className="grid gap-6 md:grid-cols-3">


        <div className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <Target className="text-blue-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Challenges Completed
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            12
          </h2>

        </div>



        <div className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <Trophy className="text-yellow-500" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Total Points
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            850
          </h2>

        </div>



        <div className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <CheckCircle2 className="text-emerald-600" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Current Rank
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            #8
          </h2>

        </div>


      </section>




      {/* Challenge List */}
      <section className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">


        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Available Challenges
        </h2>


        <div className="mt-6 grid gap-5 md:grid-cols-2">


          {challenges.map((challenge) => (

            <div
              key={challenge.title}
              className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800"
            >

              <div className="flex items-start justify-between">


                <div>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {challenge.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {challenge.course}
                  </p>

                </div>


                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  +{challenge.points} pts
                </span>


              </div>



              <div className="mt-5 flex items-center justify-between">


                {challenge.status === "Completed" ? (

                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 size={16}/>
                    Completed ({challenge.score})
                  </div>

                ) : (

                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Clock3 size={16}/>
                    Available
                  </div>

                )}



                <button
                  className={`rounded-xl px-4 py-2 text-sm font-medium text-white ${
                    challenge.status === "Completed"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {challenge.status === "Completed"
                    ? "Completed"
                    : "Start Challenge"}
                </button>


              </div>


            </div>

          ))}


        </div>


      </section>


    </div>
  );
}