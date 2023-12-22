import { BsThreeDots } from "react-icons/bs";

import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components";

interface Props {
  id: string;
  averageCompletionTime: number;
  name: string;
  imageUrl?: string;
}

export const WorkoutCard = ({ id, averageCompletionTime, name, imageUrl }: Props) => (
  <div
    key={id}
    className="relative w-full h-40 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"
  >
    <img
      src={`/workout/${imageUrl}`}
      className="object-cover w-full h-full aspect-auto rounded-xl"
      alt="workout-img"
    />
    <div className="absolute px-4 py-2 bg-white rounded top-4 left-4 bg-opacity-70">
      <p className="text-xl font-bold">{name}</p>
    </div>
    <div className="absolute px-4 py-2 bg-white rounded bottom-4 left-4 bg-opacity-70">
      <p className="text-lg font-medium">{averageCompletionTime}</p>
    </div>
    <div className="absolute cursor-pointer top-4 right-4 ">
      <Dropdown>
        <DropdownButton className="!py-1 !px-2 bg-white bg-opacity-90" outline>
          <BsThreeDots className="cursor-pointer size-7 fill-gray-700 hover:fill-gray-800" />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem href="/users/1/edit">Edit</DropdownItem>
          <DropdownItem onClick={() => {}}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
);
