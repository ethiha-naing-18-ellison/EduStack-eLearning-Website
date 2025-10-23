import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Categories', href: '/categories' },
    { label: 'Instructors', href: '/instructors' },
    { label: 'My Courses', href: '/mycourses' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

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
        <ListItem>
          <Button variant="outlined" sx={{ mr: 1 }} component={Link} to="/auth">Sign Up</Button>
          <Button variant="contained" component={Link} to="/auth">Login</Button>
        </ListItem>
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="primary" component={Link} to="/auth">
                  Sign Up
                </Button>
                <Button variant="contained" color="primary" component={Link} to="/auth">
                  Login
                </Button>
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
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
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
