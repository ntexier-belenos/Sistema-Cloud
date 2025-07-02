import {
  AccountCircle,
  Assessment as AssessmentIcon,
  BugReport as BugReportIcon,
  DarkMode as DarkModeIcon,
  Dashboard as DashboardIcon,
  Engineering as EngineeringIcon,
  LibraryBooks as LibraryBooksIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  NoteAlt as NoteAltIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DataProvider } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';

const drawerWidth = 240;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Main navigation items
  const mainNavItems: NavItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Projects', icon: <LibraryBooksIcon />, path: '/projects' },
    { text: 'Machines', icon: <EngineeringIcon />, path: '/machines' },
    { text: 'Safety Functions', icon: <ShieldIcon />, path: '/safety-functions' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Component Library', icon: <LibraryBooksIcon />, path: '/components' },
    { text: 'Data Debug', icon: <BugReportIcon />, path: '/debug' },
  ];

  // Documentation link that will be positioned at the bottom
  const documentationItem: NavItem = { text: 'Documentation', icon: <NoteAltIcon />, path: '/docs' };

  // Combine all nav items for the app bar title
  const allNavItems = [...mainNavItems, documentationItem];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          Sistema-Cloud
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {mainNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation(documentationItem.path)}>
            <ListItemIcon>{documentationItem.icon}</ListItemIcon>
            <ListItemText primary={documentationItem.text} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {allNavItems.find((item) => window.location.pathname.startsWith(item.path))?.text || 'Dashboard'}
          </Typography>
          
          <Tooltip title={isDarkMode ? 'Light mode' : 'Dark mode'}>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {user?.firstName ? (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {`${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {user && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1">{`${user.firstName} ${user.lastName || ''}`}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              )}
              <Divider />
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Settings</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {/* Wrapping the Outlet in DataProvider to ensure all protected routes have access to data */}
        <DataProvider>
          <Outlet />
        </DataProvider>
      </Box>
    </Box>
  );
};

export default MainLayout;
