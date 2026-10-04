import { useState } from 'react';
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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewIcon from '@mui/icons-material/Visibility';
import DeliveredIcon from '@mui/icons-material/CheckCircle';
import ShippedIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/AccessTime';
import CancelledIcon from '@mui/icons-material/Cancel';
import ExportIcon from '@mui/icons-material/FileDownload';

const ORDERS_DATA = [
  {
    id: '#ORD-7294',
    customer: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 04, 2026',
    time: '11:42 AM',
    items: ['Sony WH-1000XM5', 'Desk Mat'],
    amount: 189.50,
    status: 'Delivered',
    payment: 'Credit Card',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR',
  },
  {
    id: '#ORD-7293',
    customer: 'Marcus Vance',
    email: 'm.vance@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 04, 2026',
    time: '10:15 AM',
    items: ['Apple Watch Series 9 GPS'],
    amount: 549.00,
    status: 'Shipped',
    payment: 'PayPal',
    shippingAddress: '120 Broadway Ave, New York, NY',
  },
  {
    id: '#ORD-7292',
    customer: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 03, 2026',
    time: '04:30 PM',
    items: ['Minimalist Leather Desk Pad', 'USB-C Cable'],
    amount: 82.20,
    status: 'Pending',
    payment: 'Apple Pay',
    shippingAddress: '450 North Beach Rd, Miami, FL',
  },
  {
    id: '#ORD-7291',
    customer: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 03, 2026',
    time: '01:10 PM',
    items: ['Keychron Q1 Pro Keyboard', 'Logitech MX Master 3S'],
    amount: 1240.00,
    status: 'Delivered',
    payment: 'Stripe Direct',
    shippingAddress: '88 Market Street, San Francisco, CA',
  },
  {
    id: '#ORD-7290',
    customer: 'Chloe Bennett',
    email: 'chloe.b@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 02, 2026',
    time: '09:20 AM',
    items: ['Nike Air Zoom Pegasus 40'],
    amount: 310.45,
    status: 'Pending',
    payment: 'Credit Card',
    shippingAddress: '312 Elm Street, Austin, TX',
  },
  {
    id: '#ORD-7289',
    customer: 'Liam Henderson',
    email: 'liam.h@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    date: 'Oct 01, 2026',
    time: '03:55 PM',
    items: ['Patagonia Nano Puff Jacket'],
    amount: 65.00,
    status: 'Cancelled',
    payment: 'Credit Card',
    shippingAddress: '15 High St, Seattle, WA',
  },
];

export default function Orders() {
  const [orders, setOrders] = useState(ORDERS_DATA);
  const [tabValue, setTabValue] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = tabValue === 'ALL' || order.status === tabValue;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <Chip
            icon={<DeliveredIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
            label="Delivered"
            size="small"
            sx={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontWeight: 600 }}
          />
        );
      case 'Shipped':
        return (
          <Chip
            icon={<ShippedIcon sx={{ fontSize: '14px !important', color: '#1d4ed8 !important' }} />}
            label="Shipped"
            size="small"
            sx={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 600 }}
          />
        );
      case 'Pending':
        return (
          <Chip
            icon={<PendingIcon sx={{ fontSize: '14px !important', color: '#b45309 !important' }} />}
            label="Pending"
            size="small"
            sx={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontWeight: 600 }}
          />
        );
      case 'Cancelled':
        return (
          <Chip
            icon={<CancelledIcon sx={{ fontSize: '14px !important', color: '#dc2626 !important' }} />}
            label="Cancelled"
            size="small"
            sx={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 600 }}
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Page Header */}
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
            Orders
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Track fulfillments, view customer shipments, and update order statuses.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          sx={{
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            color: '#0f172a',
            borderRadius: 2,
            px: 2,
          }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Main Table Card */}
      <Card
        sx={{
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Tabs & Search Controls */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                minWidth: 'auto',
                px: 2,
              },
            }}
          >
            <Tab label="All Orders" value="ALL" />
            <Tab label="Pending" value="Pending" />
            <Tab label="Shipped" value="Shipped" />
            <Tab label="Delivered" value="Delivered" />
            <Tab label="Cancelled" value="Cancelled" />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { md: 280 } }}
          />
        </Box>

        {/* Orders Table */}
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                    No orders match your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                    <TableCell sx={{ pl: 3, fontWeight: 700, color: '#1e40af' }}>
                      {order.id}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={order.avatar} alt={order.customer} sx={{ width: 32, height: 32 }}>
                          {order.customer.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            {order.customer}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {order.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                        {order.date}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {order.time}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8125rem' }}>
                        {order.payment}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        ${order.amount.toFixed(2)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      {renderStatusBadge(order.status)}
                    </TableCell>

                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Tooltip title="View order details" arrow>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedOrder(order)}
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

      {/* Order Details Modal */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Order {selectedOrder.id}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Placed on {selectedOrder.date} at {selectedOrder.time}
                </Typography>
              </Box>
              {renderStatusBadge(selectedOrder.status)}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedOrder.avatar} sx={{ width: 44, height: 44 }}>
                  {selectedOrder.customer.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {selectedOrder.customer}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {selectedOrder.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Shipping Address
                </Typography>
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  {selectedOrder.shippingAddress}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Items in this order:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedOrder.items.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 1.5,
                        border: '1px solid #f1f5f9',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Qty: 1
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Update Status</InputLabel>
                  <Select
                    label="Update Status"
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    Total Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e40af' }}>
                    ${selectedOrder.amount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
              <Button onClick={() => setSelectedOrder(null)} variant="outlined">
                Done
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
