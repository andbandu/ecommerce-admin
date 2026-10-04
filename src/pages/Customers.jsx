import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCustomerIcon from '@mui/icons-material/PersonAdd';
import StarIcon from '@mui/icons-material/Star';

const CUSTOMERS_DATA = [
  {
    id: 'CST-01',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    ordersCount: 14,
    totalSpent: 2840.50,
    tier: 'VIP',
    joinedDate: 'Jan 15, 2025',
  },
  {
    id: 'CST-02',
    name: 'Marcus Vance',
    email: 'm.vance@example.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    ordersCount: 8,
    totalSpent: 1420.00,
    tier: 'Regular',
    joinedDate: 'Mar 22, 2025',
  },
  {
    id: 'CST-03',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    ordersCount: 22,
    totalSpent: 4910.80,
    tier: 'VIP',
    joinedDate: 'Nov 04, 2024',
  },
  {
    id: 'CST-04',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 321-7654',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    ordersCount: 3,
    totalSpent: 540.00,
    tier: 'New',
    joinedDate: 'Aug 19, 2026',
  },
  {
    id: 'CST-05',
    name: 'Chloe Bennett',
    email: 'chloe.b@example.com',
    phone: '+1 (555) 654-3210',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    ordersCount: 11,
    totalSpent: 1980.20,
    tier: 'Regular',
    joinedDate: 'Feb 10, 2025',
  },
  {
    id: 'CST-06',
    name: 'Liam Henderson',
    email: 'liam.h@example.com',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    ordersCount: 1,
    totalSpent: 65.00,
    tier: 'New',
    joinedDate: 'Sep 29, 2026',
  },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = CUSTOMERS_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
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
            Customers
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Customer directory, loyalty tiers, lifetime spend, and contact channels.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddCustomerIcon />}
          sx={{
            backgroundColor: '#1e40af',
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontWeight: 600,
            '&:hover': { backgroundColor: '#1d4ed8' },
          }}
        >
          Add Customer
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
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
          <TextField
            size="small"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 360, width: '100%' }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align="center">Orders</TableCell>
                <TableCell align="right">Lifetime Value</TableCell>
                <TableCell align="center">Segment</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>Customer Since</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((c) => (
                <TableRow key={c.id} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell sx={{ pl: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={c.avatar} alt={c.name} sx={{ width: 38, height: 38, border: '1px solid #e2e8f0' }}>
                        {c.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                          {c.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          ID: {c.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#0f172a', fontSize: '0.8125rem' }}>
                      {c.email}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {c.phone}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {c.ordersCount}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      ${c.totalSpent.toFixed(2)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      icon={c.tier === 'VIP' ? <StarIcon sx={{ fontSize: '13px !important', color: '#b45309 !important' }} /> : undefined}
                      label={c.tier}
                      size="small"
                      sx={{
                        backgroundColor:
                          c.tier === 'VIP'
                            ? '#fef3c7'
                            : c.tier === 'Regular'
                            ? '#eff6ff'
                            : '#f1f5f9',
                        color:
                          c.tier === 'VIP'
                            ? '#b45309'
                            : c.tier === 'Regular'
                            ? '#1d4ed8'
                            : '#64748b',
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>

                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                      {c.joinedDate}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
