import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import StatisticsCards from "../components/StatisticsCards";
import ActivityChart from "../components/ActivityChart/ActivityChart";    
import TopCourses from "../components/TopCourses";
import Transactions from "../components/Transactions";
import Distribution from "../components/Distribution";
import CalendarWidget from "../components/CalendarWidget";

export default function Index() {
  return (
    <div className="bg-gray-50 overflow-auto">
        <Header />
        
        <div className="max-full space-y-6 flex mt-20 px-4 py-4 relative">
            <Sidebar className="absolute top-0 left-0 w-full"/>
            <div className="flex-1 space-y-6 ml-10">
                {/* Statistics Cards */}
                <StatisticsCards />
                
                {/* Charts and Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Chart */}
                    <ActivityChart />
                    
                    {/* Top Courses */}
                    <TopCourses />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transactions */}
                <div className="lg:col-span-1">
                <Transactions />
                </div>
                
                {/* Distribution */}
                <div className="lg:col-span-1">
                <Distribution />
                </div>
                
                {/* Calendar */}
                <div className="lg:col-span-1">
                <CalendarWidget />
                </div>
                </div>
            </div>
        </div>
    </div>
  );
}

