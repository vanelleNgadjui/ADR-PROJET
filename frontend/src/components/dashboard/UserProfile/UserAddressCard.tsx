import { useState } from "react";
import { Edit3Icon } from "lucide-react";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import InputField from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../../hooks/useAuth";

export default function UserAddressCard() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Localisation
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.user_metadata?.location || 'Non définie'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Coordonnées GPS
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.user_metadata?.latitude && user?.user_metadata?.longitude 
                    ? `${user.user_metadata.latitude}, ${user.user_metadata.longitude}`
                    : 'Non définies'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Mission
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.user_metadata?.mission || 'Non définie'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Genre
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.user_metadata?.genre || 'Non défini'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <Edit3Icon className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
      
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <InputField type="text" defaultValue="United States" />
                </div>

                <div>
                  <Label>City/State</Label>
                  <InputField type="text" defaultValue="Arizona, United States." />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <InputField type="text" defaultValue="ERT 2489" />
                </div>

                <div>
                  <Label>TAX ID</Label>
                  <InputField type="text" defaultValue="AS4568384" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
