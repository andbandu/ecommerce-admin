import { useState, useMemo } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import GridViewIcon from '@mui/icons-material/GridView';
import TableViewIcon from '@mui/icons-material/TableRows';
import InStockIcon from '@mui/icons-material/CheckCircle';
import LowStockIcon from '@mui/icons-material/Warning';
import OutOfStockIcon from '@mui/icons-material/Error';
import ClearIcon from '@mui/icons-material/Clear';

// Seed product dataset
const INITIAL_PRODUCTS = [
  {
    id: 'PRD-101',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Electronics',
    sku: 'SNY-XM5-BLK',
    price: 399.99,
    stock: 24,
    sales: 312,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80',
    description: 'Industry-leading noise canceling with dual processors and 8 microphones.',
  },
  {
    id: 'PRD-102',
    name: 'Apple Watch Series 9 GPS',
    category: 'Wearables',
    sku: 'APL-W9-45M',
    price: 429.00,
    stock: 8,
    sales: 184,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80',
    description: 'Powerful sensor suite, brighter display, and fast charging.',
  },
  {
    id: 'PRD-103',
    name: 'Nike Air Zoom Pegasus 40',
    category: 'Footwear',
    sku: 'NKE-PEG-40',
    price: 130.00,
    stock: 42,
    sales: 580,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80',
    description: 'Engineered mesh with responsive Nike React technology.',
  },
  {
    id: 'PRD-104',
    name: 'Minimalist Leather Desk Pad',
    category: 'Accessories',
    sku: 'ACC-DSK-BRN',
    price: 48.50,
    stock: 0,
    sales: 96,
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=150&q=80',
    description: 'Full-grain vegetal tanned leather, water-resistant smooth surface.',
  },
  {
    id: 'PRD-105',
    name: 'Logitech MX Master 3S Wireless',
    category: 'Electronics',
    sku: 'LOG-MX3S-GRY',
    price: 99.99,
    stock: 5,
    sales: 420,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=150&q=80',
    description: 'Quiet Clicks and 8K DPI track-on-glass optical sensor.',
  },
  {
    id: 'PRD-106',
    name: 'Aer Travel Pack 3 Ultra',
    category: 'Accessories',
    sku: 'AER-TRV-35L',
    price: 249.00,
    stock: 19,
    sales: 215,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80',
    description: 'Ultra-durable lightweight carry-on backpack for streamlined travel.',
  },
  {
    id: 'PRD-107',
    name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    category: 'Electronics',
    sku: 'KEY-Q1P-WHT',
    price: 199.00,
    stock: 12,
    sales: 144,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=150&q=80',
    description: 'Wireless custom mechanical keyboard with CNC aluminum body.',
  },
  {
    id: 'PRD-108',
    name: 'Patagonia Nano Puff Jacket',
    category: 'Apparel',
    sku: 'PAT-NNP-BLK',
    price: 239.00,
    stock: 31,
    sales: 320,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=150&q=80',
    description: 'Warm, windproof, water-resistant 60g PrimaLoft Gold Insulation.',
  },
];

const CATEGORIES = ['All', 'Electronics', 'Wearables', 'Footwear', 'Apparel', 'Accessories'];

export default function Products() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    sku: '',
    description: '',
    status: 'Active',
  });

  // Notification Toast
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;

        let matchesStock = true;
        if (stockFilter === 'in_stock') matchesStock = p.stock > 10;
        else if (stockFilter === 'low_stock') matchesStock = p.stock > 0 && p.stock <= 10;
        else if (stockFilter === 'out_of_stock') matchesStock = p.stock === 0;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'stock_high') return b.stock - a.stock;
        return 0; // default newest
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy]);

  // Handle Add Product Submit
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      setSnackbar({ open: true, message: 'Please provide at least product name and price', severity: 'error' });
      return;
    }

    const created = {
      id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name: newProduct.name,
      category: newProduct.category,
      sku: newProduct.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock, 10) || 0,
      sales: 0,
      status: newProduct.status,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80',
      description: newProduct.description,
    };

    setProducts([created, ...products]);
    setOpenAddModal(false);
    setNewProduct({
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      sku: '',
      description: '',
      status: 'Active',
    });
    setSnackbar({ open: true, message: `Product "${created.name}" created successfully!`, severity: 'success' });
  };

  // Handle Delete Product
  const handleDeleteProduct = (id, name) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSnackbar({ open: true, message: `Product "${name}" deleted.`, severity: 'info' });
  };

  // Stock Badge Render Helper
  const renderStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <Chip
          icon={<OutOfStockIcon sx={{ fontSize: '14px !important', color: '#dc2626 !important' }} />}
          label="Out of Stock"
          size="small"
          sx={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            fontWeight: 600,
          }}
        />
      );
    }
    if (stock <= 10) {
      return (
        <Chip
          icon={<LowStockIcon sx={{ fontSize: '14px !important', color: '#d97706 !important' }} />}
          label={`Low Stock (${stock})`}
          size="small"
          sx={{
            backgroundColor: '#fffbeb',
            color: '#b45309',
            border: '1px solid #fde68a',
            fontWeight: 600,
          }}
        />
      );
    }
    return (
      <Chip
        icon={<InStockIcon sx={{ fontSize: '14px !important', color: '#059669 !important' }} />}
        label={`In Stock (${stock})`}
        size="small"
        sx={{
          backgroundColor: '#ecfdf5',
          color: '#059669',
          border: '1px solid #a7f3d0',
          fontWeight: 600,
        }}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 1. Page Header */}
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
              Products
            </Typography>
            <Chip
              label={`${products.length} Items`}
              size="small"
              sx={{
                backgroundColor: 'rgba(30, 64, 175, 0.08)',
                color: '#1e40af',
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Manage catalog items, monitor live inventory counts, and configure pricing.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
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
          Add New Product
        </Button>
      </Box>

      {/* 2. Search & Filter Bar */}
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
        <Box sx={{ flexGrow: 1, maxWidth: { md: 360 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name or SKU..."
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

        {/* Filter Dropdowns */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Stock Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="stock-filter-label">Stock Status</InputLabel>
            <Select
              labelId="stock-filter-label"
              value={stockFilter}
              label="Stock Status"
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <MenuItem value="All">All Stock Levels</MenuItem>
              <MenuItem value="in_stock">In Stock (&gt;10)</MenuItem>
              <MenuItem value="low_stock">Low Stock (≤10)</MenuItem>
              <MenuItem value="out_of_stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="sort-filter-label">Sort By</InputLabel>
            <Select
              labelId="sort-filter-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Featured / New</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
              <MenuItem value="stock_high">Highest Stock</MenuItem>
            </Select>
          </FormControl>

          {/* View Toggle Buttons */}
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

      {/* 3. Products Content: Table or Grid */}
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
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 3 }}>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Stock Level</TableCell>
                  <TableCell align="center">Units Sold</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                      No products match your active search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((p) => (
                    <TableRow key={p.id} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      {/* Product Name & Thumbnail */}
                      <TableCell sx={{ pl: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            variant="rounded"
                            src={p.image}
                            alt={p.name}
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#f8fafc',
                            }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}
                            >
                              {p.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                              SKU: {p.sku}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Chip
                          label={p.category}
                          size="small"
                          sx={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>

                      {/* Price */}
                      <TableCell align="right">
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          ${p.price.toFixed(2)}
                        </Typography>
                      </TableCell>

                      {/* Stock Level */}
                      <TableCell align="center">
                        {renderStockBadge(p.stock)}
                      </TableCell>

                      {/* Units Sold */}
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                          {p.sales}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell align="center">
                        <Chip
                          label={p.status}
                          size="small"
                          sx={{
                            backgroundColor: p.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.15)',
                            color: p.status === 'Active' ? '#059669' : '#64748b',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Delete product" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
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
        /* Grid View of Products */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {filteredProducts.map((p) => (
            <Card
              key={p.id}
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
              <Box sx={{ position: 'relative', pt: '65%', backgroundColor: '#f8fafc' }}>
                <Box
                  component="img"
                  src={p.image}
                  alt={p.name}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                  {renderStockBadge(p.stock)}
                </Box>
              </Box>

              <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>
                    {p.category}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      lineHeight: 1.3,
                      mt: 0.5,
                      mb: 1,
                    }}
                  >
                    {p.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.8125rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4,
                    }}
                  >
                    {p.description}
                  </Typography>
                </Box>

                <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    ${p.price.toFixed(2)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteProduct(p.id, p.name)}
                    sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* 4. Add Product Dialog Modal */}
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={handleAddProductSubmit}>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Add New Product
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
              Fill in the details to publish a new item to your store catalog.
            </Typography>
          </DialogTitle>
          <Divider />

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>
            <TextField
              label="Product Title"
              required
              fullWidth
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="e.g. Wireless Ergonomic Keyboard"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newProduct.category}
                  label="Category"
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="SKU Code"
                fullWidth
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                placeholder="e.g. WR-KB-01"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Price ($)"
                required
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                fullWidth
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="149.99"
              />

              <TextField
                label="Initial Stock Quantity"
                required
                type="number"
                inputProps={{ min: '0' }}
                fullWidth
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="25"
              />
            </Box>

            <TextField
              label="Product Description"
              multiline
              rows={3}
              fullWidth
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Provide a brief summary of features and materials..."
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f1f5f9' }}>
            <Button onClick={() => setOpenAddModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#1e40af', '&:hover': { backgroundColor: '#1d4ed8' } }}
            >
              Save & Publish Product
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
