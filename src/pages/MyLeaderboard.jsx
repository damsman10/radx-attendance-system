import {
  Trophy,
  Medal,
  Crown,
} from "lucide-react";


const rankings = [
  {
    rank: 1,
    name: "Sarah Johnson",
    points: 1250,
    badges: 15,
  },
  {
    rank: 2,
    name: "Michael Ade",
    points: 1120,
    badges: 12,
  },
  {
    rank: 3,
    name: "David James",
    points: 980,
    badges: 10,
  },
  {
    rank: 4,
    name: "You",
    points: 850,
    badges: 8,
  },
  {
    rank: 5,
    name: "Jane Smith",
    points: 790,
    badges: 7,
  },
];


export default function MyLeaderboard() {
  return (
    <div className="space-y-8 p-6">


      <section>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Leaderboard
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View your ranking and compare your performance with other students.
        </p>

      </section>



      <section className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">


        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-yellow-100 p-4 dark:bg-yellow-900/30">

            <Crown
              className="text-yellow-600"
              size={30}
            />

          </div>


          <div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your Current Rank
            </p>

            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              #4
            </h2>

          </div>

        </div>


      </section>




      <section className="rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">


        <div className="flex items-center gap-3">

          <Trophy className="text-yellow-500"/>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Rankings
          </h2>

        </div>



        <div className="mt-6 space-y-4">


          {rankings.map((student) => (

            <div
              key={student.rank}
              className={`flex items-center justify-between rounded-2xl p-4 ${
                student.name === "You"
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
            >


              <div className="flex items-center gap-4">


                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold dark:bg-gray-700 dark:text-white">

                  {student.rank <= 3 ? (
                    <Medal size={20}/>
                  ) : (
                    student.rank
                  )}

                </div>


                <div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {student.name}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {student.badges} badges
                  </p>

                </div>


              </div>



              <div className="font-bold text-blue-600">
                {student.points} pts
              </div>


            </div>

          ))}


        </div>


      </section>


    </div>
  );
}