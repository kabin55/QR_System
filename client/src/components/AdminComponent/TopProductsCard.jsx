export default function TopProductsCard({ products = [] }) {
  if (!products.length) {
    return <p className="text-gray-500">No data available</p>
  }

  const maxSales = Math.max(...products.map(p => p.sales || 0))

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      {products.map((product, index) => (
        <div key={product.name} className="mb-6">
          <div className="flex justify-between mb-2">
            <div className="flex gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-500">
                  Rs. {(product.revenue ?? 0).toLocaleString()} revenue
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">{product.sales}</p>
              <p className="text-xs text-gray-500">units sold</p>
            </div>
          </div>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{ width: `${(product.sales / maxSales) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
