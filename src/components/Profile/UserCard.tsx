import { User } from "@/types/DataTypes";

export default function UserCard(props: { user: User }) {
  console.log("props", props);
  return (
    <div className="max-w-7xl flex justify-center items-center">
      <div className=" ">{props.user && props.user.username} usernames</div>
    </div>
  );
}
