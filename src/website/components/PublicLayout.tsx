import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from '../context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

const websiteTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00C853', light: '#69F0AE', dark: '#00a847' },
    secondary: { main: '#007AFF' },
    background: { default: '#0a0a0c', paper: '#1c1c1e' },
    text: { primary: '#f5f5f7', secondary: '#9a9aa0' },
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

export default function PublicLayout() {
  return (
    <ThemeProvider theme={websiteTheme}>
      <CssBaseline />
      <CartProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden', backgroundColor: '#0a0a0c' }}>
          <Navbar />
          <div style={{ flexGrow: 1 }}>
            <Outlet />
          </div>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}