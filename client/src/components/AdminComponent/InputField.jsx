// export default function InputField({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   type = 'text',
//   required = false,
// }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-sm font-medium text-gray-700">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
//     <div className="flex items-center justify-between">
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         className="w-full rounded-lg border border-gray-200 px-4 py-2.5
//                    text-sm bg-white
//                    focus:outline-none focus:ring-2 focus:ring-cyan-500
//                    focus:border-cyan-500"
//       />
//       </div>
//       </div>
//     </div>
//   )
// }


const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  options = []
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between">

          {type === "select" ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5
                         text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-cyan-500
                         focus:border-cyan-500"
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5
                         text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-cyan-500
                         focus:border-cyan-500"
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default InputField;
