import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Instagram,
  YouTube,
  WhatsApp,
  Email,
  Phone,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';
import { storeInfo } from '../data/products';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #0a0a0c 0%, #060608 100%)',
        borderTop: '1px solid rgba(0, 200, 83, 0.1)',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Ecotec Logo"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 0 25px rgba(0, 200, 83, 0.3)',
                }}
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00C853, #69F0AE)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                  }}
                >
                  ECOTEC
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.65rem',
                    color: '#6e6e73',
                    letterSpacing: '2.5px',
                    fontWeight: 500,
                  }}
                >
                  COMPUTER SOLUTIONS
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                color: '#9a9aa0',
                fontSize: '0.95rem',
                lineHeight: 1.8,
                mb: 3,
                maxWidth: 350,
              }}
            >
              Your trusted technology partner in Mulatiyana, Matara.
              We provide premium computers, accessories, and IT solutions
              at the best prices in Sri Lanka.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href={`https://instagram.com/${storeInfo.instagram}`}
                target="_blank"
                sx={{
                  color: '#c7c7cc',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 200, 83, 0.1)',
                    color: '#00C853',
                    borderColor: 'rgba(0, 200, 83, 0.3)',
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href={`https://youtube.com/${storeInfo.youtube}`}
                target="_blank"
                sx={{
                  color: '#c7c7cc',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 200, 83, 0.1)',
                    color: '#00C853',
                    borderColor: 'rgba(0, 200, 83, 0.3)',
                  },
                }}
              >
                <YouTube />
              </IconButton>
              <IconButton
                component="a"
                href={`https://wa.me/${storeInfo.whatsapp}`}
                target="_blank"
                sx={{
                  color: '#c7c7cc',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 200, 83, 0.1)',
                    color: '#00C853',
                    borderColor: 'rgba(0, 200, 83, 0.3)',
                  },
                }}
              >
                <WhatsApp />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                color: '#f5f5f7',
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: 2,
                  borderRadius: 1,
                  background: 'linear-gradient(90deg, #00C853, transparent)',
                },
              }}
            >
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Laptops', 'Desktops', 'Accessories', 'Components', 'Networking', 'Printers'].map(
                (item) => (
                  <Link
                    key={item}
                    to="/products"
                    style={{ textDecoration: 'none' }}
                  >
                    <Typography
                      sx={{
                        color: '#9a9aa0',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#00C853',
                          transform: 'translateX(4px)',
                        },
                        display: 'inline-block',
                      }}
                    >
                      {item}
                    </Typography>
                  </Link>
                )
              )}
            </Box>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                color: '#f5f5f7',
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: 2,
                  borderRadius: 1,
                  background: 'linear-gradient(90deg, #00C853, transparent)',
                },
              }}
            >
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Contact', path: '/contact' },
                { label: 'Careers', path: '/about' },
                { label: 'Blog', path: '/about' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    sx={{
                      color: '#9a9aa0',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#00C853',
                        transform: 'translateX(4px)',
                      },
                      display: 'inline-block',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                color: '#f5f5f7',
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: 2,
                  borderRadius: 1,
                  background: 'linear-gradient(90deg, #00C853, transparent)',
                },
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOn
                  sx={{ color: '#00C853', fontSize: 20, mt: 0.3, flexShrink: 0 }}
                />
                <Typography sx={{ color: '#9a9aa0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {storeInfo.address}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ color: '#00C853', fontSize: 20 }} />
                <Typography sx={{ color: '#9a9aa0', fontSize: '0.9rem' }}>
                  {storeInfo.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ color: '#00C853', fontSize: 20 }} />
                <Typography sx={{ color: '#9a9aa0', fontSize: '0.9rem' }}>
                  {storeInfo.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <AccessTime sx={{ color: '#00C853', fontSize: 20, mt: 0.3 }} />
                <Box>
                  <Typography sx={{ color: '#9a9aa0', fontSize: '0.85rem' }}>
                    Mon-Fri: {storeInfo.hours.weekdays}
                  </Typography>
                  <Typography sx={{ color: '#9a9aa0', fontSize: '0.85rem' }}>
                    Saturday: {storeInfo.hours.saturday}
                  </Typography>
                  <Typography sx={{ color: '#6e6e73', fontSize: '0.85rem' }}>
                    Sunday: {storeInfo.hours.sunday}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            mt: 6,
            mb: 3,
            borderColor: 'rgba(255, 255, 255, 0.04)',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography sx={{ color: '#6e6e73', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Ecotec Computer Solutions. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Warranty'].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: '#6e6e73',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  '&:hover': { color: '#00C853' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}