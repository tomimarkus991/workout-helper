import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  tooltip: ReactNode;
}

export const Tooltip = ({ tooltip }: Props) => (
  <span
    id="tooltip"
    className={clsx(
      "absolute top-[-3rem] z-[997] p-2 text-sm font-bold text-white whitespace-nowrap transform",
      "origin-bottom scale-0 rounded-md bg-secondary shadow-md transition-all duration-200",
      "lowercase tracking-wider group-hover:scale-100",
      "!opacity-100 !group-hover:opacity-100",
    )}
  >
    {tooltip}
  </span>
);
