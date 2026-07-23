import { Box, Container, Typography, Grid, TextField, Button, Card } from '@mui/material';
import { LocationOn, Phone, Email, WhatsApp, Send } from '@mui/icons-material';
import { storeInfo } from '../data/products';

export default function Contact() {
  return (
    <Box sx={{ pt: { xs: 12, md: 16 }, pb: 10, backgroundColor: '#0a0a0c', minHeight: '100vh' }}>
      <Box sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography sx={{ color: '#00C853', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', mb: 2, fontSize: '0.9rem' }}>Get in touch</Typography>
          <Typography variant="h1" sx={{ color: '#fff', fontSize: { xs: '2.5rem', md: '4rem' }, mb: 3 }}>
            Contact <Box component="span" sx={{ color: '#00C853' }}>Us</Box>
          </Typography>
          <Typography sx={{ color: '#9a9aa0', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem' }}>
            Have a question about a product or need technical support? We're here to help.
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { icon: <LocationOn />, title: 'Visit Our Store', content: storeInfo.address },
                { icon: <Phone />, title: 'Call Us', content: storeInfo.phone },
                { icon: <WhatsApp />, title: 'WhatsApp', content: storeInfo.phone },
                { icon: <Email />, title: 'Email Us', content: storeInfo.email },
              ].map((item, i) => (
                <Card key={i} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(28, 28, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 4 }}>
                  <Box sx={{ width: 50, height: 50, borderRadius: 2, background: 'rgba(0,200,83,0.1)', color: '#00C853', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>{item.title}</Typography>
                    <Typography sx={{ color: '#9a9aa0', fontSize: '0.9rem' }}>{item.content}</Typography>
                  </Box>
                </Card>
              ))}
              <Card sx={{ p: 4, mt: 2, background: 'linear-gradient(135deg, rgba(0,200,83,0.1) 0%, rgba(10,10,12,0.8) 100%)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: 4 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 700 }}>Business Hours</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ color: '#9a9aa0' }}>Monday - Friday</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{storeInfo.hours.weekdays}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ color: '#9a9aa0' }}>Saturday</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>{storeInfo.hours.saturday}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#9a9aa0' }}>Sunday</Typography>
                  <Typography sx={{ color: '#FF5252', fontWeight: 600 }}>{storeInfo.hours.sunday}</Typography>
                </Box>
              </Card>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Box sx={{ background: 'rgba(28, 28, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 4, p: { xs: 3, md: 6 }, height: '100%' }}>
              <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 700 }}>Send us a message</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#f5f5f7', mb: 1, fontSize: '0.9rem', fontWeight: 500 }}>Your Name</Typography>
                  <TextField fullWidth placeholder="John Doe" sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(10,10,12,0.5)' } }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: '#f5f5f7', mb: 1, fontSize: '0.9rem', fontWeight: 500 }}>Email Address</Typography>
                  <TextField fullWidth placeholder="john@example.com" sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(10,10,12,0.5)' } }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ color: '#f5f5f7', mb: 1, fontSize: '0.9rem', fontWeight: 500 }}>Subject</Typography>
                  <TextField fullWidth placeholder="How can we help you?" sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(10,10,12,0.5)' } }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ color: '#f5f5f7', mb: 1, fontSize: '0.9rem', fontWeight: 500 }}>Message</Typography>
                  <TextField fullWidth multiline rows={6} placeholder="Write your message here..." sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(10,10,12,0.5)' } }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant="contained" size="large" endIcon={<Send />} sx={{ mt: 2, px: 4, py: 1.5, background: 'linear-gradient(135deg, #00C853, #00E676)', borderRadius: 2 }}>Send Message</Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        </Box>
      </Box>
    </Box>
  );
}