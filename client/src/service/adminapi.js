import { useEffect, useState, useCallback } from 'react'
import { useToast } from  '../utils/toastProvider'

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL

//login
export async function login({ restaurantId, username, password, rememberMe, showToast }) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantId, username, password, rememberMe }),
      credentials: 'include', // send cookies if needed
    });

    const data = await response.json();

    // Handle failed login
    if (!response.ok) {
      showToast(data.message || 'Login failed', 'error');
      throw new Error(data.message || 'Login failed');
    }

    // Successful login
    showToast('Login successful', 'success');
    return data;

  } catch (error) {
    // Handle network errors
    showToast(error.message || 'Network error', 'error');
    throw error;
  }
}
//function to change password
export const changeCredentials = async ({
  backendUrl,
  restaurantId,
  username,
  oldPassword,
  newPassword,
  showToast
}) => {
  try {
    const response = await fetch(
      `${backendUrl}/admin/changePassword/${restaurantId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          oldPassword,
          password: newPassword,
        }),
        credentials: 'include',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to update restaurant', 'error')
      throw new Error(data.message || 'Failed to update restaurant')
    }

    showToast(data.message || 'Credentials updated successfully', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Failed to update restaurant', 'error')
    throw error
  }
}




//super user

export const submitRestaurantDetails = async (formData, showToast) => {
  try {
    const response = await fetch(`${BASE_API_URL}/details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to update restaurant', 'error')
      throw new Error(data.message || 'Update failed')
    }

    showToast('Restaurant updated successfully!', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}


// for orderpage
export const fetchOrders = async (restaurantId, showToast) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/admin/orders/${restaurantId}`,
      { credentials: 'include' }
    )

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to fetch orders', 'error')
      throw new Error(data.message || 'Orders fetch failed')
    }

    return Array.isArray(data.orders) ? data.orders : data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

export const updateOrderStatusApi = async (
  orderId,
  status,
  showToast
) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/admin/orders/${orderId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to update order', 'error')
      throw new Error(data.message || 'Order update failed')
    }

    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

//for login
export const loginUser = async (
  { restaurantId, username, password, rememberMe },
  showToast
) => {
  try {
    const response = await fetch(`${BASE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        restaurantId,
        username,
        password,
        rememberMe,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Login failed', 'error')
      throw new Error(data.message || 'Login failed')
    }

    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- GET ADMIN DASHBOARD DATA -----------------
export const useDashboardData = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({})
  const [earningsData, setEarningsData] = useState({})
  const [topProductsData, setTopProductsData] = useState([])
    const { showToast } = useToast()


  const fetchData = useCallback(async () => {
    try {
      const restaurantId = JSON.parse(
        localStorage.getItem('restaurantDetails')
      )?.restaurantId

      if (!restaurantId) {
        showToast('Restaurant not found. Please login again.', 'error')
        return
      }

      const res = await fetch(`${BASE_API_URL}/admin/dashboard/${restaurantId}`, {
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Failed to load dashboard data')
      }

      const data = await res.json()

      setDashboardData(data)
      setEarningsData({
        daily: data.daily,
        weekly: data.weekly,
        monthly: data.monthly,
      })
      setTopProductsData(data.topProducts || [])

      // ✅ Optional success toast
      showToast('Dashboard loaded successfully', 'success')

    } catch (err) {
      console.error(err)
      showToast(err.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { loading, dashboardData, earningsData, topProductsData }
}
// ----------------- GET ITEMS -----------------
export const getItems = async (restaurantId, showToast) => {
  try {
    const response = await fetch(`${BASE_API_URL}/items/${restaurantId}`, {
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to fetch items', 'error')
      throw new Error(data.message || 'Items fetch failed')
    }

    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- CREATE ITEM -----------------
export const createItem = async (restaurantId, payload, showToast) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/admin/items/${restaurantId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to add item', 'error')
      throw new Error(data.message || 'Create item failed')
    }

    showToast('Item added successfully', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- UPDATE ITEM -----------------
export const updateItem = async (restaurantId, itemId, payload, showToast) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/admin/items/${restaurantId}/${itemId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to update item', 'error')
      throw new Error(data.message || 'Update item failed')
    }

    showToast('Item updated successfully', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- DELETE ITEM -----------------
export const deleteItem = async (restaurantId, itemId, showToast) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/admin/items/${restaurantId}/${itemId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to delete item', 'error')
      throw new Error(data.message || 'Delete item failed')
    }

    showToast('Item deleted successfully', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- UPDATE RESTAURANT DETAILS -----------------
export const updateRestaurantDetails = async (id, payload, showToast) => {
  try {
    const response = await fetch(`${BASE_API_URL}/admin/details/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to update restaurant', 'error')
      throw new Error(data.message || 'Update restaurant failed')
    }

    showToast('Restaurant updated successfully', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}
