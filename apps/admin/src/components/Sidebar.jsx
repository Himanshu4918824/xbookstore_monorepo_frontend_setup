import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { animate } from "motion";

// --- ICONS ---
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ReviewsIcon from "@mui/icons-material/Reviews";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InventoryIcon from '@mui/icons-material/Inventory';

const OPEN_DRAWER_WIDTH = 260;
const CLOSED_DRAWER_WIDTH = 75;

const menuItems = {
  Management: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Books", icon: <BookIcon />, path: "/admin/books" },
    { text: "Stock", icon: <InventoryIcon />, path: "/admin/stock" },
    { text: "Authors", icon: <PeopleIcon />, path: "/admin/authors" },
    { text: "Publications", icon: <PeopleIcon />, path: "/admin/publications" },
  ],
  Promotions: [
    {
      text: "Featured Books",
      icon: <StarIcon />,
      path: "/admin/featured-books",
    },
    {
      text: "Book of the Month",
      icon: <WorkspacePremiumIcon />,
      path: "/admin/book-of-the-month",
    },
  ],
  Operations: [
    { text: "Moderate Reviews", icon: <ReviewsIcon />, path: "/admin/reviews" },
    {
      text: "Manage Coupons",
      icon: <ConfirmationNumberIcon />,
      path: "/admin/coupons",
    },
  ],
};

const Sidebar = ({ open, setOpen }) => {
  const theme = useTheme();
  const drawerPaperRef = useRef(null);

  useEffect(() => {
    if (drawerPaperRef.current) {
      const newWidth = open ? OPEN_DRAWER_WIDTH : CLOSED_DRAWER_WIDTH;

      animate(
        drawerPaperRef.current,
        { width: newWidth },
        {
          type: "spring",
          stiffness: 350,
          damping: 22,
        }
      );
    }
  }, [open]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? OPEN_DRAWER_WIDTH : CLOSED_DRAWER_WIDTH,
        "& .MuiDrawer-paper": {
          width: OPEN_DRAWER_WIDTH,
          boxSizing: "border-box",
          overflow: "hidden",
          top: theme.spacing(2),
          left: theme.spacing(2),
          height: `calc(100% - ${theme.spacing(4)})`,
          borderRadius: "1rem",
          border: "none",
          // --- THE FIX IS HERE ---
          // Instead of a hardcoded color, we use the theme's paper color.
          // This will be white in light mode and dark gray in dark mode automatically.
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
        },
      }}
      PaperProps={{ ref: drawerPaperRef }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: 2.5,
          py: 2,
          flexShrink: 0,
        }}
      >
        {open && (
          <Typography variant="h6" fontWeight="bold">
            Xoffencer
          </Typography>
        )}
        <IconButton onClick={() => setOpen(!open)}>
          {open ? (
            <ArrowBackIosNewIcon fontSize="small" />
          ) : (
            <ArrowForwardIosIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Divider sx={{ mx: 2 }} />

      <Box
        sx={{ p: 1, overflowY: open ? "auto" : "hidden", overflowX: "hidden" }}
      >
        {Object.keys(menuItems).map((sectionTitle) => (
          <List
            key={sectionTitle}
            subheader={
              open && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    fontWeight: "bold",
                    color: "text.secondary",
                  }}
                >
                  {sectionTitle}
                </Typography>
              )
            }
          >
            {menuItems[sectionTitle].map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                component={NavLink}
                to={item.path}
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&.active > .MuiListItemButton-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    borderRadius: "0.5rem",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    },
                  },
                }}
              >
                <Tooltip title={open ? "" : item.text} placement="right">
                  <ListItemButton
                    sx={{
                      borderRadius: "0.5rem",
                      minHeight: 48,
                      justifyContent: "center",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        sx={{ whiteSpace: "nowrap" }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        ))}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
