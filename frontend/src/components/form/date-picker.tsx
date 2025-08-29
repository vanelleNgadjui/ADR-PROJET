import calendarIcon from "../../assets/calendar.svg";
import Label from "./Label";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (date: string) => void;
  defaultDate?: string;
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder = "Sélectionner une date",
  className = "",
}: PropsType) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          type="date"
          placeholder={placeholder}
          defaultValue={defaultDate}
          onChange={handleChange}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-11 text-base shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-primary-blue focus:ring-primary-blue/20 dark:border-gray-700 dark:focus:border-primary-blue"
        />

        <span className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2">
          <img src={calendarIcon} alt="Calendrier" className="w-5 h-5 opacity-50" />
        </span>
      </div>
    </div>
  );
}
