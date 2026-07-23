import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete,
  ShoppingBag,
  WhatsApp,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { formatPrice, storeInfo } from '../data/products';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    cartTotal,
    cartCount,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleWhatsAppOrder = () => {
    let message = '🛒 *New Order from Ecotec Website*\n\n';
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\n💰 *Total: ${formatPrice(cartTotal)}*`;
    message += '\n\nPlease confirm availability and delivery details.';

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${encoded}`, '_blank');
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={() => setCartOpen(false)}
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
          width: { xs: '100%', sm: 420 },
          backgroundColor: '#000000',
          borderLeft: '1px solid rgba(0, 200, 83, 0.15)',
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShoppingBag sx={{ color: '#00C853' }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                color: '#f5f5f7',
              }}
            >
              Your Cart
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.3,
                borderRadius: 2,
                background: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.2)',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#69F0AE',
                }}
              >
                {cartCount} items
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setCartOpen(false)}
            sx={{ color: '#9a9aa0' }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
              }}
            >
              <ShoppingBag
                sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.08)' }}
              />
              <Typography sx={{ color: '#6e6e73', fontSize: '1rem' }}>
                Your cart is empty
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setCartOpen(false)}
                sx={{ borderRadius: 2, mt: 1 }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: 'rgba(28, 28, 30, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(0, 200, 83, 0.15)',
                    },
                  }}
                >
                  <Avatar
                    src={item.image}
                    variant="rounded"
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 2,
                      backgroundColor: 'rgba(18, 18, 20, 0.5)',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#f5f5f7',
                        mb: 0.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#00C853',
                        mb: 1,
                      }}
                    >
                      {formatPrice(item.price)}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          borderRadius: 2,
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          sx={{ color: '#9a9aa0', p: 0.5 }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            px: 1.5,
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: '#f5f5f7',
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          sx={{ color: '#9a9aa0', p: 0.5 }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => removeFromCart(item.id)}
                        sx={{
                          color: '#6e6e73',
                          '&:hover': { color: '#FF5252' },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 3,
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(18, 18, 20, 0.8)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#9a9aa0' }}>Subtotal</Typography>
              <Typography sx={{ color: '#f5f5f7', fontWeight: 600 }}>
                {formatPrice(cartTotal)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#9a9aa0' }}>Delivery</Typography>
              <Typography sx={{ color: '#69F0AE', fontWeight: 600, fontSize: '0.9rem' }}>
                FREE
              </Typography>
            </Box>
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.06)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#f5f5f7', fontSize: '1.1rem' }}>
                Total
              </Typography>
              <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#00C853' }}>
                {formatPrice(cartTotal)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleWhatsAppOrder}
              startIcon={<WhatsApp />}
              sx={{
                borderRadius: 3,
                py: 1.5,
                mb: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #128C7E, #075E54)',
                  boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)',
                },
              }}
            >
              Order via WhatsApp
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={clearCart}
              sx={{
                borderRadius: 2,
                color: '#6e6e73',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                fontSize: '0.8rem',
                '&:hover': {
                  borderColor: 'rgba(255, 82, 82, 0.3)',
                  color: '#FF5252',
                  backgroundColor: 'rgba(255, 82, 82, 0.05)',
                },
              }}
            >
              Clear Cart
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}