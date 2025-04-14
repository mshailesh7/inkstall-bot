import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";

// Fixed width for the sidebar
const SIDEBAR_WIDTH = 280;

const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define menu items
  const menuItems = [
    {
      icon: <DashboardIcon />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <MenuBookIcon />,
      label: "Subjects & Books",
      path: "/subjects",
    },
    {
      icon: <AssignmentIcon />,
      label: "Paper Generator",
      path: "/generator",
    },
    {
      icon: <LibraryBooksIcon />,
      label: "Paper Library",
      path: "/library",
    },
    {
      icon: <CheckCircleOutlineIcon />,
      label: "Corrections",
      path: "/corrections",
    },
  ];

  // Settings item at the bottom
  const settingsItem = {
    icon: <SettingsIcon />,
    label: "Settings",
    path: "/settings",
  };

  // Sidebar content
  const sidebarContent = (
    <Box
      sx={{
        width: "auto", // Remove fixed width
        display: "flex",
        flexDirection: "column",
        padding: 2,
        height: "100%",
        bgcolor: "white",
      }}
    >
      {/* Logo */}
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#8bc4ff",
          mb: 4,
          mt: 2,
        }}
      >
        LOGO
      </Typography>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <Button
          key={item.path}
          startIcon={item.icon}
          onClick={() => {
            navigate(item.path);
            if (window.innerWidth < 960) {
              onToggle();
            }
          }}
          sx={{
            justifyContent: "flex-start",
            p: "12px 16px",
            mb: 1,
            borderRadius: 2,
            bgcolor:
              location.pathname === item.path ? "#c3e0ff" : "transparent",
            color: location.pathname === item.path ? "#1976d2" : "text.primary",
            "&:hover": {
              bgcolor: location.pathname === item.path ? "#d1e8ff" : "#f5f5f5",
            },
          }}
        >
          {item.label}
        </Button>
      ))}

      <Box sx={{ flexGrow: 1 }} />

      {/* Settings Button */}
      <Button
        startIcon={settingsItem.icon}
        onClick={() => {
          navigate(settingsItem.path);
          if (window.innerWidth < 960) {
            onToggle();
          }
        }}
        sx={{
          justifyContent: "flex-start",
          p: "12px 16px",
          borderRadius: 2,
          mb: 2,
          bgcolor:
            location.pathname === settingsItem.path ? "#c3e0ff" : "transparent",
          color:
            location.pathname === settingsItem.path
              ? "#1976d2"
              : "text.primary",
          "&:hover": {
            bgcolor:
              location.pathname === settingsItem.path ? "#d1e8ff" : "#f5f5f5",
          },
        }}
      >
        {settingsItem.label}
      </Button>
    </Box>
  );

  return (
    <>
      {/* Permanent sidebar for desktop */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: "auto",
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: "min(280px, 25%)", // Use responsive width
            boxSizing: "border-box",
            borderRight: "none",
            bgcolor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            top: "8px",
            height: "calc(100% - 16px)",
            borderRadius: "8px 0 0 8px",
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 1100,
            // Add CSS variable for the sidebar width that other components can reference
            // "--sidebar-width": "min(280px, 25%)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            // Make it flush at the top on mobile:
            top: 0,
            height: "100%",
            borderRadius: 0,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "min(280px, 80%)", // Responsive width for mobile
            boxSizing: "border-box",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            // Add the CSS variable for consistency
            // "--sidebar-width": "min(280px, 80%)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
