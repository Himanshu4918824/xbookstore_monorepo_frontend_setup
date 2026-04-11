import React, { useState } from "react"; // Import useState for menu state
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
// Import NavLink instead of Link
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../ui/ThemeToggleButton";

import { ShoppingCart, PersonOutline } from "@mui/icons-material"; // Import the cart icon
import { useCart } from "../../context/CartContext"; // Import our cart hook
import { useAuth } from "../../context/useAuth";
import { Particle } from '../ui/FrostedGlassPanel';
import { useTheme } from '@mui/material';

function Navbar() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const particles = Array.from({ length: 10 });
  // This is a style object we will apply to the active NavLink
  const activeLinkStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "4px",
  };
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const auth = useAuth();
  const navigate = useNavigate(); // Get the navigate function

  // --- STATE FOR THE USER MENU ---
  // We need to know where the menu should open. 'null' means it's closed.
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    auth.logout();
  };

  const handleMenuCloseAndNavigate = (path) => {
    setAnchorEl(null);
    navigate(path);
  };
  // --- END OF MENU STATE ---

  return (
    <AppBar
      position="sticky"
      sx={({ palette }) => ({
        backgroundColor: 'transparent', // transparent in both modes
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: 'none',
        borderBottom: `1px solid ${palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
      })}
    >
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {particles.map((_, index) => <Particle key={index} isDarkMode={isDarkMode} />)}
      </Box>
      <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 2 }}>
        <Typography
          variant="h6"
          component={NavLink} // Use NavLink for the title as well
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: '700',
            textDecoration: 'none',
            color: 'white',
            letterSpacing: 0.4,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Xoffencer Bookstore
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <ThemeToggleButton />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/*
            We now use NavLink for all our buttons.
            The 'style' prop can accept a function. React Router gives us an 'isActive' boolean.
            If isActive is true, we apply our activeLinkStyle; otherwise, we apply no extra style (undefined).
          */}
          <Button
            component={NavLink}
            to="/store"
            sx={{
              color: 'white',
            }}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Store
          </Button>
          <Button
            component={NavLink}
            to="/authors"
            sx={{ color: "white" }}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Authors
          </Button>
          <Button
            component={NavLink}
            to="/publications"
            sx={{ color: "white" }}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Publications
          </Button>
          <Button
            component={NavLink}
            to="/contact"
            sx={{ color: "white" }}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Contact us
          </Button>
          <Button
            component={NavLink}
            to="/about"
            sx={{ color: "white" }}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            About us
          </Button>
        </Box>

        {/* --- DYNAMIC USER ICON --- */}
        {auth.user ? (
          // If the user IS logged in, show the Avatar and Menu
          <>
            <IconButton onClick={handleMenuOpen} sx={{ ml: 1, '&:hover': { bgcolor: 'action.hover' } }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontWeight: 700 }}>
                {auth.user.firstName.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => handleMenuCloseAndNavigate("/dashboard/orders")}
              >
                My Account
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleMenuCloseAndNavigate("/affiliate/dashboard/overview")
                }
              >
                Affiliate Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          // If the user IS NOT logged in, show the Login Icon
          <IconButton
            component={NavLink}
            to="/login"
            size="large"
            sx={{ color: 'white', ml: 1, '&:hover': { color: 'primary.main' } }}
          >
            <PersonOutline />
          </IconButton>
        )}

        <IconButton
          component={NavLink}
          to="/cart"
          size="large"
          sx={{ color: 'white', ml: 1, '&:hover': { color: 'primary.main' } }}
        >
          <Badge badgeContent={totalItems} color="primary">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
