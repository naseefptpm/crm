import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  LayoutDashboard,
  Moon,
  Sun,
  UserPlus,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onAddContact: () => void;
  onResetData: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onAddContact,
  onResetData,
  totalCount,
}) => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1, justifyContent: 'space-between' }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            }}
          >
            <LayoutDashboard size={24} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: theme.palette.mode === 'light' ? 'text' : undefined,
                  WebkitTextFillColor: theme.palette.mode === 'light' ? 'transparent' : 'inherit',
                }}
              >
                NexusCRM
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.2 }}>
              Enterprise Contacts Management & Analytics
            </Typography>
          </Box>
        </Box>

        {/* REST API Status */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.6,
              borderRadius: '20px',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                animation: 'pulse 2s infinite',
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981' }}>
              API Live: jsonplaceholder.typicode.com
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Reset all contacts back to initial JSONPlaceholder API records">
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              startIcon={<RotateCcw size={15} />}
              onClick={onResetData}
              sx={{
                borderColor: 'divider',
                display: { xs: 'none', sm: 'inline-flex' },
                fontSize: '0.8rem',
              }}
            >
              Reset Data
            </Button>
          </Tooltip>

          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={onToggleTheme}
              size="small"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '10px',
                p: 1,
              }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<UserPlus size={16} />}
            onClick={onAddContact}
            sx={{
              display: { xs: 'inline-flex', sm: 'inline-flex' },
              fontWeight: 700,
            }}
          >
            Add Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
