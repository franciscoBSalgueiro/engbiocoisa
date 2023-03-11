interface Props {
  options: string[];
  defaultOption: string;
  onChange: (option: string) => void;
}

function Dropdown({ options, defaultOption, onChange }: Props) {
  return (
    <div className="">
      <select
        value={defaultOption}
        required
        onChange={(e) => onChange(e.target.value)}
        className="block w-full bg-surface border hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
