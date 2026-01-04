import { useEffect, useState } from 'react'
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from '../service/adminapi.js'
  import { useToast } from  '../utils/toastProvider.jsx'


export const useItems = (restaurantId) => {
  const [toast, setToast] = useState({message: '',type: ''})
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { showToast } = useToast()


  const fetchItems = async () => {
    if (!restaurantId) return
    setLoading(true)
    try {
      const data = await getItems(restaurantId,showToast)
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
      await updateItem(restaurantId, editingId, payload,showToast)
    } else {
      await createItem(restaurantId, payload,showToast)
    }
    fetchItems()
  }

  const removeItem = async (itemId) => {
    await deleteItem(restaurantId, itemId,showToast)
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
