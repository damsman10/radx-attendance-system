const insights = [
  ["Students Checked In Today", "173"],
  ["Late Arrivals", "8"],
  ["Outside Geofence", "5"],
  ["Excused", "3"],
];

export default function AttendanceInsights() {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Attendance Insights
      </h2>

      <div className="space-y-5">
        {insights.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b pb-4 last:border-none"
          >
            <span className="text-slate-500">
              {label}
            </span>

            <span className="text-xl font-bold">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}