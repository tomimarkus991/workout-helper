"use client";

import { Switch } from "@headlessui/react";
import { useField } from "formik";

import { cn } from "../../lib";
import { Tooltip } from "../elements";

interface Props {
  pressed: boolean;
  setPressed: React.Dispatch<React.SetStateAction<boolean>>;
  tooltip?: string;
}

interface ToggleWrapperProps {
  pressed: boolean;
  tooltip?: string;
}

const ToggleWrapper = ({ pressed, tooltip }: ToggleWrapperProps) => {
  return (
    <>
      <div
        className={cn(
          pressed ? "bg-secondary" : "bg-[#e5e7eb]",
          "relative group inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          " focus:ring-secondary",
          "transition-colors duration-200 ease-in-out",
        )}
      >
        {tooltip && <Tooltip tooltip={tooltip} />}
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={cn(
            pressed ? "translate-x-[21px]" : "translate-x-[2px]",
            "justify-center self-center",
            "pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          )}
        />
      </div>
    </>
  );
};

export const Toggle = ({ pressed, setPressed, tooltip }: Props) => (
  <Switch
    className="relative flex items-center mt-1 rounded-full cursor-pointer focus:outline-none w-fit focus:ring-secondary focus:ring-2 focus:ring-offset-2"
    checked={pressed}
    onChange={setPressed}
  >
    <ToggleWrapper pressed={pressed} tooltip={tooltip} />
  </Switch>
);

interface FormikToggleProps {
  name: string;
  tooltip?: string;
  disabled?: boolean;
  label?: string;
}

export const FormikToggle = ({ tooltip, name, disabled, label }: FormikToggleProps) => {
  const [field, { value: pressed }, { setValue: setPressed }] = useField<boolean>(name);
  return (
    <>
      {label && (
        <div className="ml-1">
          <label className="text-xs sm:text-sm text-stone-400" htmlFor={name}>
            {label}
          </label>
        </div>
      )}
      <Switch
        className="relative flex items-center mt-1 rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-90 focus:outline-none w-fit focus:ring-secondary focus:ring-2 focus:ring-offset-2"
        {...(field as any)}
        checked={pressed}
        onChange={setPressed}
        disabled={disabled}
      >
        <ToggleWrapper pressed={pressed} tooltip={tooltip} />
      </Switch>
    </>
  );
};
