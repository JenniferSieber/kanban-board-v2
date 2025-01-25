import LowPriorityIcon from "../icons/LowPriorityIcon";
import MediumPriorityIcon from "../icons/MediumPriorityIcon";
import HighPriorityIcon from "../icons/HighPriorityIcon";
import React, { useState } from "react";

function PriorityIconSelector() {

    const [priority, setPriority] = useState<string>("");

    const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPriority(event.target.value);
    }

    const renderIcon = () => {
        switch(priority) {
            case "low":
                return <LowPriorityIcon />
            case "medium":
                return <MediumPriorityIcon />
            case "high":
                return <HighPriorityIcon />
            default:
                return null; // No Icon for Empty State
        }
    }
  return (
    <div className="priority-icon text-black flex items-center">
        <span className="ml-2">
            {renderIcon()}
        </span>
        <select 
            name="priority"
            id="priority"
            value={priority}
            onChange={handlePriorityChange}
            className="border-rose-900 text-white bg-black rounded-md w-full mx-3 p-1"
        >
            <option value="">Choose Priority</option>
            <option value="low">Low <LowPriorityIcon /></option>
            <option value="medium">Medium <MediumPriorityIcon /></option>
            <option value="high">High <HighPriorityIcon /></option>
        </select>
        
        
    </div>
  )
}

export default PriorityIconSelector
