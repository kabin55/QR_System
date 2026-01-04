export default function ChartCard({ title, children, controls }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        {controls}
      </div>
      {children}
    </div>
  )
}
