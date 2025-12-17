import { Part, Category } from './types';

// Helper to generate placeholder images
const getImg = (text: string) => `https://placehold.co/400x300/1e293b/indigo?text=${text.replace(/ /g, '+')}`;

export const PARTS_DATABASE: Part[] = [
  // --- CPUs ---
  {
    id: 'cpu-1',
    name: 'Intel Core i5-13600K',
    price: 28500,
    category: Category.CPU,
    brand: 'Intel',
    rating: 4.8,
    image: getImg('i5 13600K'),
    socket: 'LGA1700',
    memoryType: 'DDR5',
    wattage: 125
  },
  {
    id: 'cpu-2',
    name: 'AMD Ryzen 5 7600X',
    price: 21999,
    category: Category.CPU,
    brand: 'AMD',
    rating: 4.7,
    image: getImg('Ryzen 7600X'),
    socket: 'AM5',
    memoryType: 'DDR5',
    wattage: 105
  },
  {
    id: 'cpu-3',
    name: 'Intel Core i9-14900K',
    price: 54999,
    category: Category.CPU,
    brand: 'Intel',
    rating: 4.9,
    image: getImg('i9 14900K'),
    socket: 'LGA1700',
    memoryType: 'DDR5',
    wattage: 253
  },
  {
    id: 'cpu-4',
    name: 'AMD Ryzen 7 5700X',
    price: 16500,
    category: Category.CPU,
    brand: 'AMD',
    rating: 4.6,
    image: getImg('Ryzen 5700X'),
    socket: 'AM4',
    memoryType: 'DDR4',
    wattage: 65
  },

  // --- Motherboards ---
  {
    id: 'mobo-1',
    name: 'MSI PRO Z790-P WiFi',
    price: 22500,
    category: Category.MOBO,
    brand: 'MSI',
    rating: 4.5,
    image: getImg('MSI Z790'),
    socket: 'LGA1700',
    memoryType: 'DDR5',
    formFactor: 'ATX'
  },
  {
    id: 'mobo-2',
    name: 'Gigabyte B650 Gaming X AX',
    price: 18999,
    category: Category.MOBO,
    brand: 'Gigabyte',
    rating: 4.6,
    image: getImg('Gigabyte B650'),
    socket: 'AM5',
    memoryType: 'DDR5',
    formFactor: 'ATX'
  },
  {
    id: 'mobo-3',
    name: 'ASUS TUF Gaming B550-Plus',
    price: 14500,
    category: Category.MOBO,
    brand: 'ASUS',
    rating: 4.8,
    image: getImg('ASUS B550'),
    socket: 'AM4',
    memoryType: 'DDR4',
    formFactor: 'ATX'
  },

  // --- RAM ---
  {
    id: 'ram-1',
    name: 'Corsair Vengeance RGB 32GB (16x2) DDR5 6000MHz',
    price: 11500,
    category: Category.RAM,
    brand: 'Corsair',
    rating: 4.8,
    image: getImg('DDR5 32GB'),
    memoryType: 'DDR5'
  },
  {
    id: 'ram-2',
    name: 'G.Skill Ripjaws V 16GB (8x2) DDR4 3600MHz',
    price: 4500,
    category: Category.RAM,
    brand: 'G.Skill',
    rating: 4.7,
    image: getImg('DDR4 16GB'),
    memoryType: 'DDR4'
  },
  {
    id: 'ram-3',
    name: 'Adata XPG Lancer 16GB DDR5 5200MHz',
    price: 5200,
    category: Category.RAM,
    brand: 'Adata',
    rating: 4.5,
    image: getImg('DDR5 16GB'),
    memoryType: 'DDR5'
  },

  // --- GPU ---
  {
    id: 'gpu-1',
    name: 'Zotac Gaming GeForce RTX 4060 8GB',
    price: 29000,
    category: Category.GPU,
    brand: 'NVIDIA',
    rating: 4.6,
    image: getImg('RTX 4060'),
    wattage: 115
  },
  {
    id: 'gpu-2',
    name: 'Asus Dual Radeon RX 7700 XT 12GB',
    price: 43500,
    category: Category.GPU,
    brand: 'AMD',
    rating: 4.7,
    image: getImg('RX 7700 XT'),
    wattage: 245
  },
  {
    id: 'gpu-3',
    name: 'Gigabyte GeForce RTX 4070 Ti Super 16GB',
    price: 84999,
    category: Category.GPU,
    brand: 'NVIDIA',
    rating: 4.9,
    image: getImg('RTX 4070 Ti'),
    wattage: 285
  },

  // --- Storage ---
  {
    id: 'sto-1',
    name: 'WD Black SN850X 1TB NVMe',
    price: 8500,
    category: Category.STORAGE,
    brand: 'Western Digital',
    rating: 4.9,
    image: getImg('WD Black 1TB'),
    storageType: 'NVMe'
  },
  {
    id: 'sto-2',
    name: 'Crucial P3 Plus 1TB PCIe 4.0',
    price: 5900,
    category: Category.STORAGE,
    brand: 'Crucial',
    rating: 4.6,
    image: getImg('Crucial P3'),
    storageType: 'NVMe'
  },

  // --- PSU ---
  {
    id: 'psu-1',
    name: 'Corsair RM750e 750W 80+ Gold',
    price: 9500,
    category: Category.PSU,
    brand: 'Corsair',
    rating: 4.8,
    image: getImg('750W Gold'),
    wattage: 750
  },
  {
    id: 'psu-2',
    name: 'Deepcool PM650D 650W 80+ Gold',
    price: 5500,
    category: Category.PSU,
    brand: 'Deepcool',
    rating: 4.4,
    image: getImg('650W Gold'),
    wattage: 650
  },
  {
    id: 'psu-3',
    name: 'MSI MAG A850GL 850W PCIE5',
    price: 10500,
    category: Category.PSU,
    brand: 'MSI',
    rating: 4.8,
    image: getImg('850W PCIE5'),
    wattage: 850
  },

  // --- Case ---
  {
    id: 'case-1',
    name: 'NZXT H5 Flow RGB',
    price: 8900,
    category: Category.CASE,
    brand: 'NZXT',
    rating: 4.8,
    image: getImg('NZXT H5'),
    formFactor: 'ATX'
  },
  {
    id: 'case-2',
    name: 'Ant Esports ICE-100 Air Mini',
    price: 3500,
    category: Category.CASE,
    brand: 'Ant Esports',
    rating: 4.2,
    image: getImg('Ant Esports'),
    formFactor: 'mATX'
  },
  {
    id: 'case-3',
    name: 'Lian Li Lancool 216',
    price: 8999,
    category: Category.CASE,
    brand: 'Lian Li',
    rating: 4.9,
    image: getImg('Lian Li 216'),
    formFactor: 'ATX'
  },

   // --- Cooler ---
   {
    id: 'cool-1',
    name: 'Deepcool AK620 Digital Air Cooler',
    price: 6500,
    category: Category.COOLER,
    brand: 'Deepcool',
    rating: 4.7,
    image: getImg('AK620 Digital'),
  },
  {
    id: 'cool-2',
    name: 'Cooler Master MasterLiquid 240L',
    price: 5800,
    category: Category.COOLER,
    brand: 'Cooler Master',
    rating: 4.5,
    image: getImg('CM AIO 240'),
  },

  // --- Monitor ---
  {
    id: 'mon-1',
    name: 'LG Ultragear 27" 1440p 144Hz (27GN800)',
    price: 23000,
    category: Category.MONITOR,
    brand: 'LG',
    rating: 4.7,
    image: getImg('LG 27 2K'),
  },
  {
    id: 'mon-2',
    name: 'Acer Nitro VG240YS 24" 1080p 165Hz',
    price: 10500,
    category: Category.MONITOR,
    brand: 'Acer',
    rating: 4.4,
    image: getImg('Acer 24 165Hz'),
  }
];