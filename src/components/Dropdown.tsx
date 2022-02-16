interface DropdownProps {
    id: string
    label: string
    value: string
    options: [label: string, value?: string][]
    setValue: (v: string) => void
  }
  export const Dropdown = ({ id, label, value, setValue, options }: DropdownProps) => (
    <div>
      <div className="w-full flex justify-between items-center">
        <span>{label}</span>
          <div
            className="relative bg-gray text-white px-2 py-1 rounded-md"
          >
            <select
              id={id}
              value={value}
              name="toggle"
              className="w-full h-full bg-gray"
              onChange={(e) => setValue(e.currentTarget.value)}
            >
                {options.map(([label,value]) => <option value={value} key={value || label}>{label}</option>)}
            </select>
          </div>
      </div>
      <hr className="text-gray w-full mt-4" />
    </div>
  )
  