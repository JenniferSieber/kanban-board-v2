import { FC, SVGProps } from "react";

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};

export type Member = {
  id: Id;
  memberName: string;
};

export type Icon = {
  iconId: string;
  iconName: string;
  iconTitle: string;
  // svgIcon: React.ElementType; // Store the actual icon component
  svgIcon: FC<SVGProps<SVGSVGElement>>;
};
