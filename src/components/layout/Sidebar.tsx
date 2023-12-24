import React from "react";

import { BsHouseFill, BsListUl } from "react-icons/bs";
import { IoMdAddCircleOutline, IoMdSettings } from "react-icons/io";
import { MdManageSearch, MdOutlineInsertChart } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import { SidebarProps } from "./types";
import { FaUncharted } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";
import { usePortfolios } from "../../context/PortfoliosContext";
import { useWatchlists } from "../../context/WatchlistContext";

const Sidebar: React.FC<SidebarProps> = () => {
  const { user } = useAuth();
  const { portfolios } = usePortfolios();
  const { watchlists } = useWatchlists();
  const auth = !!user;
  const topItems = [
    {
      icon: BsHouseFill,
      label: "Home",
      href: "/",
      auth: true, // We dont want to be rerouted to login if click home
    },
    {
      icon: MdManageSearch,
      label: "Market Trends",
      href: "/market-trends/indexes",
      auth: true, //does not require user signed in
    },
  ];
  const bottomItems = [
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
  console.log(portfolios, watchlists);
  return (
    <>
      <span className="logo-side">
        {" "}
        <FaUncharted size={24} />
        <span>Finhub</span>
      </span>
      <div className="sidebar-items">
        {topItems.map((item) => (
          <SidebarItem
            key={item.href}
            auth={auth}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
        <div className="divider"></div>
        <li className="sidebar-heading">
          <div className="sidebar-heading-label">Portfolios</div>
          <div className="sidebar-heading-icon">
            <div className="inner-icon">
              <IoMdAddCircleOutline size={24} />
            </div>
          </div>
        </li>
        {portfolios.map((p) => (
          <li key={p.id} className="sidebar-item">
            <div className="sidebar-button-icon">
              <MdOutlineInsertChart size={24} />
            </div>
            <div className="sidebar-button-label">{p.title}</div>
          </li>
        ))}

        <li className="sidebar-heading">
          <div className="sidebar-heading-label">Watchlists</div>
          <div className="sidebar-heading-icon">
            <div className="inner-icon">
              <IoMdAddCircleOutline size={24} />
            </div>
          </div>
        </li>
        {watchlists.map((w) => (
          <li key={w.id} className="sidebar-item">
            <div className="sidebar-button-icon">
              <MdOutlineInsertChart size={24} />
            </div>
            <div className="sidebar-button-label">{w.title}</div>
          </li>
        ))}
        <div className="divider"></div>
        {bottomItems.map((item) => (
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
