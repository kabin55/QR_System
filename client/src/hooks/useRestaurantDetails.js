import { useEffect, useState } from 'react'
import { updateRestaurantDetails } from '../service/adminapi.js'
import { validateRestaurantField } from '../utils/validators'

export function useRestaurantDetails() {
  const [restaurant, setRestaurant] = useState({
    restaurantId: '',
    restaurantName: '',
    address: '',
    description: '',
    image: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('restaurantDetails')
    if (stored) setRestaurant(JSON.parse(stored))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setRestaurant(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setErrors(prev => ({
      ...prev,
      [name]: validateRestaurantField(name, value),
    }))
  }

  const handleImageChange = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setRestaurant(prev => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const submit = async () => {
    setLoading(true)
    setSubmitError(null)

    try {
      await updateRestaurantDetails(restaurant.restaurantId, {
        restaurantName: restaurant.restaurantName,
        address: restaurant.address,
        description: restaurant.description,
        image: restaurant.image,
      })
    } catch {
      setSubmitError('Error while updating restaurant')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    const stored = localStorage.getItem('restaurantDetails')
    if (stored) setRestaurant(JSON.parse(stored))
    setErrors({})
    setSubmitError(null)
  }

  return {
    restaurant,
    errors,
    loading,
    submitError,
    handleChange,
    handleBlur,
    handleImageChange,
    submit,
    reset,
  }
}
