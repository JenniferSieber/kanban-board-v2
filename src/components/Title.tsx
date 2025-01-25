import { useState } from "react";
import GroupIcon from "../icons/GroupIcon";
import CalendarIcon from "../icons/CalendarIcon";

interface Props {
  projectName: string;
  updateProjectTitle: (name: string) => void;
}

function Title({ projectName, updateProjectTitle }: Props) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="title-container flex justify-between">
      <header className="flex items-center text-2xl">
        <GroupIcon />
        <div onClick={() => setEditMode(true)}>
          {!editMode && (
            <span className="capitalize p-1">{projectName}</span>
          )}

          {editMode && (
            <input
              type="text"
              value={projectName}
              className="bg-black rounded-sm border-2 focus:border-rose-900 outline-none"
              onChange={(e) => updateProjectTitle(e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
      </header>
      <div className="date-container p-5 flex items-center">
        {/* <CalendarIcon />
        date */}
      </div>
    </div>
  );
}

export default Title;
