import axios from "axios";
import { useEffect, useState } from "react";

interface CourseCardProps {
  title: string;
  description: string;
  thumbnailurl: string;
  creatorId: string;
}

export default function CourseCard(props: CourseCardProps) {
  const [creator, setCreator] = useState("");
  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}user/${props.creatorId}`
        );
        setCreator(response.data.name);
      } catch (e: any) {
        console.log(e.response.data.message);
      }
    }
    getUser();
  }, []);
  return (
    <div
      title={`${props.title} by ${creator}`}
      className="flex flex-col flex-1  items-center justify-end w-xs xl:w-sm xl:h-72 h-56  rounded-xl shadow-2xl bg-gray-200 bg-cover bg-center"
      style={{ backgroundImage: `url(${props.thumbnailurl})` }}
    >
      <div className="w-full bg-blue-900/30 backdrop-blur-md p-3 rounded-b-lg">
        <p className="text-white font-semibold text-md">{props.title}</p>
        <p className="text-gray-200 text-sm">{props.description}</p>
      </div>
    </div>
  );
}
