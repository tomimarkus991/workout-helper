import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

import { Workout } from "@/app-constants";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components";

import { definedRoutes } from "../../routes";

type Props = Pick<Workout, "id" | "averageCompletionTime" | "name" | "image">;

export const WorkoutCard = ({ id, averageCompletionTime, name, image }: Props) => (
  <Link key={id} to={`${definedRoutes.workoutPage}/${id}`}>
    <div className="relative w-full h-40 mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
      <img
        src={`/workout/${image}`}
        className="object-cover w-full h-full aspect-auto rounded-xl"
        alt="workout-img"
      />
      <div className="absolute px-4 py-2 bg-white rounded top-4 left-4 bg-opacity-70">
        <p className="text-xl font-bold text-slate-800">{name}</p>
      </div>
      <div className="absolute px-4 py-2 bg-white rounded bottom-4 left-4 bg-opacity-70">
        <p className="text-lg font-medium text-slate-800">{averageCompletionTime}</p>
      </div>
      <div className="absolute cursor-pointer top-4 right-4 ">
        <Dropdown>
          <DropdownButton className="!py-1 !px-2 bg-white bg-opacity-90" outline>
            <BsThreeDots className="cursor-pointer size-7 fill-slate-700 hover:fill-slate-800" />
          </DropdownButton>
          <DropdownMenu>
            <DropdownItem href="/users/1/edit">Edit</DropdownItem>
            <DropdownItem onClick={() => {}}>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </Link>
);
