import { Box, Typography, Grid, Card, Button } from '@mui/material';
import { Build, Security, Speed, SettingsInputHdmi, CloudSync, SupportAgent, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const servicesList = [
  { icon: <Build sx={{ fontSize: 40 }} />, title: 'Hardware Repairs & Upgrades', desc: 'Expert diagnostic and repair services for laptops and desktops. We fix motherboard issues, screen replacements, and provide performance upgrades like SSDs and RAM.' },
  { icon: <SettingsInputHdmi sx={{ fontSize: 40 }} />, title: 'Custom PC Builds', desc: 'From high-end gaming rigs to professional workstations, we build customized computers tailored perfectly to your specific requirements and budget.' },
  { icon: <Security sx={{ fontSize: 40 }} />, title: 'Network & Security Setup', desc: 'Complete networking solutions for homes and offices. Router configuration, structured cabling, CCTV installation, and network security optimization.' },
  { icon: <Speed sx={{ fontSize: 40 }} />, title: 'System Optimization', desc: 'Is your computer running slow? We provide comprehensive software optimization, virus removal, and OS reinstallation to make your system fast again.' },
  { icon: <CloudSync sx={{ fontSize: 40 }} />, title: 'Data Recovery & Backup', desc: 'Accidentally deleted files or failing hard drive? Our technicians can recover lost data and set up automated backup systems to protect your valuable information.' },
  { icon: <SupportAgent sx={{ fontSize: 40 }} />, title: 'IT Support & Consultation', desc: 'Professional IT consultation for businesses. We help you choose the right technology infrastructure and provide ongoing maintenance contracts.' },
];

export default function Services() {
  return (
    <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10, backgroundColor: '#0a0a0c', minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 10, px: 2 }}>
        <Typography sx={{ color: '#00C853', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2, fontSize: '0.9rem' }}>What We Do Best</Typography>
        <Typography variant="h1" sx={{ color: '#fff', fontSize: { xs: '2.5rem', md: '4rem' }, mb: 3 }}>
          Our <Box component="span" sx={{ color: '#00C853' }}>Services</Box>
        </Typography>
        <Typography sx={{ color: '#9a9aa0', maxWidth: 700, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Beyond selling premium hardware, Ecotec Computer Solutions provides top-tier technical services.
        </Typography>
      </Box>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Grid container spacing={4}>
          {servicesList.map((service, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card sx={{ p: 4, height: '100%', background: 'rgba(28, 28, 30, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 4, transition: 'all 0.4s ease', animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`, '&:hover': { transform: 'translateY(-10px)', borderColor: 'rgba(0, 200, 83, 0.4)', boxShadow: '0 20px 40px rgba(0, 200, 83, 0.1)', background: 'rgba(28, 28, 30, 0.8)', '& .icon-box': { background: 'linear-gradient(135deg, #00C853, #00E676)', color: '#fff', transform: 'scale(1.1)' } } }}>
                <Box className="icon-box" sx={{ width: 70, height: 70, borderRadius: 3, background: 'rgba(0, 200, 83, 0.1)', color: '#00C853', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, transition: 'all 0.4s ease' }}>
                  {service.icon}
                </Box>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>{service.title}</Typography>
                <Typography sx={{ color: '#9a9aa0', lineHeight: 1.7 }}>{service.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 10, p: { xs: 4, md: 8 }, borderRadius: 4, background: 'linear-gradient(135deg, rgba(0,200,83,0.1) 0%, rgba(10,10,12,0.8) 100%)', border: '1px solid rgba(0, 200, 83, 0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: '-50%', left: '-10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,200,83,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <Typography variant="h3" sx={{ color: '#fff', mb: 2, position: 'relative', zIndex: 2 }}>Need technical assistance?</Typography>
          <Typography sx={{ color: '#c7c7cc', mb: 4, maxWidth: 600, margin: '0 auto 30px', position: 'relative', zIndex: 2 }}>
            Bring your device to our store in Mulatiyana, or contact us to schedule a service appointment.
          </Typography>
          <Button component={Link} to="/contact" variant="contained" size="large" endIcon={<ArrowForward />} sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 3, background: 'linear-gradient(135deg, #00C853, #00E676)', position: 'relative', zIndex: 2 }}>
            Contact Support
          </Button>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}