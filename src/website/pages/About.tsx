import { Box, Typography, Grid } from '@mui/material';
import { LaptopMac, EmojiEvents, Handshake } from '@mui/icons-material';

export default function About() {
  return (
    <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10, backgroundColor: '#0a0a0c', minHeight: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 }, position: 'relative', mb: 12 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="animate-slide-left">
                <Typography sx={{ color: '#00C853', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2, fontSize: '0.9rem' }}>Our Story</Typography>
                <Typography variant="h1" sx={{ color: '#fff', fontSize: { xs: '2.5rem', md: '4rem' }, mb: 3, lineHeight: 1.1 }}>
                  Empowering the community through <Box component="span" sx={{ color: '#00C853' }}>Technology</Box>
                </Typography>
                <Typography sx={{ color: '#c7c7cc', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>
                  Founded in Mulatiyana, Matara, Ecotec Computer Solutions started with a simple vision: to make premium technology and expert IT services accessible to everyone in our community.
                </Typography>
                <Typography sx={{ color: '#9a9aa0', fontSize: '1rem', lineHeight: 1.7 }}>
                  Today, we are the leading technology hub in the region, providing top-tier laptops, custom desktop builds, and professional repair services. We pride ourselves on our honesty, technical expertise, and unmatched after-sales support.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="animate-slide-right" sx={{ position: 'relative', height: { xs: 300, md: 500 }, borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,200,83,0.15)', border: '1px solid rgba(0,200,83,0.2)' }}>
                <Box component="img" src="/hero-banner.png" alt="Ecotec Store" sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,12,0.9), transparent)' }} />
                <Box sx={{ position: 'absolute', bottom: 30, left: 30 }}>
                  <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: '#00C853', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <LaptopMac sx={{ color: '#fff', fontSize: 30 }} />
                  </Box>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>Ecotec</Typography>
                  <Typography sx={{ color: '#00C853' }}>Established Technology Partner</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={{ background: 'linear-gradient(180deg, rgba(28,28,30,0.4) 0%, transparent 100%)', py: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
          <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            <Typography variant="h3" sx={{ color: '#fff', textAlign: 'center', mb: 8 }}>Our Core Values</Typography>
            <Grid container spacing={4}>
              {[
                { icon: <EmojiEvents />, title: 'Excellence', desc: 'We never compromise on quality. Every product we sell and every repair we perform meets the highest industry standards.' },
                { icon: <Handshake />, title: 'Trust', desc: 'Honesty is our foundation. We provide transparent pricing, genuine advice, and reliable warranties you can count on.' },
                { icon: <LaptopMac />, title: 'Innovation', desc: 'We stay ahead of the curve, constantly updating our inventory and knowledge to bring you the latest technological advancements.' }
              ].map((val, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ width: 80, height: 80, margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(0,200,83,0.1)', color: '#00C853', display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { fontSize: 40 } }}>
                      {val.icon}
                    </Box>
                    <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>{val.title}</Typography>
                    <Typography sx={{ color: '#9a9aa0', lineHeight: 1.6 }}>{val.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}