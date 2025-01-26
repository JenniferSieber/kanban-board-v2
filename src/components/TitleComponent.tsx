import { useState, useEffect, FC, SVGProps } from "react";
import { Icon } from "../types";
import {
  GroupLineLogoIcon,
  UsersSolidIcon,
  WarnLineIcon,
} from "../icons/TitleIconsList";

const icons: Icon[] = [
  {
    iconId: "group",
    iconName: "GroupLogoIcon",
    iconTitle: "Project Page",
    svgIcon: GroupLineLogoIcon,
  },
  {
    iconId: "users",
    iconName: "UsersIcon",
    iconTitle: "Team Members",
    svgIcon: UsersSolidIcon,
  },
  {
    iconId: "alert",
    iconName: "WarnLineIcon",
    iconTitle: "Backlog",
    svgIcon: WarnLineIcon,
  },
];

interface TitleComponentProps {
  // svgIcon: FC<SVGProps<SVGSVGElement>>;
  // iconName: string;
  updateProjectTitle: (name: string) => void;
}

function TitleComponent({ updateProjectTitle }: TitleComponentProps) {
  const [editMode, setEditMode] = useState(false);
  const [iconChoice, setIconChoice] = useState<Icon>({
    iconId: "group",
    iconName: "GroupLogoIcon",
    iconTitle: "Project Page",
    svgIcon: GroupLineLogoIcon,
  });

  useEffect(() => {
    console.log(iconChoice);
  }, [iconChoice]);
  
  return (
    <div className="cursor-pointer title-container flex justify-between">
      <header className="flex items-center text-2xl">
        {iconChoice.svgIcon && <iconChoice.svgIcon className="icon mr-2" />}
        <div onClick={() => setEditMode(true)}>
          {!editMode && (
            <span className="capitalize p-1">{iconChoice.iconTitle}</span>
          )}
          {editMode && (
            <input
              type="text"
              value={iconChoice.iconTitle}
              className="bg-black rounded-sm border-2 focus:border-rose-900 outline-none"
              onChange={(e) =>
                setIconChoice({ ...iconChoice, iconTitle: e.target.value })
              }
              autoFocus
              onBlur={() => {
                updateProjectTitle(iconChoice.iconTitle);
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateProjectTitle(iconChoice.iconTitle);
                  setEditMode(false);
                }
              }}
            />
          )}
        </div>
      </header>
    </div>
  );
}

export default TitleComponent;
