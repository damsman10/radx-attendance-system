import {
  Trophy,
  Medal,
  Gift,
  BadgeCheck,
} from "lucide-react";

const stats = [
  {
    title: "Quiz Challenges",
    value: 18,
    icon: Trophy,
    color: "text-amber-600",
  },
  {
    title: "Badges Awarded",
    value: 64,
    icon: Medal,
    color: "text-blue-600",
  },
  {
    title: "Reward Points",
    value: 1840,
    icon: Gift,
    color: "text-emerald-600",
  },
  {
    title: "Excused Students",
    value: 7,
    icon: BadgeCheck,
    color: "text-violet-600",
  },
];

export default function GamificationOverview() {
  return (
    <section>
      <h2 className="mb-5 text-xl font-semibold">
        Gamification Overview
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <Icon className={item.color} />

              <h3 className="mt-5 text-3xl font-bold">
                {item.value}
              </h3>

              <p className="mt-2 text-slate-500">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}