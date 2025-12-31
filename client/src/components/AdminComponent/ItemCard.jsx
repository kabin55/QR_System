export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100
                    p-4 mb-4 flex items-center justify-between">
      
      {/* Left: Image + Info */}
      <div className="flex items-center gap-4">
        {item.pic ? (
          <img
            src={item.pic}
            alt={item.item}
            className="w-16 h-16 rounded-lg object-cover border"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100
                          flex items-center justify-center
                          text-xs text-gray-400">
            No Image
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-800">{item.item}</p>
          <p className="text-sm text-gray-500">Type: {item.type}</p>
          <p className="text-sm text-gray-500">
            Price: Rs. {Number(item.price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="px-4 py-1.5 text-sm rounded-md
                     bg-cyan-600 text-white
                     hover:bg-cyan-700 transition"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="px-4 py-1.5 text-sm rounded-md
                     bg-red-500 text-white
                     hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
