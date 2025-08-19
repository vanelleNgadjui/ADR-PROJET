import Label from "../Label";
import InputField from "../input/InputField";
import { MailIcon } from "lucide-react";

export default function InputGroup() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Input Group</h3>
      <div className="space-y-6">
        <div>
          <Label>Email</Label>
          <div className="relative">
            <InputField
              placeholder="info@gmail.com"
              type="text"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <MailIcon className="w-6 h-6" />
            </span>
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <div className="relative">
            <InputField
              placeholder="+1 (555) 000-0000"
              type="tel"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              +1
            </span>
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <div className="relative">
            <InputField
              placeholder="+1 (555) 000-0000"
              type="tel"
              className="pr-[62px]"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              +1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
