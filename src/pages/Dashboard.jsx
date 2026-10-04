import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import SalesIcon from '@mui/icons-material/ShoppingBag';
import OrdersIcon from '@mui/icons-material/ReceiptLong';
import CustomersIcon from '@mui/icons-material/People';
import RevenueIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ExportIcon from '@mui/icons-material/FileDownload';
import ViewIcon from '@mui/icons-material/Visibility';
import DeliveredIcon from '@mui/icons-material/CheckCircle';
import ShippedIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/AccessTime';
import CancelledIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Mock data for Summary Cards
const SUMMARY_CARDS = [
  {
    id: 'sales',
    title: 'Total Sales',
    value: '$128,430',
    change: '+12.5%',
    isPositive: true,
    comparison: 'vs last month',
    subtitle: '4,320 units sold',
    icon: <SalesIcon sx={{ fontSize: 26, color: '#1e40af' }} />,
    iconBg: 'rgba(30, 64, 175, 0.1)',
  },
  {
    id: 'orders',
    title: 'New Orders',
    value: '1,429',
    change: '+8.2%',
    isPositive: true,
    comparison: 'vs last month',
    subtitle: '94% fulfilled',
    icon: <OrdersIcon sx={{ fontSize: 26, color: '#0284c7' }} />,
    iconBg: 'rgba(2, 132, 199, 0.1)',
  },
  {
    id: 'customers',
    title: 'Total Customers',
    value: '9,842',
    change: '+14.1%',
    isPositive: true,
    comparison: 'vs last month',
    subtitle: '840 new this month',
    icon: <CustomersIcon sx={{ fontSize: 26, color: '#6366f1' }} />,
    iconBg: 'rgba(99, 102, 241, 0.1)',
  },
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '$84,210',
    change: '+6.4%',
    isPositive: true,
    comparison: 'vs last month',
    subtitle: '+$5,100 above goal',
    icon: <RevenueIcon sx={{ fontSize: 26, color: '#10b981' }} />,
    iconBg: 'rgba(16, 185, 129, 0.1)',
  },
];

// Mock data for Recent Orders Table
const INITIAL_ORDERS = [
  {
    id: '#ORD-7294',
    customer: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 04, 2026',
    time: '11:42 AM',
    amount: 189.50,
    items: 2,
    status: 'Delivered',
    paymentMethod: 'Credit Card (**** 4242)',
  },
  {
    id: '#ORD-7293',
    customer: 'Marcus Vance',
    email: 'm.vance@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 04, 2026',
    time: '10:15 AM',
    amount: 549.00,
    items: 1,
    status: 'Shipped',
    paymentMethod: 'PayPal',
  },
  {
    id: '#ORD-7292',
    customer: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 03, 2026',
    time: '04:30 PM',
    amount: 82.20,
    items: 3,
    status: 'Pending',
    paymentMethod: 'Apple Pay',
  },
  {
    id: '#ORD-7291',
    customer: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 03, 2026',
    time: '01:10 PM',
    amount: 1240.00,
    items: 4,
    status: 'Delivered',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: '#ORD-7290',
    customer: 'Chloe Bennett',
    email: 'chloe.b@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 02, 2026',
    time: '09:20 AM',
    amount: 310.45,
    items: 2,
    status: 'Pending',
    paymentMethod: 'Credit Card (**** 9104)',
  },
  {
    id: '#ORD-7289',
    customer: 'Liam Henderson',
    email: 'liam.h@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 01, 2026',
    time: '03:55 PM',
    amount: 65.00,
    items: 1,
    status: 'Cancelled',
    paymentMethod: 'Credit Card (**** 1120)',
  },
];

// Revenue monthly chart simulation data
const REVENUE_DATA = [
  { month: 'May', revenue: 52000, orders: 840 },
  { month: 'Jun', revenue: 61000, orders: 990 },
  { month: 'Jul', revenue: 58000, orders: 940 },
  { month: 'Aug', revenue: 74000, orders: 1220 },
  { month: 'Sep', revenue: 79000, orders: 1310 },
  { month: 'Oct', revenue: 84210, orders: 1429, active: true },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30_days');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Chip Rendering Helper
  const renderStatusChip = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <Chip
            icon={<DeliveredIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
            label="Delivered"
            size="small"
            sx={{
              backgroundColor: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      case 'Shipped':
        return (
          <Chip
            icon={<ShippedIcon sx={{ fontSize: '14px !important', color: '#1d4ed8 !important' }} />}
            label="Shipped"
            size="small"
            sx={{
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      case 'Pending':
        return (
          <Chip
            icon={<PendingIcon sx={{ fontSize: '14px !important', color: '#b45309 !important' }} />}
            label="Pending"
            size="small"
            sx={{
              backgroundColor: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      case 'Cancelled':
        return (
          <Chip
            icon={<CancelledIcon sx={{ fontSize: '14px !important', color: '#dc2626 !important' }} />}
            label="Cancelled"
            size="small"
            sx={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    if (statusFilter === 'ALL') return true;
    return order.status === statusFilter;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3.5 } }}>
      {/* 1. Header Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Welcome back! Monitor real-time sales performance, orders, and customer activity.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            size="small"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 2,
              minWidth: 140,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#0f172a',
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="7_days">Last 7 Days</MenuItem>
            <MenuItem value="30_days">Last 30 Days</MenuItem>
            <MenuItem value="year">Year to Date</MenuItem>
          </Select>

          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{
              backgroundColor: '#ffffff',
              borderColor: '#e2e8f0',
              color: '#0f172a',
              borderRadius: 2,
              px: 2,
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* 2. Four Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {SUMMARY_CARDS.map((card) => (
          <Card
            key={card.id}
            sx={{
              borderRadius: 3.5,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              p: 2.5,
              boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                }}
              >
                {card.title}
              </Typography>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  backgroundColor: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.65rem', md: '1.85rem' },
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              {card.value}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.35,
                  borderRadius: 1.5,
                  backgroundColor: card.isPositive ? '#ecfdf5' : '#fef2f2',
                  color: card.isPositive ? '#059669' : '#dc2626',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {card.isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 15 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 15 }} />
                )}
                {card.change}
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                {card.comparison}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* 3. Middle Section: Revenue Overview Chart & Sales Channels */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: { xs: 2.5, md: 3 },
        }}
      >
        {/* Revenue Performance Chart Card */}
        <Card
          sx={{
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            p: 3,
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
                Revenue & Sales Trajectory
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Monthly gross revenue vs target
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#1e40af' }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Revenue
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Target
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Responsive CSS Bar Chart */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 200,
              pt: 2,
              pb: 1,
              px: { xs: 1, sm: 3 },
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            {REVENUE_DATA.map((item) => {
              const maxRev = 90000;
              const barHeightPct = Math.round((item.revenue / maxRev) * 100);

              return (
                <Box
                  key={item.month}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    width: { xs: 36, sm: 48 },
                  }}
                >
                  <Tooltip title={`$${item.revenue.toLocaleString()} (${item.orders} orders)`} arrow>
                    <Box
                      sx={{
                        width: '100%',
                        height: `${barHeightPct}%`,
                        backgroundColor: item.active ? '#1e40af' : 'rgba(30, 64, 175, 0.25)',
                        borderRadius: '6px 6px 2px 2px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: '#1e40af',
                          transform: 'scaleY(1.04)',
                        },
                      }}
                    />
                  </Tooltip>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: item.active ? 700 : 500,
                      color: item.active ? '#1e40af' : '#64748b',
                      fontSize: '0.75rem',
                    }}
                  >
                    {item.month}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2.5, pt: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Average Order Value
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                $89.42
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Conversion Rate
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#059669' }}>
                3.84% (+0.4%)
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Refund Rate
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                1.12%
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Top Product Categories Card */}
        <Card
          sx={{
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            p: 3,
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', mb: 0.5 }}>
              Category Share
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 3 }}>
              Sales volume by catalog category
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {[
                { label: 'Electronics & Audio', percentage: 44, amount: '$56,500', color: '#1e40af' },
                { label: 'Apparel & Fashion', percentage: 28, amount: '$35,950', color: '#6366f1' },
                { label: 'Footwear & Athletic', percentage: 18, amount: '$23,100', color: '#0284c7' },
                { label: 'Accessories', percentage: 10, amount: '$12,880', color: '#10b981' },
              ].map((category) => (
                <Box key={category.label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }}>
                      {category.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#64748b' }}>
                      {category.amount} ({category.percentage}%)
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 6,
                      width: '100%',
                      backgroundColor: '#f1f5f9',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                        borderRadius: 99,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/products')}
            sx={{
              mt: 3,
              color: '#1e40af',
              fontWeight: 600,
              fontSize: '0.8125rem',
              justifyContent: 'flex-start',
              px: 0,
            }}
          >
            View full inventory breakdown
          </Button>
        </Card>
      </Box>

      {/* 4. Recent Orders Table Card */}
      <Card
        sx={{
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header & Status Filter Bar */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#0f172a' }}>
              Recent Orders
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem', mt: 0.25 }}>
              Live customer transactions and fulfillment statuses
            </Typography>
          </Box>

          {/* Quick Filter Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {['ALL', 'Delivered', 'Shipped', 'Pending', 'Cancelled'].map((status) => (
              <Chip
                key={status}
                label={status === 'ALL' ? 'All Orders' : status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? 'filled' : 'outlined'}
                color={statusFilter === status ? 'primary' : 'default'}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  borderColor: statusFilter === status ? '#1e40af' : '#e2e8f0',
                  backgroundColor: statusFilter === status ? '#1e40af' : '#ffffff',
                  color: statusFilter === status ? '#ffffff' : '#64748b',
                  '&:hover': {
                    backgroundColor: statusFilter === status ? '#1d4ed8' : '#f8fafc',
                  },
                }}
              />
            ))}

            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/orders')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                ml: { sm: 1 },
                fontSize: '0.75rem',
                borderRadius: 2,
                borderColor: '#e2e8f0',
                color: '#1e40af',
                '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
              }}
            >
              See All
            </Button>
          </Box>
        </Box>

        {/* Responsive Table */}
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Order ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                    No orders found matching the filter "{statusFilter}".
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: '#f8fafc' },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Order ID */}
                    <TableCell sx={{ pl: 3, fontWeight: 700, color: '#1e40af' }}>
                      {row.id}
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={row.avatar}
                          alt={row.customer}
                          sx={{ width: 34, height: 34, border: '1px solid #e2e8f0' }}
                        >
                          {row.customer.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', lineHeight: 1.2 }}
                          >
                            {row.customer}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a', fontSize: '0.8125rem' }}>
                        {row.date}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem' }}>
                        {row.time}
                      </Typography>
                    </TableCell>

                    {/* Amount */}
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                        ${row.amount.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem' }}>
                        {row.items} {row.items === 1 ? 'item' : 'items'}
                      </Typography>
                    </TableCell>

                    {/* Status Chip */}
                    <TableCell align="center">
                      {renderStatusChip(row.status)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Tooltip title="View order details" arrow>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedOrder(row)}
                          sx={{
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: 1.5,
                            '&:hover': { color: '#1e40af', backgroundColor: 'rgba(30, 64, 175, 0.08)' },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Order Detail Modal Dialog */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Order Details
                </Typography>
                <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>
                  {selectedOrder.id}
                </Typography>
              </Box>
              {renderStatusChip(selectedOrder.status)}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={selectedOrder.avatar} sx={{ width: 44, height: 44 }}>
                  {selectedOrder.customer.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedOrder.customer}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                    {selectedOrder.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Date Placed:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedOrder.date} at {selectedOrder.time}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Payment:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedOrder.paymentMethod}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Items Count:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedOrder.items} item(s)</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total Paid:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e40af' }}>
                    ${selectedOrder.amount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedOrder(null)} variant="outlined">
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedOrder(null);
                  navigate('/orders');
                }}
              >
                Manage Full Order
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
