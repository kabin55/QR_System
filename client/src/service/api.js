const API_URL = import.meta.env.VITE_BACKEND_URL

// ----------------- VALIDATE RESTAURANT -----------------
export const validateRestaurant = async (restaurantId, showToast) => {
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ restaurantId }),
    })

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Restaurant validation failed', 'error')
      throw new Error(data.message || 'Validation failed')
    }

    showToast('Restaurant validated successfully', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- FETCH MENU -----------------
export const fetchMenuByRestaurant = async (restaurantId, showToast) => {
  try {
    const response = await fetch(`${API_URL}/items/${restaurantId}`)
    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to fetch menu', 'error')
      throw new Error(data.message || 'Failed to fetch menu')
    }

    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- PLACE ORDER -----------------
export const placeOrder = async (restaurantId, orderPayload, showToast) => {
  try {
    const response = await fetch(`${API_URL}/order/${restaurantId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to place order', 'error')
      throw new Error(data.message || 'Order failed')
    }

    showToast('Order placed successfully', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}

// ----------------- CALL WAITER -----------------
export const callWaiter = async (restaurantId, tableId, showToast) => {
  const payload = {
    tableno: tableId,
    items: [
      {
        item: `requested to visit table nbr ${tableId}`,
        price: 0,
        quantity: 1,
      },
    ],
    subtotal: 0,
  }

  try {
    const response = await fetch(`${API_URL}/order/${restaurantId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      showToast(data.message || 'Failed to request waiter', 'error')
      throw new Error(data.message || 'Call waiter failed')
    }

    showToast('Waiter has been notified', 'success')
    return data
  } catch (error) {
    showToast(error.message || 'Network error', 'error')
    throw error
  }
}
