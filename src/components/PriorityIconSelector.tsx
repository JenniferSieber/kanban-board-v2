import LowPriorityIcon from "../icons/LowPriorityIcon";
import MediumPriorityIcon from "../icons/MediumPriorityIcon";
import HighPriorityIcon from "../icons/HighPriorityIcon";
import React, { useState } from "react";

function PriorityIconSelector() {
  const [priority, setPriority] = useState<string>("");

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriority(event.target.value);
  };

  const renderIcon = () => {
    switch (priority) {
      case "low":
        return <LowPriorityIcon />;
      case "medium":
        return <MediumPriorityIcon />;
      case "high":
        return <HighPriorityIcon />;
      default:
        return null; // No Icon for Empty State
    }
  };
  return (
    <div className="priority-icon text-black flex items-center mx-3">
      <span className="pl-1">{renderIcon()}</span>
      <select
        name="priority"
        id="priority"
        value={priority}
        onChange={handlePriorityChange}
        className="cursor-pointer outline-none border-rose-900 hover:ring-2 hover:ring-rose-500 text-white bg-black opacity-50 rounded-md w-full p-2"
      >
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}

export default PriorityIconSelector;
