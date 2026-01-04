import { useMemo } from 'react'

export default function SoldItemsTable({ items = [] }) {
  const totals = useMemo(
    () => ({
      qty: items.reduce((s, i) => s + i.quantity, 0),
      price: items.reduce((s, i) => s + i.price, 0),
    }),
    [items]
  )
  
  return (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
              Quantity
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
              Price (Rs.)
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((i, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {i.item}
              </td>
              <td className="px-4 py-3 text-right text-gray-700">
                {i.quantity}
              </td>
              <td className="px-4 py-3 text-right text-gray-900">
                {i.price.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="bg-gray-50 font-semibold">
          <tr>
            <td className="px-4 py-3 text-gray-900">Total</td>
            <td className="px-4 py-3 text-right text-gray-900">
              {totals.qty}
            </td>
            <td className="px-4 py-3 text-right text-gray-900">
              Rs. {totals.price.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
)

}
