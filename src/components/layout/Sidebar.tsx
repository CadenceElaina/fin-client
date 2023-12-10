import React from "react";

import { BsHouseFill, BsListUl } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineInsertChart } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import { SidebarProps } from "./types";
import { FaUncharted } from "react-icons/fa";
import "./Layout.css";

const Sidebar: React.FC<SidebarProps> = () => {
  // auth = must be logged in to use otherwise use login modal
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
      auth: true,
    },
    {
      icon: BsListUl,
      label: "watchlist",
      href: "/watchlist",
      auth: true,
    },
    {
      icon: IoMdSettings,
      label: "settings",
      href: `/users/settings/`,
      auth: true,
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
            auth={item.auth}
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
