import { RealButton } from "@/components";
import { useSignOut } from "@/hooks";

export const ProfilePage = () => {
  const { mutate } = useSignOut();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RealButton variant="blue" onClick={() => mutate()}>
        Sign out
      </RealButton>
    </div>
  );
};
