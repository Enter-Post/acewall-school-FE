import * as React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { GlobalContext } from "@/Context/GlobalProvider";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import avatar from "../assets/avatar.png";

export function TopNavbarDropDown({ selected, setselected }) {
  const { checkAuth, logout, UpdatedUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const tabs = [
    {
      id: 9,
      title: "Account",
      path: "/student/account",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      await checkAuth();
      toast.success("Logged out successfully");
      location.reload();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        aria-label="User menu"
        aria-haspopup="true"
        className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
      >
        <button className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={UpdatedUser?.profileImg?.url || avatar}
              alt={`${UpdatedUser?.firstName || "User"}'s avatar`}
            />
            <AvatarFallback className="bg-black text-white font-bold text-sm">
              {UpdatedUser?.firstName?.[0] || "N/A"}
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-medium">
            {UpdatedUser?.firstName || "N/A"}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-white"
        role="menu"
        aria-label="User dropdown menu"
      >
        {tabs.map((tab, index) => (
          <DropdownMenuItem
            key={index}
            asChild
            role="menuitem"
            aria-current={selected === tab.id ? "page" : undefined}
          >
            <Link
              to={tab.path}
              className={`block w-full text-left px-4 py-2 rounded focus:outline-none focus:bg-green-100 hover:bg-gray-100 ${
                selected === tab.id
                  ? "bg-green-500 text-white"
                  : "text-gray-900"
              }`}
            >
              {tab.title}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem asChild role="menuitem">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-green-100"
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
