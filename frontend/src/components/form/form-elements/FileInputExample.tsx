import FileInput from "../input/FileInput";
import Label from "../Label";

export default function FileInputExample() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Input</h3>
      <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
      </div>
    </div>
  );
}
