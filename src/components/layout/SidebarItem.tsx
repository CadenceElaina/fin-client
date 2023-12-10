import React, { useCallback } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { SidebarItemProps } from "./types";

//import useLoginModal
//import useCurrentUser
//import {BsDot} from "react-icons/bs"

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  href,
  auth,
  onClick,
}) => {
  const navigate = useNavigate();
  /*   const currentUser: boolean = true; */
  const handleClick = useCallback(() => {
    console.log("runs", auth);
    if (onClick && !auth) {
      console.log("runs our onclick");
      return onClick();
    }

    if (!auth) {
      navigate("/login");
    } else if (href) {
      console.log(href);
      if (href === "/") {
        window.location.reload();
      }
      navigate(`../${href}`);
    }
  }, [onClick, auth, href, navigate]);

  return (
    <ListItem key={label}>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <Icon size={28} color="white" />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem;
