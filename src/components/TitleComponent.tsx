import { useState } from "react";
import GroupIcon from "../icons/GroupIcon";

interface Props {
  projectName: string;
  updateProjectTitle: (name: string) => void;
}

function TitleComponent({ projectName, updateProjectTitle }: Props) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="cursor-pointer title-container flex justify-between">
      <header className="flex items-center text-2xl">
        <GroupIcon />
        <div onClick={() => setEditMode(true)}>
          {!editMode && <span className="capitalize p-1">{projectName}</span>}

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
    </div>
  );
}

export default TitleComponent;
