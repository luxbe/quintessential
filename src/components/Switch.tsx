interface SwitchProps {
  label: string
  value: boolean
  setValue: (v: boolean) => {}
}
export const Switch = ({ label, value, setValue }: SwitchProps) => (
  <div>
    <div className="w-full flex justify-between items-center">
      <span>{label}</span>
      <div className="flex justify-center">
        <div
          className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
            value ? 'bg-green' : 'bg-gray'
          }`}
        >
          <label
            htmlFor="toggle"
            className={`absolute left-0 w-6 h-6 mb-2 transition duration-100 ease-linear transform bg-white border-2 rounded-full cursor-pointer ${
              value
                ? 'translate-x-full border-green'
                : 'translate-x-0 border-gray'
            }`}
          ></label>
          <input
            type="checkbox"
            id="toggle"
            name="toggle"
            className="w-full h-full appearance-none focus:outline-none"
            onClick={() => setValue(!value)}
          />
        </div>
      </div>
    </div>
    <hr className="text-gray w-full mt-4" />
  </div>
)
