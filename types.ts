export enum Category {
  CPU = 'Processor',
  MOBO = 'Motherboard',
  RAM = 'Memory',
  GPU = 'Graphics Card',
  STORAGE = 'Storage',
  PSU = 'Power Supply',
  CASE = 'Cabinet',
  COOLER = 'Cooler',
  MONITOR = 'Monitor',
}

export interface Part {
  id: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  brand: string;
  rating: number;
  
  // Compatibility specs
  socket?: string; // AM4, AM5, LGA1700
  chipset?: string; 
  memoryType?: 'DDR4' | 'DDR5';
  wattage?: number; // For PSU (capacity) or CPU/GPU (consumption)
  formFactor?: 'ATX' | 'mATX' | 'ITX';
  storageType?: 'NVMe' | 'SATA';
}

export interface BuildState {
  [Category.CPU]?: Part;
  [Category.MOBO]?: Part;
  [Category.RAM]?: Part;
  [Category.GPU]?: Part;
  [Category.STORAGE]?: Part;
  [Category.PSU]?: Part;
  [Category.CASE]?: Part;
  [Category.COOLER]?: Part;
  [Category.MONITOR]?: Part;
}

export const CATEGORY_ORDER = [
  Category.CPU,
  Category.MOBO,
  Category.RAM,
  Category.GPU,
  Category.STORAGE,
  Category.COOLER,
  Category.PSU,
  Category.CASE,
  Category.MONITOR
];