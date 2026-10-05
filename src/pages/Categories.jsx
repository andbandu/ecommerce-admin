import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
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
  Snackbar,
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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import TableViewIcon from '@mui/icons-material/TableRows';
import GridViewIcon from '@mui/icons-material/GridView';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import InventoryIcon from '@mui/icons-material/Inventory2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCategoryStore } from '../store/categoryStore';




const PRESET_COLORS = ['#1e40af', '#6366f1', '#0284c7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#0f172a'];

export default function Categories() {
  const navigate = useNavigate();
  const { 
    categories, 
    fetchCategories, 
    addCategory, 
    editCategory, 
    removeCategory 
  } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal dialog state (Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent: 'None (Top Level)',
    description: '',
    order: 1,
    status: 'Active',
    color: '#1e40af',
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Snackbar notifications
  // Snackbar notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Summary Metrics calculations
  const totalCategories = categories?.length || 0;
  const activeCount = (categories || []).filter((c) => c?.status === 'Active').length;
  const totalProducts = (categories || []).reduce((sum, c) => sum + (Number(c?.productCount) || 0), 0);

  // Helper to auto-generate URL slug from name
  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slug,
    }));
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      parent: 'None (Top Level)',
      description: '',
      order: (categories?.length || 0) + 1,
      status: 'Active',
      color: '#1e40af',
    });
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      parent: category.parent || 'None (Top Level)',
      description: category.description || '',
      order: category.order || 1,
      status: category.status || 'Active',
      color: category.color || '#1e40af',
    });
    setModalOpen(true);
  };

  // Submit Add / Edit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Category title is required', severity: 'error' });
      return;
    }

    if (editingId) {
      // 1. Update existing - Zustand 'editCategory' action
      const existing = (categories || []).find((c) => c.id === editingId) || {};
      editCategory(editingId, {
        ...existing,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        parent: formData.parent,
        description: formData.description,
        order: parseInt(formData.order, 10) || 1,
        status: formData.status,
        color: formData.color,
      });
      
      setSnackbar({ open: true, message: `Category "${formData.name}" updated successfully!`, severity: 'success' });
    } else {
      // 2. Create new - Zustand 'addCategory' action
      const created = {
        id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        parent: formData.parent,
        description: formData.description,
        productCount: 0,
        order: parseInt(formData.order, 10) || (categories?.length || 0) + 1,
        status: formData.status,
        color: formData.color,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
      };
      
      addCategory(created);
      setSnackbar({ open: true, message: `Category "${formData.name}" created successfully!`, severity: 'success' });
    }

    setModalOpen(false);
  };

  // Toggle Visibility status (Active <-> Hidden)
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Hidden' : 'Active';
    const existing = (categories || []).find((c) => c.id === id);

    if (existing) {
      editCategory(id, { ...existing, status: newStatus });
    } else {
      editCategory(id, { status: newStatus });
    }
      
    setSnackbar({
      open: true,
      message: `Category visibility updated to "${newStatus}"`,
      severity: 'info',
    });
  };

  // Delete Category
  const handleDeleteCategory = (id, name) => {
    removeCategory(id);
    setSnackbar({ open: true, message: `Category "${name}" deleted.`, severity: 'info' });
  };

  // Filtered & Sorted Categories (Safe handling against undefined fields)
  const filteredCategories = useMemo(() => {
    return (categories || [])
      .filter((c) => {
        if (!c) return false;
        const name = (c.name || '').toLowerCase();
        const slug = (c.slug || '').toLowerCase();
        const desc = (c.description || '').toLowerCase();
        const search = (searchTerm || '').toLowerCase();

        const matchesSearch =
          name.includes(search) ||
          slug.includes(search) ||
          desc.includes(search);
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'products') return (b.productCount || 0) - (a.productCount || 0);
        if (sortBy === 'order') return (a.order || 0) - (b.order || 0);
        return 0;
      });
  }, [categories, searchTerm, statusFilter, sortBy]);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Categories
            </Typography>
            <Chip
              label={`${totalCategories} Total`}
              size="small"
              sx={{
                backgroundColor: 'rgba(30, 64, 175, 0.08)',
                color: '#1e40af',
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Manage catalog taxonomy, navigation structures, and storefront category assignments.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
          sx={{
            backgroundColor: '#1e40af',
            color: '#ffffff',
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          }}
        >
          Add New Category
        </Button>
      </Box>

      {/* 2. Overview Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Total Categories
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e40af',
              }}
            >
              <CategoryIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
            {totalCategories}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Across all storefront channels
          </Typography>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Live in Navigation
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#059669', mb: 0.5 }}>
            {activeCount}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {totalCategories - activeCount} hidden / draft
          </Typography>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Catalog Products
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1',
              }}
            >
              <InventoryIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
            {totalProducts}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Assigned to taxonomy
          </Typography>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Top Performing
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, lineHeight: 1.3 }}>
            Electronics
          </Typography>
          <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
            34% of monthly sales
          </Typography>
        </Card>
      </Box>

      {/* 3. Search & Filter Bar */}
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Search Input */}
        <Box sx={{ flexGrow: 1, maxWidth: { md: 380 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search category title, slug, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Box>

        {/* Filter Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active Only</MenuItem>
              <MenuItem value="Hidden">Hidden Only</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="order">Display Priority</MenuItem>
              <MenuItem value="name">Title (A-Z)</MenuItem>
              <MenuItem value="products">Most Products</MenuItem>
            </Select>
          </FormControl>

          {/* Table / Grid View Toggle */}
          <Box sx={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <Tooltip title="Table View">
              <IconButton
                size="small"
                onClick={() => setViewMode('table')}
                sx={{
                  borderRadius: 0,
                  backgroundColor: viewMode === 'table' ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
                  color: viewMode === 'table' ? '#1e40af' : '#64748b',
                }}
              >
                <TableViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Grid View">
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                sx={{
                  borderRadius: 0,
                  backgroundColor: viewMode === 'grid' ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
                  color: viewMode === 'grid' ? '#1e40af' : '#64748b',
                }}
              >
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>

      {/* 4. Category Listing: Table or Grid */}
      {viewMode === 'table' ? (
        <Card
          sx={{
            borderRadius: 3.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 780 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 3 }}>Category</TableCell>
                  <TableCell>Slug / URL Path</TableCell>
                  <TableCell>Hierarchy</TableCell>
                  <TableCell align="center">Products</TableCell>
                  <TableCell align="center">Priority</TableCell>
                  <TableCell align="center">Visibility</TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                      No categories found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      {/* Category Title & Swatch */}
                      <TableCell sx={{ pl: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            variant="rounded"
                            src={cat.image}
                            alt={cat.name}
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2,
                              border: `2px solid ${cat.color}`,
                              backgroundColor: '#f8fafc',
                            }}
                          >
                            <CategoryIcon sx={{ color: cat.color }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}
                            >
                              {cat.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748b',
                                fontSize: '0.75rem',
                                display: 'block',
                                maxWidth: 260,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {cat.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Slug */}
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.35,
                            borderRadius: 1.5,
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: 'monospace',
                          }}
                        >
                          /{cat.slug}
                        </Box>
                      </TableCell>

                      {/* Hierarchy / Parent */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: '#475569' }}>
                          {cat.parent}
                        </Typography>
                      </TableCell>

                      {/* Products Count */}
                      <TableCell align="center">
                        <Chip
                          label={`${cat.productCount} items`}
                          size="small"
                          onClick={() => navigate('/products')}
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(30, 64, 175, 0.08)',
                            color: '#1e40af',
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'rgba(30, 64, 175, 0.16)' },
                          }}
                        />
                      </TableCell>

                      {/* Priority */}
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                          #{cat.order}
                        </Typography>
                      </TableCell>

                      {/* Visibility Status */}
                      <TableCell align="center">
                        <Chip
                          icon={
                            cat.status === 'Active' ? (
                              <CheckCircleIcon sx={{ fontSize: '13px !important', color: '#059669 !important' }} />
                            ) : (
                              <VisibilityOffIcon sx={{ fontSize: '13px !important', color: '#64748b !important' }} />
                            )
                          }
                          label={cat.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              cat.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                            color: cat.status === 'Active' ? '#059669' : '#64748b',
                            border: cat.status === 'Active' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title={cat.status === 'Active' ? 'Hide from store' : 'Publish to store'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleStatus(cat.id, cat.status)}
                              sx={{ color: '#64748b', '&:hover': { color: '#1e40af' } }}
                            >
                              {cat.status === 'Active' ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit category">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditModal(cat)}
                              sx={{ color: '#64748b', '&:hover': { color: '#1e40af' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete category">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        /* Grid View */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {filteredCategories.map((cat) => (
            <Card
              key={cat.id}
              sx={{
                borderRadius: 3.5,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 24px -6px rgba(0,0,0,0.08)',
                },
              }}
            >
              {/* Category Card Header with Color Strip */}
              <Box
                sx={{
                  height: 6,
                  width: '100%',
                  backgroundColor: cat.color,
                }}
              />

              <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Avatar
                      variant="rounded"
                      src={cat.image}
                      alt={cat.name}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        border: `1.5px solid ${cat.color}`,
                      }}
                    />
                    <Chip
                      label={cat.status}
                      size="small"
                      sx={{
                        backgroundColor: cat.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                        color: cat.status === 'Active' ? '#059669' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.5 }}>
                    {cat.name}
                  </Typography>

                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      fontSize: '0.6875rem',
                      fontFamily: 'monospace',
                      mb: 1.5,
                    }}
                  >
                    /{cat.slug}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.8125rem',
                      lineHeight: 1.45,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {cat.description}
                  </Typography>
                </Box>

                <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate('/products')}
                    sx={{
                      fontSize: '0.75rem',
                      color: '#1e40af',
                      fontWeight: 700,
                      p: 0,
                    }}
                  >
                    {cat.productCount} Products
                  </Button>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => handleOpenEditModal(cat)}>
                      <EditIcon fontSize="small" sx={{ color: '#64748b' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteCategory(cat.id, cat.name)}>
                      <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* 5. Add / Edit Category Dialog Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {editingId ? 'Edit Category' : 'Create New Category'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
              {editingId
                ? 'Update category settings, hierarchy, and URL slug'
                : 'Define a new store collection and taxonomy structure'}
            </Typography>
          </DialogTitle>
          <Divider />

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>
            <TextField
              label="Category Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Smart Home & Lighting"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="URL Slug"
                required
                fullWidth
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="smart-home-lighting"
                helperText="Storefront route identifier"
              />

              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parent}
                  label="Parent Category"
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                >
                  <MenuItem value="None (Top Level)">None (Top Level)</MenuItem>
                  {categories
                    .filter((c) => c.id !== editingId)
                    .map((c) => (
                      <MenuItem key={c.id} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Display Order / Priority"
                type="number"
                inputProps={{ min: 1 }}
                fullWidth
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                helperText="Lower numbers appear first"
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="Active">Active (Visible)</MenuItem>
                  <MenuItem value="Hidden">Hidden (Draft)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Accent Color Selection */}
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
                Brand Swatch / Accent Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                {PRESET_COLORS.map((col) => (
                  <Box
                    key={col}
                    onClick={() => setFormData({ ...formData, color: col })}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: col,
                      cursor: 'pointer',
                      border: formData.color === col ? '3px solid #0f172a' : '2px solid transparent',
                      boxShadow: formData.color === col ? '0 0 0 2px #ffffff' : 'none',
                      transition: 'transform 0.15s ease',
                      '&:hover': { transform: 'scale(1.15)' },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of items found inside this category..."
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f1f5f9' }}>
            <Button onClick={() => setModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#1e40af', '&:hover': { backgroundColor: '#1d4ed8' } }}
            >
              {editingId ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
