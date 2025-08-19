import { useState } from "react";
import Label from "../Label";
import InputField from "../input/InputField";
import Select from "../Select";
import { EyeIcon, EyeOffIcon, ClockIcon, CreditCardIcon } from "lucide-react";
import DatePicker from "../date-picker";

export default function DefaultInputs() {
  const [showPassword, setShowPassword] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Default Inputs</h3>
      <div className="space-y-6">
        <div>
          <Label htmlFor="input">Input</Label>
          <InputField type="text" id="input" />
        </div>
        <div>
          <Label htmlFor="inputTwo">Input with Placeholder</Label>
          <InputField type="text" id="inputTwo" placeholder="info@gmail.com" />
        </div>
        <div>
          <Label>Select Input</Label>
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
          />
        </div>
        <div>
          <Label>Password Input</Label>
          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="text-gray-500 dark:text-gray-400 w-5 h-5" />
              ) : (
                <EyeOffIcon className="text-gray-500 dark:text-gray-400 w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <DatePicker
            id="date-picker"
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(date) => {
              console.log("Selected date:", date);
            }}
          />
        </div>

        <div>
          <Label htmlFor="tm">Time Picker Input</Label>
          <div className="relative">
            <InputField
              type="time"
              id="tm"
              name="tm"
              onChange={(e) => console.log(e.target.value)}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ClockIcon className="w-6 h-6" />
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="tm">Input with Payment</Label>
          <div className="relative">
            <InputField
              type="text"
              placeholder="Card number"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <CreditCardIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
