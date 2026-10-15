import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Trash2, AlertTriangle } from 'lucide-react';
import { User } from '../types/crm';

interface DeleteConfirmModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  user,
  onClose,
  onConfirm,
  deleting = false,
}) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'error.main',
          }}
        >
          <AlertTriangle size={22} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Delete Contact
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This action cannot be undone
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 1.5 }}>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: 'inherit', fontWeight: 700 }}>{user.name}</strong> (@{user.username}) from{' '}
          <span style={{ fontWeight: 600 }}>{user.company?.name || 'Company'}</span>?
        </DialogContentText>
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? 'rgba(241, 245, 249, 0.7)' : 'rgba(30, 41, 59, 0.4)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            REST Method: <strong>DELETE</strong> /users/{user.id}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Email: {user.email}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
        <Button onClick={onClose} disabled={deleting} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Trash2 size={16} />}
        >
          {deleting ? 'Deleting...' : 'Confirm Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
