const BASE_API_URL = import.meta.env.VITE_BACKEND_URL

export const getAdminDashboardData = async (restaurantId) => {
  if (!restaurantId) {
    throw new Error('Restaurant ID is required')
  }

  const response = await fetch(
    `${BASE_API_URL}/admin/dashboard/${restaurantId}`,
    {
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data')
  }

  return response.json()
}


export const getItems = async (restaurantId) => {
  const res = await fetch(`${BASE_API_URL}/items/${restaurantId}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export const createItem = async (restaurantId, payload) => {
  const res = await fetch(`${BASE_API_URL}/admin/items/${restaurantId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to add item')
}

export const updateItem = async (restaurantId, itemId, payload) => {
  const res = await fetch(
    `${BASE_API_URL}/admin/items/${restaurantId}/${itemId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    }
  )
  if (!res.ok) throw new Error('Failed to update item')
}

export const deleteItem = async (restaurantId, itemId) => {
  const res = await fetch(
    `${BASE_API_URL}/admin/items/${restaurantId}/${itemId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )
  if (!res.ok) throw new Error('Failed to delete item')
}


export async function updateRestaurantDetails(id, payload) {
  const response = await fetch(`${BASE_API_URL}/admin/details/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to update restaurant')
  }

  return response.json()
}
