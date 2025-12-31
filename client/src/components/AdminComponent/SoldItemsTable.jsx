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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bold text-black-500">
              <th className="py-3 text-left font-semibold">Name</th>
              <th className="py-3 text-right font-semibold">Quantity</th>
              <th className="py-3 text-right font-semibold">Price (Rs.)</th>
            </tr>
          </thead>

          <tbody>
            {items.map((i, idx) => (
              <tr
                key={idx}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="py-3 text-gray-700 font-semibold">
                  {i.item}</td>
                <td className="py-3 text-right font-semibold text-gray-700">
                  {i.quantity}
                </td>
                <td className="py-3 text-right font-semibold text-gray-900">
                  {i.price.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t bg-gray-50 font-semibold">
              <td className="py-3 text-gray-900">Total</td>
              <td className="py-3 text-right text-gray-900">
                {totals.qty}
              </td>
              <td className="py-3 text-right text-gray-900">
                Rs. {totals.price.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
