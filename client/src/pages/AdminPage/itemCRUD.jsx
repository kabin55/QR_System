import React, { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import Navbar from '../../components/AdminComponent/NavBar'
import { useItems } from '../../hooks/useItems.js'
import ItemCard from '../../components/AdminComponent/ItemCard'
import DeleteModal from '../../components/AdminComponent/DeleteModal'
import InputField from '../../components/AdminComponent/InputField'

export default function ItemCRUD() {
  const restaurantId = JSON.parse(
    localStorage.getItem('restaurantDetails')
  )?.restaurantId

  const { items, loading, saveItem, removeItem } = useItems(restaurantId)
  const [previewItems, setPreviewItems] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [form, setForm] = useState({ type: '', item: '', price: '', pic: '' })
  const [editingItemId, setEditingItemId] = useState(null)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const formRef = useRef(null)



  const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)

    if (!rows.length) {
      return
    }

    const existingNames = new Set(items.map(i => i.item.toLowerCase()))

    const cleaned = rows.map((row, index) => ({
      id: index,
      type: row.type,
      item: row.item,
      price: Number(row.price),
      pic: row.pic || '',
      duplicate: existingNames.has(String(row.item).toLowerCase()),
      invalid: !row.type || !row.item || !row.price,
    }))

    setPreviewItems(cleaned)
  } catch (err) {
    console.error(err)
  }

  e.target.value = ''
}

const uploadAllItems = async () => {
  const validItems = previewItems.filter(
    i => !i.invalid && !i.duplicate
  )

  if (!validItems.length) {
    return
  }

  setUploading(true)
  setProgress(0)

  for (let i = 0; i < validItems.length; i++) {
    await saveItem({
      type: validItems[i].type,
      item: validItems[i].item,
      price: validItems[i].price,
      pic: validItems[i].pic,
    })

    setProgress(Math.round(((i + 1) / validItems.length) * 100))
  }

  setUploading(false)
  setPreviewItems([])

 }


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.type || !form.item || !form.price) {
      return
    }

    saveItem(
      { ...form, price: Number(form.price) },
      editingItemId
    )

    setForm({ type: '', item: '', price: '', pic: '' })
    setEditingItemId(null)
  }

  const handleEdit = (item) => {
    setForm(item)
    setEditingItemId(item._id)
    formRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={formRef} className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        {/* FORM */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-10">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
  <h2 className="text-xl font-bold">
    {editingItemId ? 'Edit Item' : 'Add Item'}
  </h2>

  <div className="flex gap-2">
    <label className="cursor-pointer">
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
        className="hidden"
      />
      <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 border hover:bg-gray-200">
        📁 Upload CSV
      </span>
    </label>
  </div>
</div>


    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
<InputField
  label="Type"
  name="type"
  value={form.type}
  onChange={handleChange}
  required
  type="select"
  options={[
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "fast_food", label: "Fast Food" },
    { value: "momo", label: "Momo" },
    { value: "snacks", label: "Snacks" },
    { value: "tea", label: "Tea" },
    { value: "soft_drinks", label: "Soft Drinks" },
    { value: "drinks", label: "Drinks" },
    { value: "smoke", label: "Smoke" },
    { value: "milkshake", label: "Milkshake" },
    { value: "bakery", label: "Bakery" },
    { value: "other", label: "Other" }
  ]}
/>


            <InputField label="Item" name="item" value={form.item} onChange={handleChange} required />
            <InputField label="Price" name="price" value={form.price} onChange={handleChange} required />
            <InputField label="Image URL" name="pic" value={form.pic} onChange={handleChange} />

            <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 rounded-lg col-span-full font-medium">
                {editingItemId ? 'Update Item' : 'Add Item'}
            </button>

          </form>
        {previewItems.length > 0 && (
  <div className="bg-white rounded-xl p-6 shadow mb-8 border">
    <h3 className="font-semibold mb-4">Preview Items</h3>

    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Item</th>
          <th className="p-2">Type</th>
          <th className="p-2">Price</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {previewItems.map(i => (
          <tr key={i.id} className="border-t">
            <td className="p-2">{i.item}</td>
            <td className="p-2">{i.type}</td>
            <td className="p-2">{i.price}</td>
            <td className="p-2">
              {i.invalid ? (
                <span className="text-red-600">Invalid</span>
              ) : i.duplicate ? (
                <span className="text-yellow-600">Duplicate</span>
              ) : (
                <span className="text-green-600">Ready</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="flex justify-between items-center mt-4">
      <button
        onClick={uploadAllItems}
        disabled={uploading}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg"
      >
        Upload Items
      </button>

      {uploading && (
        <span className="text-sm text-gray-600">
          Uploading… {progress}%
        </span>
      )}
    </div>
  </div>
)}

        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          [...items].reverse().map((item) => (
  <ItemCard
    key={item._id}
    item={item}
    onEdit={() => handleEdit(item)}
    onDelete={() => setDeleteItemId(item._id)}
  />
))

        )}
      </div>

    


      <DeleteModal
        isOpen={!!deleteItemId}
        itemName={items.find((i) => i._id === deleteItemId)?.item}
        onClose={() => setDeleteItemId(null)}
        onConfirm={() => {
          removeItem(deleteItemId)
          setDeleteItemId(null)
        }}
      />
    </div>
  )
}