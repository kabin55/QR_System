import { useState } from 'react'
import { useToast } from '../../utils/toastProvider'
import { Store, MapPin, FileText, Image as ImageIcon, Send, RotateCcw } from 'lucide-react'
import { submitRestaurantDetails } from '../../service/adminapi' 

export default function SuperAdmin() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    restaurantID: '',
    restaurantName: '',
    address: '',
    description: '',
    image: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setFormData({
      restaurantID: '',
      restaurantName: '',
      address: '',
      description: '',
      image: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitRestaurantDetails(formData, showToast)
      handleReset() // optional: reset form after successful submission
    } catch (error) {
      console.error('Submit error:', error)
      // showToast already called inside submitRestaurantDetails
    } finally {
      setIsSubmitting(false)
    }
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600" />
            Add new Restaurant
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Restaurant ID */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Store className="h-4 w-4 text-indigo-600" />
                Restaurant ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="restaurantID"
                value={formData.restaurantID}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter Restaurant Unique ID"
                required
              />
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Store className="h-4 w-4 text-indigo-600" />
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter Restaurant name"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 text-indigo-600" />
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter location"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FileText className="h-4 w-4 text-indigo-600" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter description"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <ImageIcon className="h-4 w-4 text-indigo-600" />
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () =>
                      setFormData((prev) => ({ ...prev, image: reader.result }))
                    reader.readAsDataURL(file)
                  }
                }}
                className="w-full p-2 border rounded-lg cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
            </div>

            {/* Submit / Reset Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up md:animate-delay-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            Preview
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Restaurant ID</h3>
              <p className="text-lg font-semibold text-gray-800">
                {formData.restaurantID || 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Restaurant Name</h3>
              <p className="text-lg font-semibold text-gray-800">
                {formData.restaurantName || 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Address</h3>
              <p className="text-lg font-semibold text-gray-800">
                {formData.address || 'Not provided'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Description</h3>
              <p className="text-lg font-semibold text-gray-800">
                {formData.description || 'Not provided'}
              </p>
            </div>
            {formData.image ? (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="mt-2 w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
