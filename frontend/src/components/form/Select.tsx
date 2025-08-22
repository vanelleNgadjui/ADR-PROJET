import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Sélectionner une option",
  onChange,
  className = "",
  defaultValue = "",
  disabled = false,
  error = false,
  success = false,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); // Trigger parent handler
  };

  let selectClasses = `h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-base shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    selectClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    selectClasses += ` border-secondary-coral focus:border-secondary-coral focus:ring-secondary-coral/20 dark:text-secondary-coral dark:border-secondary-coral dark:focus:border-secondary-coral`;
  } else if (success) {
    selectClasses += ` border-secondary-mint focus:border-secondary-mint focus:ring-secondary-mint/20 dark:text-secondary-mint dark:border-secondary-mint dark:focus:border-secondary-mint`;
  } else {
    selectClasses += ` bg-transparent text-gray-800 border-neutral-black/10 focus:border-transparent focus:ring-primary-blue dark:border-gray-700 dark:text-white/90 dark:focus:border-primary-blue`;
  }

  if (selectedValue) {
    selectClasses += ` text-gray-800 dark:text-white/90`;
  } else {
    selectClasses += ` text-gray-400 dark:text-gray-400`;
  }

  return (
    <div className="relative">
      <select
        className={selectClasses}
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default Select;
