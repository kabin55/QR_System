const API_URL = import.meta.env.VITE_BACKEND_URL

export const validateRestaurant = async (restaurantId) => {
  const response = await fetch(`${API_URL}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ restaurantId }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

export const fetchMenuByRestaurant = async (restaurantId) => {
  const response = await fetch(`${API_URL}/items/${restaurantId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch menu')
  }

  return response.json()
}

export const placeOrder = async (restaurantId, orderPayload) => {
  const response = await fetch(`${API_URL}/order/${restaurantId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to place order')
  }

  return data
}

export const callWaiter = async (restaurantId, tableId) => {
  const payload = {
    tableno: tableId,
    items: [
      {
        item: `requested to visit table nbr${tableId}`,
        price: 0,
        quantity: 1,
      },
    ],
    subtotal: 0,
  };
console.log('data for call waiter', payload);
  
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/order/${restaurantId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to request waiter');

    return data;
 
};


