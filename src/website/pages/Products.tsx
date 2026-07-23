import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  InputBase,
  Chip,
  MenuItem,
  Select,
  FormControl,
  Pagination,
  Button,
  Skeleton,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { formatPrice, calcDiscount } from '../data/products';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface PublicCategory {
  id: string;
  name: string;
  _count: { products: number };
}

interface PublicBrand {
  id: string;
  name: string;
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

/** Convert a POS Product from the backend into the shape ProductCard expects */
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

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Remote data state
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories & brands once
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/public/categories`).then(r => r.json()),
      fetch(`${API_BASE_URL}/public/brands`).then(r => r.json()),
    ]).then(([catRes, brandRes]) => {
      if (catRes.success) {
        setCategories(catRes.data);
      }
      if (brandRes.success) {
        setBrands(brandRes.data.map((b: any) => b.name));
      }
    }).catch(err => {
      console.error('Failed to load categories/brands:', err);
    });
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.set('categoryId', activeCategory);
    if (searchQuery) params.set('search', searchQuery);
    params.set('limit', '100');

    fetch(`${API_BASE_URL}/public/products?${params.toString()}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setPage(1);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    // Convert POS products to card-compatible format
    let result = products.map(toCardProduct);

    // Category filtering is already done server-side, but double-check
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) =>
          (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0)
        );
        break;
    }

    return result;
  }, [products, activeCategory, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10, minHeight: '100vh', backgroundColor: '#0a0a0c' }}>
      <Box sx={{ background: 'linear-gradient(180deg, rgba(0,200,83,0.05) 0%, transparent 100%)', mb: 6, pb: 4, px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography variant="h1" sx={{ color: '#fff', fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 2 }}>
            Our Products
          </Typography>
          <Typography sx={{ color: '#9a9aa0', fontSize: '1.1rem', maxWidth: 600 }}>
            Discover our premium selection of laptops, desktops, and accessories.
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box sx={{ background: 'rgba(28, 28, 30, 0.4)', borderRadius: 4, p: 3, border: '1px solid rgba(255,255,255,0.05)', position: { lg: 'sticky' }, top: { lg: 100 } }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList sx={{ color: '#00C853' }} /> Filters
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(28,28,30,0.6)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', px: 2, py: 1, mb: 4 }}>
                <Search sx={{ color: '#9a9aa0', mr: 1 }} />
                <InputBase fullWidth placeholder="Search products..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} sx={{ color: '#f5f5f7' }} />
              </Box>
              <Typography sx={{ color: '#f5f5f7', fontWeight: 600, mb: 2 }}>Categories</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                <Button onClick={() => handleCategoryChange('all')} sx={{ justifyContent: 'flex-start', color: activeCategory === 'all' ? '#00C853' : '#c7c7cc', background: activeCategory === 'all' ? 'rgba(0,200,83,0.1)' : 'transparent', textTransform: 'none', fontWeight: activeCategory === 'all' ? 600 : 400 }}>
                  All Products
                </Button>
                {categories.map((cat) => (
                  <Button key={cat.id} onClick={() => handleCategoryChange(cat.id)} sx={{ justifyContent: 'flex-start', color: activeCategory === cat.id ? '#00C853' : '#c7c7cc', background: activeCategory === cat.id ? 'rgba(0,200,83,0.1)' : 'transparent', textTransform: 'none', fontWeight: activeCategory === cat.id ? 600 : 400 }}>
                    {cat.name}
                  </Button>
                ))}
              </Box>
              <Typography sx={{ color: '#f5f5f7', fontWeight: 600, mb: 2 }}>Popular Brands</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {brands.slice(0, 8).map((brand) => (
                  <Chip key={brand} label={brand} variant="outlined" size="small" sx={{ color: '#9a9aa0', borderColor: 'rgba(255,255,255,0.1)', '&:hover': { borderColor: '#00C853', color: '#00C853' } }} />
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ color: '#c7c7cc' }}>
                Showing <Box component="span" sx={{ color: '#00C853', fontWeight: 700 }}>{loading ? '...' : filteredProducts.length}</Box> results
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty sx={{ color: '#f5f5f7', background: 'rgba(28, 28, 30, 0.6)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00C853' } }}>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="newest">Newest Arrivals</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {loading ? (
              <Grid container spacing={3}>
                {Array.from(new Array(6)).map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skel-${i}`}>
                    <ProductCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : paginatedProducts.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {paginatedProducts.map((product, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                      <ProductCard product={product} index={index} />
                    </Grid>
                  ))}
                </Grid>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" sx={{ '& .MuiPaginationItem-root': { color: '#c7c7cc', '&.Mui-selected': { backgroundColor: '#00C853', color: '#fff', fontWeight: 700 } } }} />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10, background: 'rgba(28,28,30,0.3)', borderRadius: 4 }}>
                <Search sx={{ fontSize: 60, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#fff', mb: 1 }}>No products found</Typography>
                <Typography sx={{ color: '#9a9aa0' }}>Try adjusting your search or filters.</Typography>
                <Button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} variant="outlined" sx={{ mt: 3 }}>Clear Filters</Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function ProductCardSkeleton() {
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
          width: '100%',
          aspectRatio: '4/3',
          bgcolor: 'rgba(255,255,255,0.04)',
        }}
      />
      <Box sx={{ p: 2.5 }}>
        <Skeleton variant="text" width="40%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }} />
        <Skeleton variant="text" width="80%" height={22} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }} />
        <Skeleton variant="text" width="60%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
        <Skeleton variant="text" width="40%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="30%" height={28} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Skeleton variant="rounded" width={56} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        </Box>
      </Box>
    </Box>
  );
}