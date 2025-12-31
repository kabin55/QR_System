import { useState } from 'react'
import { useDashboardData } from '../../hooks/useDashboardData'
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

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Revenue" value={`Rs. ${dashboardData.totalRevenue}`} icon="💰" />
          <StatCard title="This Month Revenue" value={`Rs. ${dashboardData.currentMonthRevenue}`} />
          <StatCard title="Total Orders" value={dashboardData.totalOrders} icon="📋" />
          <StatCard
            title="Items Sold (Month / Total)"
            value={`${dashboardData.currentMonthOrdersCount} / ${dashboardData.totalItems}`}
            icon="📦"
          />
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

          <ChartCard title="Earnings Overview">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={earningsData.daily}>
                <defs>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#06B6D4"
                  fill="url(#colorDaily)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={earningsData[timeRange]}>
                <defs>
                  <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#06B6D4"
                  fill="url(#colorRange)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ================= TABLES ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

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
            <SoldItemsTable items={dashboardData.todaySoldItems} />
          </ChartCard>

        </div>
      </div>
    </div>
  )
}
