import { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Button,
  Skeleton,
} from '@mui/material';
import {
  AddShoppingCart,
  FavoriteBorder,
  Visibility,
} from '@mui/icons-material';
import { formatPrice, calcDiscount } from '../data/products';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  specs?: string[];
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

/** Map product category keywords to high-quality Unsplash fallback images */
const CATEGORY_FALLBACKS: Record<string, string> = {
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  'mobile-phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  printers: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
  storage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
  ram: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
  components: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
};

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';

function getFallbackImage(category: string): string {
  const normalized = category.toLowerCase().replace(/\s+/g, '-');
  for (const [key, url] of Object.entries(CATEGORY_FALLBACKS)) {
    if (normalized.includes(key)) return url;
  }
  return DEFAULT_FALLBACK;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const discount = calcDiscount(product.originalPrice, product.price);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const imageSrc = !product.image || imageError
    ? getFallbackImage(product.category)
    : product.image;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: 'rgba(28, 28, 30, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 4,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 24px 60px rgba(0, 200, 83, 0.12)',
          borderColor: 'rgba(0, 200, 83, 0.25)',
          '& .product-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '& .product-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Badge */}
      {product.badge && (
        <Chip
          label={product.badge}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            fontWeight: 700,
            fontSize: '0.7rem',
            background:
              product.badge === 'Best Seller'
                ? 'linear-gradient(135deg, #FFD700, #FFA000)'
                : product.badge === 'Hot Deal'
                ? 'linear-gradient(135deg, #FF5252, #FF1744)'
                : product.badge === 'New'
                ? 'linear-gradient(135deg, #00C853, #00E676)'
                : 'linear-gradient(135deg, #7C4DFF, #536DFE)',
            color: '#fff',
            border: 'none',
            letterSpacing: '0.5px',
          }}
        />
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <Chip
          label={`-${discount}%`}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            fontWeight: 800,
            fontSize: '0.7rem',
            background: 'rgba(255, 23, 68, 0.9)',
            color: '#fff',
            border: 'none',
          }}
        />
      )}

      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px 16px 0 0',
          backgroundColor: 'rgba(18, 18, 20, 0.5)',
          aspectRatio: '4/3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Loading skeleton */}
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(255,255,255,0.04)',
            }}
          />
        )}

        <Box
          component="img"
          src={imageSrc}
          alt={product.name}
          className="product-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            display: imageLoading ? 'none' : 'block',
          }}
        />

        {/* Hover Actions Overlay */}
        <Box
          className="product-actions"
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            opacity: 0,
            transform: 'translateY(10px)',
            transition: 'all 0.3s ease',
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'rgba(28, 28, 30, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#f5f5f7',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(0, 200, 83, 0.2)',
                color: '#00C853',
              },
            }}
          >
            <FavoriteBorder fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'rgba(28, 28, 30, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#f5f5f7',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(0, 200, 83, 0.2)',
                color: '#00C853',
              },
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Box>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Chip
              label="Out of Stock"
              sx={{
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                backdropFilter: 'blur(4px)',
              }}
            />
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2.5,
          '&:last-child': { pb: 2.5 },
        }}
      >
        <Typography
          sx={{
            color: '#6e6e73',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            mb: 0.5,
          }}
        >
          {product.category}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: '1rem',
            color: '#f5f5f7',
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        {/* Specs */}
        {product.specs && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            {product.specs.slice(0, 2).map((spec: string) => (
              <Chip
                key={spec}
                label={spec}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#9a9aa0',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              />
            ))}
          </Box>
        )}

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Rating
            value={product.rating}
            precision={0.1}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': { color: '#FFD700' },
              '& .MuiRating-iconEmpty': { color: 'rgba(255, 215, 0, 0.2)' },
            }}
          />
          <Typography sx={{ color: '#6e6e73', fontSize: '0.75rem' }}>
            ({product.reviews})
          </Typography>
        </Box>

        {/* Price & Add to Cart */}
        <Box
          sx={{
            mt: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#00C853',
                lineHeight: 1.2,
              }}
            >
              {formatPrice(product.price)}
            </Typography>
            {product.originalPrice > product.price && (
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: '#6e6e73',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            size="small"
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            startIcon={<AddShoppingCart sx={{ fontSize: '1rem !important' }} />}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.8,
              fontSize: '0.78rem',
              minWidth: 'auto',
              background: product.inStock
                ? 'linear-gradient(135deg, #00C853, #00E676)'
                : undefined,
              '&:hover': product.inStock
                ? {
                    background: 'linear-gradient(135deg, #00a847, #00C853)',
                    transform: 'scale(1.02)',
                  }
                : undefined,
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}