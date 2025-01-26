import { Id, Icon, Member } from "../types";
// import { useState, FC, SVGProps } from "react";
import { useState } from "react";
import UserCircleIcon from "../icons/UserCircleIcon";
import MinusIcon from "../icons/MinusIcon";
import { UsersSolidIcon } from "../icons/TitleIconsList";

interface ProjectOwnersProps {
  projectOwners: Member[];
  newMemberName: string;
  // svgIcon: FC<SVGProps<SVGSVGElement>>;
  setNewMemberName: (newMemberName: string) => void;
  updateProjectOwners: (newMemberName: string) => void;
  reduceProjectOwners: (id: Id) => void;
}

function GenerateProjectOwners({
  newMemberName,
  setNewMemberName,
  projectOwners,
  updateProjectOwners,
  reduceProjectOwners,
}: ProjectOwnersProps) {
  const [iconChoice] = useState<Icon>({
    iconId: "users",
    iconName: "UsersIcon",
    iconTitle: "Project Team",
    svgIcon: UsersSolidIcon,
  });

  return (
    <>
      <section className="bg-rose-950 h-[600px] w-[95%] rounded-md">
        <header className="flex flex-col gap-2 text-sky-300 font-[18px] items-center justify-center">
          <div className="flex w-[100%] text-3xl items-center justify-center gap-3">
            {iconChoice.svgIcon && <iconChoice.svgIcon className="icon mr-2" />}
            <span>{iconChoice.iconTitle}</span>
          </div>

          <div className="w-[100%] p-3">
            <input
              className="w-[100%] p-1 bg-black rounded-sm border-2 focus:border-rose-700 outline-none"
              value={newMemberName}
              placeholder="Add User"
              onChange={(e) => setNewMemberName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const trimmedName = newMemberName.trim();
                  // Validate user input
                  if (
                    /^[a-zA-Z '-]+$/.test(newMemberName.trim()) &&
                    newMemberName.trim() !== ""
                  ) {
                    updateProjectOwners(trimmedName);
                    setNewMemberName("");
                  } else {
                    alert(
                      `${newMemberName} is invalid input. Please try again.`
                    );
                    setNewMemberName("");
                    console.error(
                      "Input must only contain alphabetic characters."
                    );
                  }
                }
              }}
            />
          </div>
        </header>

        <section className="p-2 rounded-md max-h-[50%] ">
          <div className="test max-h-[80%] flex flex-col gap-2">
            {projectOwners.length < 15 &&
              projectOwners.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#161C22] flex justify-between rounded-md p-2"
                >
                  <div className="flex gap-2">
                    <UserCircleIcon />
                    <span className="name capitalize">{user.memberName}</span>
                  </div>
                  <button
                    onClick={() => reduceProjectOwners(user.id)}
                    className="cursor-pointer hover:text-rose-500"
                  >
                    <MinusIcon />
                  </button>
                </div>
              ))}
          </div>
        </section>
      </section>

      <section className="bg-black h-[100%]">
        <h3>backlog here</h3>
      </section>
    </>
  );
}

export default GenerateProjectOwners;
