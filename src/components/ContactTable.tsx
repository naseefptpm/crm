import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Chip,
  Tooltip,
  Paper,
  Skeleton,
  TableSortLabel,
} from '@mui/material';
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  X,
  Building2,
  MapPin,
  Download,
  RefreshCw,
  Mail,
  Phone,
  ArrowUpDown,
} from 'lucide-react';
import { User } from '../types/crm';

interface ContactTableProps {
  users: User[];
  loading: boolean;
  onAddContact: () => void;
  onEditContact: (user: User) => void;
  onDeleteContact: (user: User) => void;
  onViewContact: (user: User) => void;
  onRefresh: () => void;
}

type SortField = 'id' | 'name' | 'email' | 'company' | 'city';
type SortOrder = 'asc' | 'desc';

export const ContactTable: React.FC<ContactTableProps> = ({
  users,
  loading,
  onAddContact,
  onEditContact,
  onDeleteContact,
  onViewContact,
  onRefresh,
}) => {
  // Global search state
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states (5 or 10 per page as specified)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sorting state
  const [orderBy, setOrderBy] = useState<SortField>('id');
  const [order, setOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  // Real-time Global Search: filters by Name, Email, City, or Company Name
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const city = (u.address?.city || '').toLowerCase();
      const company = (u.company?.name || '').toLowerCase();
      const username = (u.username || '').toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        city.includes(term) ||
        company.includes(term) ||
        username.includes(term)
      );
    });
  }, [users, searchTerm]);

  // Sort filtered users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (orderBy) {
        case 'id':
          aVal = a.id;
          bVal = b.id;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'company':
          aVal = (a.company?.name || '').toLowerCase();
          bVal = (b.company?.name || '').toLowerCase();
          break;
        case 'city':
          aVal = (a.address?.city || '').toLowerCase();
          bVal = (b.address?.city || '').toLowerCase();
          break;
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, orderBy, order]);

  // Paginate records
  const paginatedUsers = useMemo(() => {
    return sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedUsers, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export CSV feature
  const exportToCsv = () => {
    const headers = ['ID', 'Name', 'Username', 'Email', 'Phone', 'Company', 'City', 'Street', 'Website'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.username.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      `"${u.phone.replace(/"/g, '""')}"`,
      `"${(u.company?.name || '').replace(/"/g, '""')}"`,
      `"${(u.address?.city || '').replace(/"/g, '""')}"`,
      `"${(u.address?.street || '').replace(/"/g, '""')}"`,
      `"${(u.website || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crm_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      {/* Top Operations Bar: Global Search + Add Contact button */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.6)' : 'rgba(15, 23, 42, 0.4)',
        }}
      >
        {/* Global Search Bar */}
        <Box sx={{ flex: 1, maxWidth: { md: 460 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by Name, Email, City, or Company..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#64748b" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchTerm('');
                        setPage(0);
                      }}
                    >
                      <X size={15} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Tooltip title="Refresh contacts from API">
            <span>
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '10px',
                  p: 1,
                }}
              >
                <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
              </IconButton>
            </span>
          </Tooltip>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
            onClick={exportToCsv}
            disabled={filteredUsers.length === 0}
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
              },
            }}
          >
            Export CSV
          </Button>

          {/* Create Action: Add Contact button opens MUI Dialog containing React Hook Form */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<UserPlus size={18} />}
            onClick={onAddContact}
            sx={{
              fontWeight: 700,
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.35)',
            }}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      {/* Results Count & Filter Pill */}
      {searchTerm && (
        <Box
          sx={{
            px: 2.5,
            py: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Found {filteredUsers.length} contact{filteredUsers.length === 1 ? '' : 's'} matching "{searchTerm}"
          </Typography>
          <Button
            size="small"
            onClick={() => setSearchTerm('')}
            sx={{ fontSize: '0.75rem', p: 0, minWidth: 'auto', textTransform: 'none' }}
          >
            Clear filter
          </Button>
        </Box>
      )}

      {/* Contacts Data Grid (MUI Table) */}
      <TableContainer sx={{ minHeight: 340 }}>
        <Table sx={{ minWidth: 750 }} aria-label="CRM contacts table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 70 }}>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Contact Name
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email & Phone
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'company'}
                  direction={orderBy === 'company' ? order : 'asc'}
                  onClick={() => handleSort('company')}
                >
                  Company
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'city'}
                  direction={orderBy === 'city' ? order : 'asc'}
                  onClick={() => handleSort('city')}
                >
                  City & Location
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sx={{ pr: 3 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              // Loading Skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={24} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Skeleton variant="circular" width={36} height={36} />
                      <Box sx={{ width: 140 }}>
                        <Skeleton height={20} />
                        <Skeleton height={14} width="60%" />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton height={20} width={160} />
                    <Skeleton height={14} width={100} />
                  </TableCell>
                  <TableCell><Skeleton height={20} width={120} /></TableCell>
                  <TableCell><Skeleton height={20} width={90} /></TableCell>
                  <TableCell align="right"><Skeleton height={30} width={90} sx={{ ml: 'auto' }} /></TableCell>
                </TableRow>
              ))
            ) : paginatedUsers.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      <Search size={28} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      No contacts found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 1 }}>
                      {searchTerm
                        ? `No contact records matched your search query "${searchTerm}".`
                        : 'Your contact database is currently empty.'}
                    </Typography>
                    {searchTerm ? (
                      <Button variant="outlined" size="small" onClick={() => setSearchTerm('')}>
                        Clear Search Filter
                      </Button>
                    ) : (
                      <Button variant="contained" size="small" startIcon={<UserPlus size={16} />} onClick={onAddContact}>
                        Add First Contact
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              // Contact Data Rows
              paginatedUsers.map((user) => {
                const initial = user.name.charAt(0).toUpperCase();

                return (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                    onClick={() => onViewContact(user)}
                  >
                    {/* ID */}
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                      #{user.id}
                    </TableCell>

                    {/* Name & Avatar */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            flexShrink: 0,
                          }}
                        >
                          {initial}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}
                          >
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Email & Phone */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Mail size={13} color="#64748b" />
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.primary',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                            }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Phone size={13} color="#94a3b8" />
                          <Typography variant="caption" color="text.secondary">
                            {user.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Company */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building2 size={15} color="#8b5cf6" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.company?.name || '—'}
                          </Typography>
                          {user.company?.catchPhrase && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                maxWidth: 180,
                              }}
                            >
                              {user.company.catchPhrase}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* City */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapPin size={15} color="#10b981" />
                        <Box>
                          <Chip
                            label={user.address?.city || 'Unknown'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              height: 24,
                            }}
                          />
                          {user.address?.street && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                              {user.address.street}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Row Actions: View, Edit, Delete */}
                    <TableCell align="right" sx={{ pr: 2 }} onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onViewContact(user)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'primary.main', backgroundColor: 'rgba(59, 130, 246, 0.08)' },
                            }}
                          >
                            <Eye size={17} />
                          </IconButton>
                        </Tooltip>

                        {/* Edit Action: Pre-fills all form fields (including nested company & address) */}
                        <Tooltip title="Edit Contact">
                          <IconButton
                            size="small"
                            onClick={() => onEditContact(user)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.08)' },
                            }}
                          >
                            <Edit2 size={17} />
                          </IconButton>
                        </Tooltip>

                        {/* Delete Action: Triggers MUI confirmation modal */}
                        <Tooltip title="Delete Contact">
                          <IconButton
                            size="small"
                            onClick={() => onDeleteContact(user)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main', backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                            }}
                          >
                            <Trash2 size={17} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Client-side Pagination: 5 or 10 records per page as required */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          '.MuiTablePagination-toolbar': {
            px: { xs: 1.5, sm: 3 },
          },
        }}
      />
    </Card>
  );
};
