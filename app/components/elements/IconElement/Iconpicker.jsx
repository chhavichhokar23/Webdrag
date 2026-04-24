import { iconList } from "./icons"

export default function IconPicker({ currentIcon, onSelect }) {
  return (
    <div className="grid grid-cols-6 gap-1 p-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
      {iconList.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          title={name}
          className={`p-1.5 rounded flex items-center justify-center hover:bg-blue-50 transition-colors ${
            currentIcon === name ? "bg-blue-100 border border-blue-400" : "border border-transparent"
          }`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  )
}