export default function TimeRangeSelector({ selected, onChange, options }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-md text-sm ${
            selected === opt.value
              ? 'bg-white shadow'
              : 'text-gray-500'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
