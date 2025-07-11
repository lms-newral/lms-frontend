import { Search } from "lucide-react";

export default function EnrolledStudentsHeader() {
  return (
    <div className="sticky top-0 left-0 right-0 border border-b w-full py-4  ">
      <div className="max-w-7xl mx-auto flex justify-between">
        <div className=" border-2 flex py-2 px-2 rounded-lg items-center ">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="px-2 outline-0 focus:ring-0"
            placeholder="search"
          />
        </div>
      </div>
    </div>
  );
}
