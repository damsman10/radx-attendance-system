import StatsCards from "../components/dashboard/StatsCards";
import ActiveSessionCard from "../components/dashboard/ActiveSessionCard";
import RecentActivityTable from "../components/dashboard/RecentActivityTable";
import AttendanceChart from "../components/dashboard/AttendanceChart";

export default function LecturerDashboard() {
  return (
    <div className="space-y-8 p-6">
      <StatsCards />
      <ActiveSessionCard />
      <RecentActivityTable />
      <AttendanceChart />
    </div>
  );
}