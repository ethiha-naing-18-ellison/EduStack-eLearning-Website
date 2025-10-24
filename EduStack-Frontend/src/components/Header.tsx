import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  School,
  Category,
  Person,
  Info,
  ContactMail
} from '@mui/icons-material';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Home', href: '/' },
      { label: 'Categories', href: '/categories' },
      { label: 'Instructors', href: '/instructors' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ];

    if (user?.role === 'INSTRUCTOR') {
      return [
        ...baseItems,
        { label: 'Manage Courses', href: '/instructor-courses' },
        { label: 'My Students', href: '/my-students' }
      ];
    } else {
      return [
        ...baseItems,
        { label: 'Courses', href: '/courses' },
        { label: 'My Courses', href: '/mycourses' }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
        EduStack
      </Typography>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.label} component={NavLink} to={item.href}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated ? (
          <ListItem>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {user?.fullName}!
            </Typography>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </ListItem>
        ) : (
          <ListItem>
            <Button variant="outlined" sx={{ mr: 1 }} component={Link} to="/auth">Sign Up</Button>
            <Button variant="contained" component={Link} to="/auth">Login</Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}
          >
            EduStack
          </Typography>

          {!isMobile ? (
            <>
              <Box sx={{ display: 'flex', gap: 4, mr: 4 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    component={NavLink}
                    to={item.href}
                    sx={{ 
                      color: 'text.primary', 
                      textTransform: 'none',
                      '&.active': {
                        color: 'primary.main',
                        fontWeight: 'bold',
                        borderBottom: '2px solid',
                        borderBottomColor: 'primary.main'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {isAuthenticated ? (
                  <>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      Welcome, {user?.fullName}!
                    </Typography>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls="primary-search-account-menu"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" color="primary" component={Link} to="/auth">
                      Sign Up
                    </Button>
                    <Button variant="contained" color="primary" component={Link} to="/auth">
                      Login
                    </Button>
                  </>
                )}
              </Box>
            </>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>My Courses</MenuItem>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
