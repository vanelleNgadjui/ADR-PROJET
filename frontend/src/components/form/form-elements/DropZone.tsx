import { UploadIcon } from "lucide-react";

const DropzoneComponent: React.FC = () => {
  const onDrop = (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
    // Handle file uploads here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dropzone</h3>
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-primary-blue dark:border-gray-700 rounded-xl hover:border-primary-blue">
        <div
          className="dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="dz-message flex flex-col items-center m-0">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <UploadIcon className="w-7 h-7" />
              </div>
            </div>

            {/* Text Content */}
            <h4 className="mb-3 font-semibold text-gray-800 text-xl dark:text-white/90">
              Drag & Drop Files Here
            </h4>

            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </span>

            <span className="font-medium underline text-sm text-primary-blue">
              Browse File
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropzoneComponent;
