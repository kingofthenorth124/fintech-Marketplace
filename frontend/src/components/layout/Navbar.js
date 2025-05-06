import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Fintech Marketplace
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Button color="inherit" component={RouterLink} to="/products">
            Products
          </Button>
          <Button color="inherit" component={RouterLink} to="/services">
            Services
          </Button>
          <Button color="inherit" component={RouterLink} to="/suppliers">
            Suppliers
          </Button>
        </Box>

        <IconButton
          color="inherit"
          component={RouterLink}
          to="/checkout"
          sx={{ ml: 1 }}
        >
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {currentUser ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={RouterLink}
                to="/profile"
                onClick={handleMenuClose}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}

        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            component={RouterLink}
            to="/products"
            onClick={handleMenuClose}
          >
            Products
          </MenuItem>
          <MenuItem
            component={RouterLink}
            to="/services"
            onClick={handleMenuClose}
          >
            Services
          </MenuItem>
          <MenuItem
            component={RouterLink}
            to="/suppliers"
            onClick={handleMenuClose}
          >
            Suppliers
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 