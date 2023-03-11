enum Icons {
  Mail,
  Lock,
}

interface FormFieldProps {
  label: string;
  type: string;
  icon: any;
}

function FormField({ label, type, icon }: FormFieldProps) {
  return (
    <div className="relative z-0 group bg-gray-700 rounded-xl">
      <input
        type={type}
        name={type}
        autoComplete={type}
        className="block p-4 pt-6 tracking-wider w-full text-md text-white bg-transparent rounded-xl appearance-none outline-offset-2 outline-3 outline-tblue focus:outline ring-0 peer"
        placeholder=" "
        required
      />
      <label
        htmlFor={type}
        className="px-5 peer-focus:font-medium absolute text-md text-gray-200 duration-300 transform -translate-y-4 scale-75 top-5 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-tblue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>

      <div className="right-4 top-1/2 -translate-y-1/2 absolute z-[-1]">
        {icon}
      </div>
    </div>
  );
}

export default FormField;
