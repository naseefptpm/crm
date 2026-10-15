import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Divider,
  CircularProgress,
  InputAdornment,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  User as UserIcon,
  Building,
  MapPin,
  Compass,
  Mail,
  Phone,
  Globe,
  Sparkles,
  CheckCircle2,
  AtSign,
} from 'lucide-react';
import { contactFormSchema, ContactFormData, User } from '../types/crm';

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  initialData?: User | null;
  submitting?: boolean;
}

const defaultValues: ContactFormData = {
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  company: {
    name: '',
    catchPhrase: '',
    bs: '',
  },
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
      lat: '',
      lng: '',
    },
  },
};

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting = false,
}) => {
  const isEditing = Boolean(initialData);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Pre-fill all fields (including nested company and address) when opening in edit mode
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          username: initialData.username || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          website: initialData.website || '',
          company: {
            name: initialData.company?.name || '',
            catchPhrase: initialData.company?.catchPhrase || '',
            bs: initialData.company?.bs || '',
          },
          address: {
            street: initialData.address?.street || '',
            suite: initialData.address?.suite || '',
            city: initialData.address?.city || '',
            zipcode: initialData.address?.zipcode || '',
            geo: {
              lat: initialData.address?.geo?.lat || '',
              lng: initialData.address?.geo?.lng || '',
            },
          },
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: ContactFormData) => {
    await onSubmit(data);
  };

  // Helper to fill with sample data for quick assessment demo
  const fillSampleData = () => {
    setValue('name', 'Sarah Jenkins', { shouldValidate: true, shouldDirty: true });
    setValue('username', 'sjenkins', { shouldValidate: true, shouldDirty: true });
    setValue('email', 'sarah.jenkins@techcorp.io', { shouldValidate: true, shouldDirty: true });
    setValue('phone', '+1 (555) 234-5678', { shouldValidate: true, shouldDirty: true });
    setValue('website', 'techcorp.io', { shouldValidate: true, shouldDirty: true });
    setValue('company.name', 'TechCorp Solutions', { shouldValidate: true, shouldDirty: true });
    setValue('company.catchPhrase', 'Accelerating cloud infrastructure and AI integration', {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('company.bs', 'synergize enterprise platforms', { shouldValidate: true, shouldDirty: true });
    setValue('address.street', '742 Evergreen Terrace', { shouldValidate: true, shouldDirty: true });
    setValue('address.suite', 'Suite 400', { shouldValidate: true, shouldDirty: true });
    setValue('address.city', 'San Francisco', { shouldValidate: true, shouldDirty: true });
    setValue('address.zipcode', '94105', { shouldValidate: true, shouldDirty: true });
    setValue('address.geo.lat', '37.7749', { shouldValidate: true, shouldDirty: true });
    setValue('address.geo.lng', '-122.4194', { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxHeight: '92vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(30, 41, 59, 0.5)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: isEditing ? 'rgba(139, 92, 246, 0.12)' : 'rgba(59, 130, 246, 0.12)',
              color: isEditing ? '#8b5cf6' : '#3b82f6',
            }}
          >
            <UserIcon size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {isEditing ? `Edit Contact: ${initialData?.name}` : 'Create New Contact'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isEditing
                ? 'Update contact details, company profile, and location information'
                : 'Fill in details across Personal, Company, Address, and Coordinates sections'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isEditing && (
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<Sparkles size={14} />}
              onClick={fillSampleData}
              sx={{ fontSize: '0.75rem', py: 0.5, px: 1.5 }}
            >
              Autofill Sample
            </Button>
          )}
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={submitting}
            size="small"
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          {/* SECTION 1: PERSONAL */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <UserIcon size={18} color="#3b82f6" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                1. Personal Information
              </Typography>
              <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
            </Box>

            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name *"
                      placeholder="e.g. Leanne Graham"
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message || 'Minimum 3 characters'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Username */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Username *"
                      placeholder="e.g. Bret"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <AtSign size={16} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={Boolean(errors.username)}
                      helperText={errors.username?.message || 'Alphanumeric identifier'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      label="Email Address *"
                      placeholder="e.g. sincere@april.biz"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail size={16} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message || 'Valid email format'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Phone Number */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number *"
                      placeholder="e.g. 1-770-736-8031 x56442"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone size={16} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone?.message || 'Required contact number'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Website */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Website (Optional)"
                      placeholder="e.g. hildegard.org"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Globe size={16} />
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={Boolean(errors.website)}
                      helperText={errors.website?.message || 'Optional website domain or URL'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* SECTION 2: COMPANY */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Building size={18} color="#8b5cf6" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                2. Company Organization
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {/* Company Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="company.name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Company Name *"
                      placeholder="e.g. Romaguera-Crona"
                      error={Boolean(errors.company?.name)}
                      helperText={errors.company?.name?.message || 'Required company entity'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Catchphrase */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="company.catchPhrase"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Company Catchphrase (Optional)"
                      placeholder="e.g. Multi-layered client-server neural-net"
                      error={Boolean(errors.company?.catchPhrase)}
                      helperText={errors.company?.catchPhrase?.message || 'Optional organizational motto'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Business Strategy (BS) */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="company.bs"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Business Strategy / BS (Optional)"
                      placeholder="e.g. harness real-time e-markets"
                      error={Boolean(errors.company?.bs)}
                      helperText={errors.company?.bs?.message || 'Optional business domain or key focus'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* SECTION 3: ADDRESS */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MapPin size={18} color="#10b981" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                3. Address Information
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {/* Street */}
              <Grid size={{ xs: 12, sm: 8 }}>
                <Controller
                  name="address.street"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Street Address *"
                      placeholder="e.g. Kulas Light"
                      error={Boolean(errors.address?.street)}
                      helperText={errors.address?.street?.message || 'Required street address'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Suite */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="address.suite"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Suite / Apt (Optional)"
                      placeholder="e.g. Apt. 556"
                      error={Boolean(errors.address?.suite)}
                      helperText={errors.address?.suite?.message || 'Optional unit'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* City */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="address.city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City *"
                      placeholder="e.g. Gwenborough"
                      error={Boolean(errors.address?.city)}
                      helperText={errors.address?.city?.message || 'Required city name'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Zipcode */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="address.zipcode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Zipcode *"
                      placeholder="e.g. 92998-3874"
                      error={Boolean(errors.address?.zipcode)}
                      helperText={errors.address?.zipcode?.message || 'Required postal/zip code'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* SECTION 4: COORDINATES */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Compass size={18} color="#f59e0b" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  4. Geographical Coordinates
                </Typography>
                <Chip label="Optional" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
              </Box>
            </Box>

            <Grid container spacing={2}>
              {/* Latitude */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="address.geo.lat"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Geo Latitude (Optional)"
                      placeholder="e.g. -37.3159 (-90 to 90)"
                      error={Boolean(errors.address?.geo?.lat)}
                      helperText={errors.address?.geo?.lat?.message || 'Coordinate string format'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>

              {/* Longitude */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="address.geo.lng"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Geo Longitude (Optional)"
                      placeholder="e.g. 81.1496 (-180 to 180)"
                      error={Boolean(errors.address?.geo?.lng)}
                      helperText={errors.address?.geo?.lng?.message || 'Coordinate string format'}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            px: 3,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(30, 41, 59, 0.5)',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckCircle2 size={18} />
              )
            }
            sx={{ minWidth: 140 }}
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Contact' : 'Create Contact'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
