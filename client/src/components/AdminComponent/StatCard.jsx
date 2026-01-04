export default function StatCard({ title, value, icon }) {

  return (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>

      <div className="p-3 rounded-lg bg-cyan-100">
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
)

}
