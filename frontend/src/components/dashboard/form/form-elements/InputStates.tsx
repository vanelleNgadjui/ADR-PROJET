import { useState } from "react";
import InputField from "../input/InputField";
import Label from "../Label";

export default function InputStates() {
  const [email, setEmail] = useState("");
  const [emailTwo, setEmailTwo] = useState("");
  const [error, setError] = useState(false);

  // Simulate a validation check
  const validateEmail = (value: string) => {
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    setError(!isValidEmail);
    return isValidEmail;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };
  
  const handleEmailTwoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailTwo(value);
    validateEmail(value);
  };
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Input States</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Validation styles for error, success and disabled states on form controls.</p>
      <div className="space-y-5 sm:space-y-6">
        {/* Error Input */}
        <div>
          <Label>Email</Label>
          <InputField
            type="email"
            value={email}
            error={error}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            hint={error ? "This is an invalid email address." : ""}
          />
        </div>

        {/* Success Input */}
        <div>
          <Label>Email</Label>
          <InputField
            type="email"
            value={emailTwo}
            success={!error}
            onChange={handleEmailTwoChange}
            placeholder="Enter your email"
            hint={!error ? "This is an success message." : ""}
          />
        </div>

        {/* Disabled Input */}
        <div>
          <Label>Email</Label>
          <InputField
            type="text"
            value="disabled@example.com"
            disabled={true}
            placeholder="Disabled email"
          />
        </div>
      </div>
    </div>
  );
}
