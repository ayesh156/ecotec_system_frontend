// ============================================
// ECOTEC COMPUTER SOLUTIONS - PRODUCT DATA
// Ported from ecotec/src/data/products.js
// ============================================

export const categories = [
  {
    id: 'laptops',
    name: 'Laptops',
    icon: 'LaptopMac',
    description: 'Gaming & Business Laptops',
    image: '/gaming-laptop.png',
    count: 45,
  },
  {
    id: 'desktops',
    name: 'Desktops',
    icon: 'DesktopWindows',
    description: 'Custom Built PCs & Workstations',
    image: '/desktop-computer.png',
    count: 32,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'Mouse',
    description: 'Keyboards, Mice & More',
    image: '/accessories.png',
    count: 120,
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: 'Router',
    description: 'Routers, Switches & Cables',
    image: '/networking.png',
    count: 58,
  },
  {
    id: 'printers',
    name: 'Printers',
    icon: 'Print',
    description: 'Printers, Scanners & Ink',
    image: '/printers.png',
    count: 28,
  },
  {
    id: 'components',
    name: 'Components',
    icon: 'Memory',
    description: 'RAM, SSD, GPU & CPU',
    image: '/desktop-computer.png',
    count: 95,
  },
];

export const featuredProducts = [
  {
    id: 1,
    name: 'ASUS ROG Strix G16',
    category: 'laptops',
    price: 485000,
    originalPrice: 525000,
    rating: 4.8,
    reviews: 124,
    image: '/gaming-laptop.png',
    badge: 'Best Seller',
    specs: ['Intel Core i7-13650HX', 'RTX 4060 8GB', '16GB DDR5', '512GB SSD'],
    inStock: true,
  },
  {
    id: 2,
    name: 'HP Pavilion Desktop TP01',
    category: 'desktops',
    price: 215000,
    originalPrice: 245000,
    rating: 4.6,
    reviews: 89,
    image: '/desktop-computer.png',
    badge: 'Hot Deal',
    specs: ['AMD Ryzen 7 5700G', 'Radeon Graphics', '16GB DDR4', '1TB SSD'],
    inStock: true,
  },
  {
    id: 3,
    name: 'Logitech MX Master 3S',
    category: 'accessories',
    price: 32500,
    originalPrice: 38000,
    rating: 4.9,
    reviews: 256,
    image: '/accessories.png',
    badge: 'Top Rated',
    specs: ['8000 DPI Sensor', 'USB-C', 'Bluetooth', '70 Day Battery'],
    inStock: true,
  },
  {
    id: 4,
    name: 'TP-Link Archer AX73',
    category: 'networking',
    price: 28900,
    originalPrice: 35000,
    rating: 4.5,
    reviews: 67,
    image: '/networking.png',
    badge: 'New',
    specs: ['WiFi 6', 'AX5400', 'Dual Band', '6 Antennas'],
    inStock: true,
  },
  {
    id: 5,
    name: 'Acer Nitro V Gaming Laptop',
    category: 'laptops',
    price: 395000,
    originalPrice: 435000,
    rating: 4.7,
    reviews: 93,
    image: '/gaming-laptop.png',
    badge: 'Gaming',
    specs: ['Intel Core i5-13420H', 'RTX 4050 6GB', '8GB DDR5', '512GB SSD'],
    inStock: true,
  },
  {
    id: 6,
    name: 'Epson EcoTank L3250',
    category: 'printers',
    price: 48500,
    originalPrice: 55000,
    rating: 4.4,
    reviews: 45,
    image: '/printers.png',
    badge: 'Eco Friendly',
    specs: ['Wi-Fi', 'Print/Scan/Copy', 'Ink Tank', 'Borderless'],
    inStock: true,
  },
  {
    id: 7,
    name: 'Samsung 980 PRO SSD 1TB',
    category: 'components',
    price: 38000,
    originalPrice: 42000,
    rating: 4.9,
    reviews: 178,
    image: '/desktop-computer.png',
    badge: 'Fast',
    specs: ['NVMe M.2', '7000MB/s Read', 'PCIe 4.0', '1TB'],
    inStock: true,
  },
  {
    id: 8,
    name: 'Dell UltraSharp U2723QE',
    category: 'accessories',
    price: 185000,
    originalPrice: 210000,
    rating: 4.8,
    reviews: 56,
    image: '/accessories.png',
    badge: 'Premium',
    specs: ['4K UHD', 'USB-C Hub', 'IPS Black', '27 inch'],
    inStock: false,
  },
];

export const brands = [
  'ASUS', 'HP', 'Dell', 'Lenovo', 'Acer', 'MSI',
  'Logitech', 'TP-Link', 'Samsung', 'Epson',
  'Canon', 'Intel', 'AMD', 'NVIDIA', 'Corsair', 'Kingston',
];

export const testimonials = [
  {
    id: 1,
    name: 'Kasun Perera',
    role: 'Software Developer',
    text: 'Ecotec eken laptop ekak gattata passe mage work experience eka pura ma change una. Best prices and excellent service!',
    rating: 5,
    avatar: 'K',
  },
  {
    id: 2,
    name: 'Nadeesha Fernando',
    role: 'Graphic Designer',
    text: 'Mage desktop build eka Ecotec ekema karanne. Components quality ekata best prices denawa. Highly recommend!',
    rating: 5,
    avatar: 'N',
  },
  {
    id: 3,
    name: 'Chaminda Silva',
    role: 'Business Owner',
    text: 'Office eke computers, printers, networking setup eka hari Ecotec eken karala. Professional service and after-sales support.',
    rating: 5,
    avatar: 'C',
  },
];

export const storeInfo = {
  name: 'Ecotec Computer Solutions',
  tagline: 'Your Trusted Technology Partner',
  address: 'No.09, Mulatiyana Junction, Mulatiyana, Matara, Sri Lanka, 81071',
  phone: '071 145 3382',
  phoneIntl: '+94 71 145 3382',
  email: 'ecoteccomputersolutions@gmail.com',
  instagram: 'ecoteccomputersolutions',
  tiktok: '@ecoteccomputersolutions',
  youtube: '@ecoteccomputersolutions',
  whatsapp: '+94711453382',
  hours: {
    weekdays: '9:00 AM - 7:00 PM',
    saturday: '9:00 AM - 5:00 PM',
    sunday: 'Closed',
  },
};

export const services = [
  {
    title: 'Custom PC Building',
    description: 'We build custom PCs tailored to your needs - gaming, workstation, or everyday use.',
    icon: 'Build',
  },
  {
    title: 'Computer Repairs',
    description: 'Expert hardware & software repair services with quick turnaround time.',
    icon: 'Construction',
  },
  {
    title: 'Network Setup',
    description: 'Professional networking solutions for homes and businesses.',
    icon: 'Wifi',
  },
  {
    title: 'Data Recovery',
    description: 'Lost your data? We recover data from damaged drives and devices.',
    icon: 'Restore',
  },
];

// Format price to LKR
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage
export const calcDiscount = (original: number, current: number) => {
  return Math.round(((original - current) / original) * 100);
};