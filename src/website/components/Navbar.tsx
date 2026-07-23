import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
  Container,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon,
  Close,
  Search,
  Home,
  Category,
  Info,
  ContactMail,
  Build,
  FavoriteBorder,
  Person,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'Home', path: '/', icon: <Home /> },
  { label: 'Products', path: '/products', icon: <Category /> },
  { label: 'Services', path: '/services', icon: <Build /> },
  { label: 'About', path: '/about', icon: <Info /> },
  { label: 'Contact', path: '/contact', icon: <ContactMail /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { cartCount, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(10, 10, 12, 0.92)'
            : 'rgba(10, 10, 12, 0.6)',
          backdropFilter: 'blur(24px)',
          borderBottom: scrolled
            ? '1px solid rgba(0, 200, 83, 0.15)'
            : '1px solid rgba(255, 255, 255, 0.04)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          maxWidth: '1600px',
          margin: '0 auto',
          left: 0,
          right: 0,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              minHeight: { xs: 64, md: 72 },
              px: { xs: 0, md: 1 },
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Ecotec Logo"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 0 20px rgba(0, 200, 83, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 0 30px rgba(0, 200, 83, 0.5)',
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: '1rem', md: '1.2rem' },
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
                    fontSize: '0.6rem',
                    color: '#9a9aa0',
                    letterSpacing: '2px',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  COMPUTER SOLUTIONS
                </Typography>
              </Box>
            </Link>

            {/* Desktop Nav Links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      color:
                        location.pathname === link.path
                          ? '#00C853'
                          : '#c7c7cc',
                      fontWeight: location.pathname === link.path ? 700 : 500,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: location.pathname === link.path ? '60%' : '0%',
                        height: 2,
                        borderRadius: 1,
                        background: 'linear-gradient(90deg, #00C853, #69F0AE)',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover': {
                        color: '#00C853',
                        backgroundColor: 'rgba(0, 200, 83, 0.05)',
                        '&::after': {
                          width: '60%',
                        },
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
              {/* Cart */}
              <IconButton
                id="cart-button"
                onClick={toggleCart}
                sx={{
                  color: '#c7c7cc',
                  position: 'relative',
                  '&:hover': { color: '#00C853', backgroundColor: 'rgba(0, 200, 83, 0.08)' },
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(135deg, #00C853, #00E676)',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    },
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{
                    color: '#c7c7cc',
                    '&:hover': { color: '#00C853' },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer */}
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          sx: {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)',
            }
          }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            backgroundColor: '#000000',
            borderLeft: '1px solid rgba(0, 200, 83, 0.2)',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00C853, #69F0AE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ECOTEC
            </Typography>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: '#9a9aa0' }}
            >
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />

          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color:
                    location.pathname === link.path ? '#00C853' : '#c7c7cc',
                  backgroundColor:
                    location.pathname === link.path
                      ? 'rgba(0, 200, 83, 0.08)'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 200, 83, 0.05)',
                    color: '#00C853',
                  },
                  textDecoration: 'none',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: location.pathname === link.path ? 700 : 500 }}>
                      {link.label}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}