import { useState } from 'react'
import { useDashboardData } from '../../service/adminapi'
import Navbar from '../../components/AdminComponent/NavBar'
import StatCard from '../../components/AdminComponent/StatCard'
import ChartCard from '../../components/AdminComponent/ChartCard'
import SoldItemsTable from '../../components/AdminComponent/SoldItemsTable'
import TimeRangeSelector from '../../components/AdminComponent/TimeRangeSelector'
import TopProductsCard from '../../components/AdminComponent/TopProductsCard'


import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('weekly')

  const {
    loading,
    dashboardData,
    earningsData,
    topProductsData,
  } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-cyan-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
  <div className="bg-gray-50 min-h-screen">
    <Navbar />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`Rs. ${dashboardData.totalRevenue}`}
          icon="💰"
          color="bg-green-100"
        />
        <StatCard
          title="This Month Revenue"
          value={`Rs. ${dashboardData.currentMonthRevenue}`}
          icon="📅"
          color="bg-cyan-100"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon="📋"
          color="bg-blue-100"
        />
        <StatCard
          title="Items Sold (Month / Total)"
          value={`${dashboardData.currentMonthOrdersCount} / ${dashboardData.totalItems}`}
          icon="📦"
          color="bg-indigo-100"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <ChartCard title="Earnings Overview">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData.daily}>
                <defs>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#06B6D4"
                  fill="url(#colorDaily)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Weekly & Monthly Earnings"
          controls={
            <TimeRangeSelector
              selected={timeRange}
              onChange={setTimeRange}
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
              ]}
            />
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData[timeRange]}>
                <defs>
                  <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#06B6D4"
                  fill="url(#colorRange)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ================= TABLES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <ChartCard
          title="Top Selling Products"
          controls={
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>📈</span>
              <span>Last 30 days</span>
            </div>
          }
        >
          <TopProductsCard products={topProductsData} />
        </ChartCard>

        <ChartCard title="Today's Sold Items">
          <div className="overflow-x-auto">
            <SoldItemsTable items={dashboardData.todaySoldItems} />
          </div>
        </ChartCard>

      </div>
    </div>
  </div>
)

}
