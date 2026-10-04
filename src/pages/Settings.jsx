import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export default function Settings() {
  const [storeName, setStoreName] = useState('AuraStore Online');
  const [supportEmail, setSupportEmail] = useState('support@aurastore.com');
  const [currency, setCurrency] = useState('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 900 }}>
      {/* Header */}
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
          Store Settings
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Manage your storefront details, alerts, regional currencies, and security settings.
        </Typography>
      </Box>

      {/* Settings Form Card */}
      <Card
        component="form"
        onSubmit={handleSave}
        sx={{
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          p: { xs: 2.5, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            General Information
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
            Basic details visible on invoice slips and order notifications.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
          <TextField
            label="Storefront Brand Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Customer Support Email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            fullWidth
          />
        </Box>

        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Base Currency</InputLabel>
          <Select
            value={currency}
            label="Base Currency"
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
            <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
            <MenuItem value="GBP">GBP (£) - British Pound</MenuItem>
            <MenuItem value="CAD">CAD ($) - Canadian Dollar</MenuItem>
          </Select>
        </FormControl>

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Alert Preferences
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem', mb: 1 }}>
            Choose how you would like to be notified about operational events.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Instant Order Notifications
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Receive an email immediately when a new customer checkout occurs.
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={inventoryAlerts}
                  onChange={(e) => setInventoryAlerts(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Low Inventory Alerts
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Send automated warnings when product stock dips below 10 units.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Security & Authentication
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem', mb: 1 }}>
            Protect administrator account access with multi-factor authentication.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Enforce Two-Factor Authentication (2FA)
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Require SMS or Authenticator App passcodes on login.
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#1e40af',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Card>

      <Snackbar
        open={saved}
        autoHideDuration={4000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          Store settings updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
