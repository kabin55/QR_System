import {
  Store,
  MapPin,
  FileText,
  Image as ImageIcon,
  Send,
  RotateCcw,
} from 'lucide-react'
import { useRestaurantDetails } from '../../hooks/useRestaurantDetails.js'
import Navbar from '../../components/AdminComponent/NavBar.jsx'

export default function DetailForm() {
  const {
    restaurant,
    errors,
    loading,
    submitError,
    handleChange,
    handleBlur,
    handleImageChange,
    submit,
    reset,
  } = useRestaurantDetails()

  const handleSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Store className="text-indigo-600" /> Update Restaurant
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="restaurantId"
              value={restaurant.restaurantId}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 rounded-lg"
            />

            <input
              name="restaurantName"
              value={restaurant.restaurantName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Restaurant Name"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.restaurantName ? 'border-red-500' : ''
              }`}
            />

            <input
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Address"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.address ? 'border-red-500' : ''
              }`}
            />

            <textarea
              name="description"
              value={restaurant.description}
              onChange={handleChange}
              rows={4}
              placeholder="Description"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
               className="w-full p-2 border rounded-lg cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />

            {submitError && (
              <p className="text-red-600 text-sm">{submitError}</p>
            )}

            <div className="flex gap-3">
              <button
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>

              <button
                type="button"
                onClick={reset}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          <p><strong>ID:</strong> {restaurant.restaurantId}</p>
          <p><strong>Name:</strong> {restaurant.restaurantName}</p>
          <p><strong>Address:</strong> {restaurant.address}</p>
          <p><strong>Description:</strong> {restaurant.description}</p>

          {restaurant.image && (
            <img
              src={restaurant.image}
              alt="preview"
              className="w-full h-40 object-cover rounded mt-4"
            />
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
