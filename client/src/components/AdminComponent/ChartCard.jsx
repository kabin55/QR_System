export default function ChartCard({ title, children, controls }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {controls}
      </div>
      {children}
    </div>
  )
}
