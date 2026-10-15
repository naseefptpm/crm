import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  ExternalLink,
  Compass,
  Briefcase,
  Quote,
} from 'lucide-react';
import { User } from '../types/crm';

interface ContactDetailDrawerProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  open,
  user,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!user) return null;

  const mapQuery =
    user.address?.geo?.lat && user.address?.geo?.lng
      ? `${user.address.geo.lat},${user.address.geo.lng}`
      : `${user.address?.street || ''}, ${user.address?.city || ''}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 460 },
            p: 0,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
          >
            {user.name.charAt(0)}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            <Chip
              label={`ID: #${user.id}`}
              size="small"
              sx={{ mt: 0.5, height: 20, fontSize: '0.7rem', fontWeight: 600 }}
            />
          </Box>
        </Box>

        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      {/* Action bar */}
      <Box sx={{ p: 2, px: 3, display: 'flex', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<Edit size={16} />}
          onClick={() => {
            onClose();
            onEdit(user);
          }}
          fullWidth
        >
          Edit Profile
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<Trash2 size={16} />}
          onClick={() => {
            onClose();
            onDelete(user);
          }}
        >
          Delete
        </Button>
      </Box>

      {/* Body content */}
      <Box sx={{ p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Contact info */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'text.secondary',
              letterSpacing: '0.05em',
              display: 'block',
              mb: 1.5,
            }}
          >
            Communication
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Mail size={18} color="#3b82f6" />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                  <a href={`mailto:${user.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {user.email}
                  </a>
                </Typography>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Phone size={18} color="#10b981" />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Phone
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  <a href={`tel:${user.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {user.phone}
                  </a>
                </Typography>
              </Box>
            </Paper>

            {user.website && (
              <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Globe size={18} color="#8b5cf6" />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Website
                  </Typography>
                  <Typography
                    component="a"
                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                    target="_blank"
                    rel="noreferrer"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {user.website} <ExternalLink size={13} />
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Company info */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'text.secondary',
              letterSpacing: '0.05em',
              display: 'block',
              mb: 1.5,
            }}
          >
            Company Details
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Building2 size={20} color="#8b5cf6" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                {user.company?.name || 'Independent'}
              </Typography>
            </Box>

            {user.company?.catchPhrase && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  backgroundColor: 'background.default',
                  p: 1.5,
                  borderRadius: 1.5,
                }}
              >
                <Quote size={16} color="#94a3b8" />
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  "{user.company.catchPhrase}"
                </Typography>
              </Box>
            )}

            {user.company?.bs && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Briefcase size={16} color="#64748b" />
                <Typography variant="caption" color="text.secondary">
                  Focus: <strong>{user.company.bs}</strong>
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Address and location */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'text.secondary',
              letterSpacing: '0.05em',
              display: 'block',
              mb: 1.5,
            }}
          >
            Address & Coordinates
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <MapPin size={20} color="#10b981" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.address?.street} {user.address?.suite ? `, ${user.address.suite}` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.address?.city}, {user.address?.zipcode}
                </Typography>
              </Box>
            </Box>

            {(user.address?.geo?.lat || user.address?.geo?.lng) && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'background.default',
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <Compass size={16} color="#f59e0b" />
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  Lat: {user.address.geo.lat || 'N/A'}, Lng: {user.address.geo.lng || 'N/A'}
                </Typography>
              </Box>
            )}

            <Button
              component="a"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              size="small"
              startIcon={<ExternalLink size={14} />}
              sx={{ alignSelf: 'flex-start', mt: 0.5 }}
            >
              Open in Google Maps
            </Button>
          </Paper>
        </Box>
      </Box>
    </Drawer>
  );
};
