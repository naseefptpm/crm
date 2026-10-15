import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Users, Building2, MapPin, TrendingUp, Sparkles, Globe } from 'lucide-react';
import { User } from '../types/crm';

interface MetricsCardsProps {
  users: User[];
  loading?: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ users, loading = false }) => {
  // 1. Total Contacts: Count of all users currently loaded in state
  const totalContacts = users.length;

  // 2. Total Companies: Number of unique company names represented
  const uniqueCompanies = React.useMemo(() => {
    const names = users
      .map((u) => u.company?.name?.trim())
      .filter((name): name is string => Boolean(name && name.length > 0));
    return new Set(names).size;
  }, [users]);

  // 3. Active Cities: Number of distinct cities in address records
  const uniqueCities = React.useMemo(() => {
    const cities = users
      .map((u) => u.address?.city?.trim())
      .filter((c): c is string => Boolean(c && c.length > 0));
    return new Set(cities).size;
  }, [users]);

  const cards = [
    {
      title: 'Total Contacts',
      value: totalContacts,
      subtitle: 'Users currently loaded in state',
      icon: Users,
      badgeText: 'Active Pool',
      color: '#3b82f6', // blue
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.03) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      trend: `${totalContacts} active profiles`,
    },
    {
      title: 'Total Companies',
      value: uniqueCompanies,
      subtitle: 'Unique company entities',
      icon: Building2,
      badgeText: 'Organizations',
      color: '#8b5cf6', // purple
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.03) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.25)',
      iconBg: 'rgba(139, 92, 246, 0.15)',
      trend: `${((uniqueCompanies / (totalContacts || 1)) * 100).toFixed(0)}% diversity ratio`,
    },
    {
      title: 'Active Cities',
      value: uniqueCities,
      subtitle: 'Distinct geographical hubs',
      icon: MapPin,
      badgeText: 'Locations',
      color: '#10b981', // emerald
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.03) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      trend: 'Global distribution',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {cards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: card.bgGradient,
                  borderColor: card.borderColor,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {/* Decorative background glow circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: card.color,
                    opacity: 0.08,
                    filter: 'blur(16px)',
                    pointerEvents: 'none',
                  }}
                />

                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: card.iconBg,
                        color: card.color,
                      }}
                    >
                      <IconComp size={24} strokeWidth={2.2} />
                    </Box>
                    <Box
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        backgroundColor: 'background.paper',
                        color: card.color,
                        border: '1px solid',
                        borderColor: card.borderColor,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Sparkles size={12} />
                      {card.badgeText}
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}
                  >
                    {card.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {loading ? '...' : card.value}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {card.subtitle}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUp size={13} color={card.color} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: card.color }}>
                        {card.trend}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
