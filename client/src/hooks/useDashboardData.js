import { useEffect, useState, useCallback } from 'react'

const API_URL = import.meta.env.VITE_BACKEND_URL

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({})
  const [earningsData, setEarningsData] = useState({})
  const [topProductsData, setTopProductsData] = useState([])

  const fetchData = useCallback(async () => {
    try {
      const restaurantId = JSON.parse(
        localStorage.getItem('restaurantDetails')
      )?.restaurantId

      if (!restaurantId) return

      const res = await fetch(`${API_URL}/admin/dashboard/${restaurantId}`, {
        credentials: 'include',
      })
      const data = await res.json()

      setDashboardData(data)
      setEarningsData({
        daily: data.daily,
        weekly: data.weekly,
        monthly: data.monthly,
      })
      setTopProductsData(data.topProducts || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { loading, dashboardData, earningsData, topProductsData }
}
