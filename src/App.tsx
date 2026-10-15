/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { createAppTheme } from './theme/theme';
import { User, ContactFormData } from './types/crm';
import { getUsers, createContactApi, updateContactApi, deleteContactApi } from './services/api';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { ContactTable } from './components/ContactTable';
import { ContactFormModal } from './components/ContactFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ContactDetailDrawer } from './components/ContactDetailDrawer';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = React.useMemo(() => createAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  // Main state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Modals & Drawers state
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [detailDrawerOpen, setDetailDrawerOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Notification snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch initial users from REST API endpoint
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      showNotification(`Successfully fetched ${data.length} contacts from REST API`, 'success');
    } catch (err: any) {
      console.error('Failed to load contacts:', err);
      showNotification(err.message || 'Error fetching contacts from API', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Open Create Form modal
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormModalOpen(true);
  };

  // Open Edit Form modal with pre-filled fields
  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormModalOpen(true);
  };

  // Open Delete confirmation modal
  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Open Detail Drawer
  const handleOpenDetail = (user: User) => {
    setSelectedUser(user);
    setDetailDrawerOpen(true);
  };

  // Handle Form Submit: Create or Update via API
  const handleFormSubmit = async (formData: ContactFormData) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        // Edit Action: PUT (/users/:id)
        const updated = await updateContactApi(editingUser.id, formData);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
        showNotification(`Contact "${updated.name}" updated successfully (PUT /users/${editingUser.id})`, 'success');
        if (selectedUser?.id === editingUser.id) {
          setSelectedUser(updated);
        }
      } else {
        // Create Action: POST (/users)
        const created = await createContactApi(formData);
        // Ensure unique ID in client state
        const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        const newContact = { ...created, id: nextId };
        setUsers((prev) => [newContact, ...prev]);
        showNotification(`Contact "${newContact.name}" created successfully (POST /users)`, 'success');
      }
      setFormModalOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error('Error saving contact:', err);
      showNotification(err.message || 'Failed to save contact', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Confirm: DELETE (/users/:id)
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteContactApi(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      showNotification(`Contact "${userToDelete.name}" deleted (DELETE /users/${userToDelete.id})`, 'info');
      setDeleteModalOpen(false);
      if (selectedUser?.id === userToDelete.id) {
        setDetailDrawerOpen(false);
        setSelectedUser(null);
      }
      setUserToDelete(null);
    } catch (err: any) {
      console.error('Error deleting contact:', err);
      showNotification(err.message || 'Failed to delete contact', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default' }}>
        {/* Navigation / Header */}
        <Header
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
          onAddContact={handleOpenAddModal}
          onResetData={loadUsers}
          totalCount={users.length}
        />

        {/* Main Content Area */}
        <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
          {/* Section 1: Analytics Summary Bar (Top Metrics) */}
          <MetricsCards users={users} loading={loading} />

          {/* Section 2: Dashboard Data Grid & Operations */}
          <ContactTable
            users={users}
            loading={loading}
            onAddContact={handleOpenAddModal}
            onEditContact={handleOpenEditModal}
            onDeleteContact={handleOpenDeleteModal}
            onViewContact={handleOpenDetail}
            onRefresh={loadUsers}
          />
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.6)',
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                NexusCRM • Enterprise Customer Relationship Management
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Connected to <code>https://jsonplaceholder.typicode.com/users</code>
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Section 3: React Hook Form + Zod Modal (Create & Edit) */}
        <ContactFormModal
          open={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingUser}
          submitting={submitting}
        />

        {/* Delete Confirmation Modal (DialogTitle, DialogContent, DialogActions) */}
        <DeleteConfirmModal
          open={deleteModalOpen}
          user={userToDelete}
          onClose={() => {
            setDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          deleting={deleting}
        />

        {/* Contact Details Drawer */}
        <ContactDetailDrawer
          open={detailDrawerOpen}
          user={selectedUser}
          onClose={() => {
            setDetailDrawerOpen(false);
            setSelectedUser(null);
          }}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />

        {/* Feedback Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%', borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
