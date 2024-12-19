"use client";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { UserInfo } from "@/components/user-info";

const ClientPage = () => {
  const user = useCurrentUser();
  return (
    <div className="bg-white p-10 rounded-xl">
      <UserInfo user={user} label="Server" />
    </div>
  );
};

export default ClientPage;
