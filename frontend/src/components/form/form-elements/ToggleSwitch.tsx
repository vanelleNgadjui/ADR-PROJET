import Switch from "../switch/Switch";

export default function ToggleSwitch() {
  const handleSwitchChange = (checked: boolean) => {
    console.log("Switch is now:", checked ? "ON" : "OFF");
  };
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Toggle switch input</h3>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Switch
            label="Default"
            defaultChecked={true}
            onChange={handleSwitchChange}
          />
          <Switch
            label="Checked"
            defaultChecked={true}
            onChange={handleSwitchChange}
          />
          <Switch label="Disabled" disabled={true} />
        </div>
        <div className="flex gap-4">
          <Switch
            label="Default"
            defaultChecked={true}
            onChange={handleSwitchChange}
            color="gray"
          />
          <Switch
            label="Checked"
            defaultChecked={true}
            onChange={handleSwitchChange}
            color="gray"
          />
          <Switch label="Disabled" disabled={true} color="gray" />
        </div>
      </div>
    </div>
  );
}
