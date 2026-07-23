import { useState, useEffect } from 'react';
import { Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ArrowForward,
  Star,
  Speed,
  SupportAgent,
  CheckCircle,
} from '@mui/icons-material';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Fallback category images based on category name
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  'desktops': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80',
  'accessories': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
  'audio': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
  'components': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
  'keyboards & mice': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  'mobile phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  'networking': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
  'printers': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
  'storage': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
  'tablets': 'https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?auto=format&fit=crop&w=600&q=80',
};

const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';

function getCategoryImage(category: PublicCategory): string {
  if (category.image && category.image.trim() !== '') {
    return category.image;
  }
  const key = category.name.toLowerCase();
  return CATEGORY_FALLBACK_IMAGES[key] || DEFAULT_CATEGORY_IMAGE;
}

interface PublicCategory {
  id: string;
  name: string;
  description: string | null;
  image?: string | null;
  _count: { products: number };
}

interface PublicProduct {
  id: string;
  name: string;
  price: number;
  costPrice: number | null;
  stock: number;
  image: string | null;
  description: string | null;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  brandId: string | null;
  brand: { id: string; name: string } | null;
  createdAt: string;
}

function toCardProduct(p: PublicProduct) {
  const categoryName = p.category?.name || 'Uncategorized';
  const brandName = p.brand?.name || '';
  return {
    id: parseInt(p.id.replace(/\D/g, '').slice(0, 8)) || Math.random(),
    name: p.name,
    category: categoryName.toLowerCase().replace(/\s+/g, '-'),
    price: p.price,
    originalPrice: p.costPrice ? p.costPrice * 1.3 : p.price,
    rating: 0,
    reviews: 0,
    image: p.image || '/placeholder-product.png',
    badge: p.stock > 5 ? undefined : (p.stock > 0 ? 'Low Stock' : 'Out of Stock'),
    specs: p.description ? [p.description.slice(0, 40)] : (brandName ? [brandName] : undefined),
    inStock: p.stock > 0,
  };
}

const testimonials = [
  {
    id: 1,
    name: 'Saman Perera',
    role: 'Small Business Owner',
    avatar: 'SP',
    rating: 5,
    text: 'Ecotec built me a custom workstation that handles all my design needs. Exceptional build quality and outstanding after-sales support!',
  },
  {
    id: 2,
    name: 'Nadeeka Fernando',
    role: 'Gaming Enthusiast',
    avatar: 'NF',
    rating: 5,
    text: 'Got my gaming rig from Ecotec. They understood exactly what I needed and built a beast of a machine within my budget. Highly recommend!',
  },
  {
    id: 3,
    name: 'Priyantha Silva',
    role: 'School IT Administrator',
    avatar: 'PS',
    rating: 5,
    text: 'We ve been sourcing all our computer hardware from Ecotec for our school. Reliable products, competitive prices, and they always deliver on time.',
  },
];

export default function Home() {
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/public/categories`).then(r => r.json()),
      fetch(`${API_BASE_URL}/public/products?limit=8&sortBy=name&sortOrder=asc`).then(r => r.json()),
    ])
      .then(([catRes, prodRes]) => {
        if (catRes.success) {
          setCategories(catRes.data);
        }
        if (prodRes.success) {
          setFeaturedProducts(prodRes.data.map(toCardProduct));
        }
      })
      .catch(err => {
        console.error('Failed to load homepage data:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ flex: 1, backgroundColor: '#0a0a0c' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '80vh', md: '600px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Background Image - absolute full-cover */}
        <Box
          component="img"
          src="/hero-banner.png"
          alt=""
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />

        {/* Dark overlay - solid dark tint */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 2,
          }}
        />

        {/* Floating glow effects behind text */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(0,200,83,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 3,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(0,200,83,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 3,
          }}
        />

        {/* TEXT CONTENT - positioned on top of everything */}
        <Box sx={{ position: 'relative', zIndex: 20, width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 }, maxWidth: '900px', mx: 'auto' }}>
          <Box>
            <Typography
              sx={{
                color: '#00C853',
                fontWeight: 700,
                letterSpacing: '3px',
                mb: 3,
                fontSize: { xs: '0.85rem', md: '1rem' },
                textTransform: 'uppercase',
                textShadow: '0 0 20px rgba(0,200,83,0.4)',
              }}
            >
              Welcome to Ecotec Computer Solutions
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4rem', lg: '4.8rem' },
                color: '#fff',
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.15,
                textShadow: '0 2px 30px rgba(0,0,0,0.5)',
                letterSpacing: '-0.5px',
              }}
            >
              ECOTEC{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #00C853, #69F0AE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                COMPUTER
              </Box>{' '}
              SOLUTIONS
            </Typography>

            <Typography
              sx={{
                color: '#e0e0e0',
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
                mb: 5,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.7,
                fontWeight: 400,
                textShadow: '0 1px 15px rgba(0,0,0,0.4)',
              }}
            >
              Your Ultimate Destination for High-Performance Gaming Systems, Laptops & Tech Solutions
            </Typography>

            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                sx={{
                  py: 1.6,
                  px: 5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00C853, #00E676)',
                  boxShadow: '0 8px 30px rgba(0,200,83,0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00a847, #00C853)',
                    boxShadow: '0 12px 35px rgba(0,200,83,0.6)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                Browse Products
              </Button>
              <Button
                component={Link}
                to="/services"
                variant="outlined"
                size="large"
                sx={{
                  py: 1.6,
                  px: 5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  fontWeight: 700,
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#00C853',
                    backgroundColor: 'rgba(0,200,83,0.1)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                Our Services
              </Button>
            </Box>

            <Box sx={{ mt: 7, display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>500+</Typography>
                <Typography sx={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Happy Customers</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)', height: 40 }} />
              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>10+</Typography>
                <Typography sx={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Top Brands</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)', height: 40 }} />
              <Box>
                <Box sx={{ display: 'flex', color: '#FFD700', mb: 0.5, justifyContent: 'center' }}>
                  <Star fontSize="small" />
                  <Star fontSize="small" />
                  <Star fontSize="small" />
                  <Star fontSize="small" />
                  <Star fontSize="small" />
                </Box>
                <Typography sx={{ color: '#b0b0b0', fontSize: '0.9rem' }}>5.0 Rating</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 10, position: 'relative', zIndex: 2, width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography sx={{ color: '#00C853', fontWeight: 600, letterSpacing: '1px', mb: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Browse by Category
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Shop Top Categories
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {categories.length === 0 && loading
            ? Array.from(new Array(4)).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`cat-sk-${i}`}>
                  <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.04)' }} />
                </Grid>
              ))
            : categories.slice(0, 4).map((category, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category.id}>
                  <Card
                    component={Link}
                    to={`/products?category=${category.id}`}
                    sx={{
                      textDecoration: 'none',
                      display: 'block',
                      height: '100%',
                      background: 'rgba(28, 28, 30, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.4s ease',
                      animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        borderColor: 'rgba(0, 200, 83, 0.4)',
                        boxShadow: '0 20px 40px rgba(0, 200, 83, 0.1)',
                        '& .cat-image': {
                          transform: 'scale(1.1)',
                        },
                        '& .cat-overlay': {
                          background: 'linear-gradient(0deg, rgba(10,10,12,0.9) 0%, rgba(0,200,83,0.2) 100%)',
                        }
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={getCategoryImage(category)}
                        alt={category.name}
                        className="cat-image"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.currentTarget;
                          const fallback = CATEGORY_FALLBACK_IMAGES[category.name.toLowerCase()] || DEFAULT_CATEGORY_IMAGE;
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                        }}
                      />
                      <Box
                        className="cat-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(0deg, rgba(10,10,12,1) 0%, rgba(10,10,12,0) 100%)',
                          transition: 'background 0.4s ease',
                        }}
                      />
                      <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                          {category.name}
                        </Typography>
                        <Typography sx={{ color: '#9a9aa0', fontSize: '0.85rem' }}>
                          {category.description || `${category._count?.products || 0} Products`}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box sx={{ py: 10, background: '#121214', width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ color: '#00C853', fontWeight: 600, letterSpacing: '1px', mb: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Handpicked Deals
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Featured Products
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/products"
            endIcon={<ArrowForward />}
            sx={{ color: '#00C853', '&:hover': { backgroundColor: 'rgba(0, 200, 83, 0.1)' } }}
          >
            View All Products
          </Button>
        </Box>

        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(4)).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`skeleton-${i}`}>
                  <FeaturedProductSkeleton />
                </Grid>
              ))
            : featuredProducts.slice(0, 8).map((product, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <ProductCard product={product} index={index} />
                </Grid>
              ))}
        </Grid>
      </Box>

      {/* Why Choose Us */}
      <Box sx={{ py: 12, position: 'relative', width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography sx={{ color: '#00C853', fontWeight: 600, letterSpacing: '1px', mb: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Why Ecotec
          </Typography>
          <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: '2rem', md: '2.5rem' } }}>
            The Best Choice for Tech
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { title: 'Premium Quality', desc: 'We only source from top brands ensuring maximum reliability.', icon: <CheckCircle /> },
            { title: 'Fast Support', desc: 'Expert technical team ready to assist you anytime.', icon: <SupportAgent /> },
            { title: 'Performance', desc: 'High-end setups designed for gaming and heavy workloads.', icon: <Speed /> },
          ].map((feature, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(28, 28, 30, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'rgba(0, 200, 83, 0.3)',
                    background: 'rgba(28, 28, 30, 0.8)',
                  }
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(0, 200, 83, 0.1)',
                    color: '#00C853',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    '& svg': { fontSize: 30 }
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: '#9a9aa0', lineHeight: 1.6 }}>
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 12, background: '#121214', width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: '2rem', md: '2.5rem' }, mb: 2 }}>
            What Our Clients Say
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((review) => (
            <Grid size={{ xs: 12, md: 4 }} key={review.id}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                }}
              >
                <Box sx={{ display: 'flex', color: '#FFD700', mb: 2 }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} fontSize="small" />
                  ))}
                </Box>
                <Typography sx={{ color: '#c7c7cc', fontSize: '1.05rem', mb: 4, fontStyle: 'italic', lineHeight: 1.7 }}>
                  "{review.text}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #00C853, #00E676)', color: '#fff', fontWeight: 700 }}>
                    {review.avatar}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{review.name}</Typography>
                    <Typography sx={{ color: '#00C853', fontSize: '0.85rem' }}>{review.role}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function FeaturedProductSkeleton() {
  return (
    <Box
      sx={{
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'rgba(28, 28, 30, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          pt: '75%',
          width: '100%',
          bgcolor: 'rgba(255,255,255,0.04)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <Box sx={{ p: 2.5 }}>
        <Skeleton variant="text" width="40%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }} />
        <Skeleton variant="text" width="80%" height={22} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }} />
        <Skeleton variant="text" width="60%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="30%" height={28} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="rounded" width={56} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        </Box>
      </Box>
    </Box>
  );
}