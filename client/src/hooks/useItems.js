import { useEffect, useState } from 'react'
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from '../service/adminapi.js'

export const useItems = (restaurantId) => {
  const [toast, setToast] = useState({message: '',type: ''})
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchItems = async () => {
    if (!restaurantId) return
    setLoading(true)
    try {
      const data = await getItems(restaurantId)
      setItems(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveItem = async (payload, editingId) => {
    if (editingId) {
      await updateItem(restaurantId, editingId, payload)
    } else {
      await createItem(restaurantId, payload)
    }
    fetchItems()
  }

  const removeItem = async (itemId) => {
    await deleteItem(restaurantId, itemId)
    fetchItems()
  }

  useEffect(() => {
    fetchItems()
  }, [restaurantId])

  return {
    items,
    loading,
    error,
    saveItem,
    removeItem,
  }
}
