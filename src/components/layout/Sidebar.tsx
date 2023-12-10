import React from "react";

import { BsHouseFill, BsListUl } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineInsertChart } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import { SidebarProps } from "./types";
import { FaUncharted } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import "./Layout.css";

const Sidebar: React.FC<SidebarProps> = () => {
  const { user } = useAuth();
  let auth = false;
  if (user) {
    auth = true;
  }
  const items = [
    {
      icon: BsHouseFill,
      label: "Home",
      href: "/",
    },
    {
      icon: MdOutlineInsertChart,
      label: "portfolio",
      href: "/portfolio",
      auth: auth,
    },
    {
      icon: BsListUl,
      label: "watchlist",
      href: "/watchlist",
      auth: auth,
    },
    {
      icon: IoMdSettings,
      label: "settings",
      href: `/${user?.username}/settings/`,
      auth: auth,
    },
  ];
  return (
    <>
      <span className="logo-side">
        {" "}
        <FaUncharted size={24} />
        <span>Finhub</span>
      </span>
      <div className="sidebar-items">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            auth={auth}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </>
  );
};

export default Sidebar;
