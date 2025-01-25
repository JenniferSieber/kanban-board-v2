import { useState } from "react";
import UsersIcon from "../icons/UsersIcon";
import UserIcon from "../icons/UserIcon";
import MinusIcon from "../icons/MinusIcon";
import { Member } from "../types";

interface ProjectOwnersProps {
  owners: Member[];
}

const owners = [
  { id: 1, memberName: "John Doe" },
  { id: 2, memberName: "Carolyn Doehead" },
  { id: 3, memberName: "Rider Doezer" },
];
function GenerateProjectOwners({ owners }: ProjectOwnersProps) {
    const generateRandomId = () => Math.floor(Math.random() * 10000);
  const [editMembersMode, setEditMembersMode] = useState(false);
  const [projectOwners, setProjectOwners] = useState<Member[]>(owners || []);
  const [newMemberName, setNewMemberName] = useState<string>("");

//   setProjectOwners(owners);

  function updateProjectOwners(memberName: string) {
    const id = generateRandomId();
    const newMember = { id, memberName };
    setProjectOwners([...projectOwners, newMember]);
  }
  return (
    <section className="project-owners h-[200px] rounded-md border-2 border-rose-500">
      <header className="flex gap-2 font-sky-300">
        <UsersIcon />
        <span>Project Owners: </span>
      </header>
      <div className="flex gap-4">
        {!editMembersMode && (
            <span className="text-md">Add Project Owners</span>
        )}
       
            <input
            className="bg-blue-500 rounded-sm px-2 border-2 focus:border-rose-700 outline-none"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            autoFocus
            onBlur={() => setEditMembersMode(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateProjectOwners(newMemberName);
                setNewMemberName("");
                setEditMembersMode(false)
              }
            }}
          />
        
      </div>
      <div className="map-members">
        {!editMembersMode && (
          <div className="generate">
            {projectOwners.map((member) => (
              <div key={member.id} className="member flex gap-2 font-gray-300">
                <UserIcon />
                <span className="member-name">{member.memberName}</span>
                <MinusIcon />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GenerateProjectOwners;

{/* <input
          className="bg-blue-500 rounded-sm px-2 border-2 focus:border-rose-700 outline-none"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          autoFocus
          onBlur={() => setEditMembersMode(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateProjectOwners(newMemberName);
              setNewMemberName("");
            }
          }}
        /> */}