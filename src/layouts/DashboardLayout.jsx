import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProductsIcon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import CustomersIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/CheckCircle';
import AlertIcon from '@mui/icons-material/Error';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Products', path: '/products', icon: <ProductsIcon /> },
  { label: 'Categories', path: '/categories', icon: <CategoryIcon /> },
  { label: 'Orders', path: '/orders', icon: <OrdersIcon /> },
  { label: 'Customers', path: '/customers', icon: <CustomersIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile Drawer State
  const [mobileOpen, setMobileOpen] = useState(false);

  // User Profile Menu State
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // Notification Popover State
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      detail: 'Order #ORD-7294 from Sarah Jenkins ($189.50)',
      time: '5 min ago',
      unread: true,
      type: 'order',
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      detail: 'Sony WH-1000XM5 has only 3 units remaining',
      time: '42 min ago',
      unread: true,
      type: 'alert',
    },
    {
      id: 3,
      title: 'Monthly Revenue Goal Met',
      detail: 'Store crossed $80,000 in monthly sales!',
      time: '2 hours ago',
      unread: true,
      type: 'success',
    },
  ]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          px: 3,
          py: 2.75,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)',
          }}
        >
          <StorefrontIcon sx={{ fontSize: 22 }} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.05rem',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                color: '#0f172a',
              }}
            >
              AuraStore
            </Typography>
            <Chip
              label="PRO"
              size="small"
              sx={{
                height: 18,
                fontSize: '0.625rem',
                fontWeight: 700,
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                color: '#1e40af',
                px: 0.25,
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontSize: '0.75rem',
              display: 'block',
              mt: 0.25,
            }}
          >
            Admin Management
          </Typography>
        </Box>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ px: 2, py: 2.5, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1.5,
            display: 'block',
            fontWeight: 700,
            fontSize: '0.6875rem',
            color: '#94a3b8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Main Menu
        </Typography>

        <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/dashboard' && location.pathname === '/');

            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    borderRadius: '8px',
                    px: 1.75,
                    py: 1.1,
                    backgroundColor: isActive
                      ? 'rgba(30, 64, 175, 0.08)'
                      : 'transparent',
                    color: isActive ? '#1e40af' : '#475569',
                    position: 'relative',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      backgroundColor: isActive
                        ? 'rgba(30, 64, 175, 0.12)'
                        : 'rgba(241, 245, 249, 0.8)',
                      color: isActive ? '#1e40af' : '#0f172a',
                    },
                    '&::before': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '15%',
                          height: '70%',
                          width: '3.5px',
                          borderRadius: '0 4px 4px 0',
                          backgroundColor: '#1e40af',
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? '#1e40af' : '#64748b',
                      '& svg': {
                        fontSize: 20,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Drawer Footer Banner */}
      <Box sx={{ p: 2, m: 2, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TrendingUpIcon sx={{ fontSize: 18, color: '#10b981' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
            Store Performance
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mb: 1.5, lineHeight: 1.4 }}>
          Orders are up +12.5% this week. Keep up the great pace!
        </Typography>
        <Box
          sx={{
            height: 5,
            width: '100%',
            backgroundColor: '#e2e8f0',
            borderRadius: 99,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '82%',
              backgroundColor: '#1e40af',
              borderRadius: 99,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem' }}>
            Goal: $100k
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e40af', fontSize: '0.6875rem' }}>
            82%
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <CssBaseline />

      {/* Responsive Drawer Component */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
        aria-label="dashboard navigation"
      >
        {/* Temporary Drawer for Mobile & Tablets */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Improves performance on mobile devices
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Permanent Sidebar Drawer for Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid #e2e8f0',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: '#f4f6f8',
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #e2e8f0',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              minHeight: { xs: 64, md: 70 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Left: Hamburger Icon (Mobile) & Global Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, maxWidth: { md: 440 } }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: 'none' },
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1.5,
                  p: 0.75,
                }}
              >
                <MenuIcon sx={{ fontSize: 22 }} />
              </IconButton>

              {/* Search Bar with Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  px: 1.5,
                  py: 0.5,
                  width: '100%',
                  transition: 'all 0.2s ease',
                  '&:focus-within': {
                    borderColor: '#1e40af',
                    boxShadow: '0 0 0 3px rgba(30, 64, 175, 0.1)',
                    backgroundColor: '#ffffff',
                  },
                }}
              >
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />
                <InputBase
                  placeholder="Search products, orders, customers..."
                  sx={{
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    width: '100%',
                    '& input::placeholder': {
                      color: '#94a3b8',
                      opacity: 1,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    alignItems: 'center',
                    px: 0.85,
                    py: 0.2,
                    borderRadius: 1,
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                  }}
                >
                  ⌘K
                </Box>
              </Box>
            </Box>

            {/* Right: Notifications & User Avatar Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {/* Notification Bell with Badge */}
              <IconButton
                onClick={(e) => setNotificationAnchor(e.currentTarget)}
                sx={{
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  p: 1,
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    color: '#1e40af',
                  },
                }}
              >
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                  <NotificationsIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>

              {/* Notification Popover Menu */}
              <Popover
                open={Boolean(notificationAnchor)}
                anchorEl={notificationAnchor}
                onClose={() => setNotificationAnchor(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    width: 360,
                    maxWidth: '90vw',
                    mt: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                  },
                }}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Notifications
                    </Typography>
                    {unreadCount > 0 && (
                      <Chip label={`${unreadCount} new`} size="small" color="primary" sx={{ height: 20, fontSize: '0.6875rem' }} />
                    )}
                  </Box>
                  {unreadCount > 0 && (
                    <Button
                      size="small"
                      onClick={markAllNotificationsRead}
                      sx={{ fontSize: '0.75rem', textTransform: 'none', p: 0.5 }}
                    >
                      Mark all read
                    </Button>
                  )}
                </Box>
                <List sx={{ p: 0 }}>
                  {notifications.map((notif) => (
                    <ListItem
                      key={notif.id}
                      sx={{
                        p: 2,
                        borderBottom: '1px solid #f8fafc',
                        backgroundColor: notif.unread ? 'rgba(30, 64, 175, 0.03)' : '#ffffff',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 0.75,
                          borderRadius: 2,
                          backgroundColor:
                            notif.type === 'order'
                              ? 'rgba(30, 64, 175, 0.1)'
                              : notif.type === 'alert'
                              ? 'rgba(239, 68, 68, 0.1)'
                              : 'rgba(16, 185, 129, 0.1)',
                          color:
                            notif.type === 'order'
                              ? '#1e40af'
                              : notif.type === 'alert'
                              ? '#ef4444'
                              : '#10b981',
                          display: 'flex',
                        }}
                      >
                        {notif.type === 'alert' ? (
                          <AlertIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <CheckIcon sx={{ fontSize: 18 }} />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                          {notif.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.25 }}>
                          {notif.detail}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem', mt: 0.5, display: 'block' }}>
                          {notif.time}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Popover>

              <Divider orientation="vertical" flexItem sx={{ height: 28, my: 'auto', display: { xs: 'none', sm: 'block' } }} />

              {/* User Profile Avatar with Menu */}
              <Box
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  cursor: 'pointer',
                  p: 0.5,
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#10b981',
                      border: '2px solid #ffffff',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Avatar
                    alt="Alex Rivera"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    sx={{ width: 38, height: 38, border: '2px solid #e2e8f0' }}
                  >
                    AR
                  </Avatar>
                </Badge>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.2, color: '#0f172a' }}
                  >
                    Alex Rivera
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                    Store Administrator
                  </Typography>
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#94a3b8', fontSize: 18, display: { xs: 'none', sm: 'block' } }} />
              </Box>

              {/* User Dropdown Menu */}
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={() => setUserMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    width: 210,
                    mt: 1.5,
                    borderRadius: 2.5,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Alex Rivera
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', wordBreak: 'break-all' }}>
                    alex.rivera@aurastore.com
                  </Typography>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate('/settings');
                  }}
                  sx={{ py: 1, fontSize: '0.875rem' }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: '#64748b' }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate('/settings');
                  }}
                  sx={{ py: 1, fontSize: '0.875rem' }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: '#64748b' }}>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Account Settings
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={() => setUserMenuAnchor(null)}
                  sx={{ py: 1, fontSize: '0.875rem', color: '#ef4444' }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: '#ef4444' }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Log Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Outlet Wrapped by Layout */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: 1600,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
