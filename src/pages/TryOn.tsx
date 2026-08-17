import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { success } from '@/lib/toast';
import { Bookmark, ChevronLeft, ChevronRight, Download, LoaderCircle, MoreVertical, RotateCw, Scissors, Shirt, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/navigation';
import { Badge } from '@/components/ui/badge';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import CampaignSection from '@/components/editorial/CampaignSection';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { CAMPAIGN } from '@/lib/editorial-images';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import { useStyleStore } from '@/store/useStyleStore';
import { useTryOn } from '@/hooks/useTryOn';
import { getSeasonInfo } from '@/lib/colour-data';
import { assetUrl } from '@/services/api';
import { INDIAN_HAIR_STYLES, INDIAN_MAKEUP_LOOKS } from '@/lib/tryon-styles';
import { cn, srcsetFromUrl } from '@/lib/utils';

type Mode = 'outfits' | 'makeup' | 'hair';
type GarmentCategory = 'Everyday' | 'Office' | 'Casual' | 'Festive' | 'Wedding' | 'Party' | 'Bridal' | 'Traditional' | 'Suit' | 'Lehenga';
type Gender = 'All' | 'Women' | 'Men';

interface Garment {
  id: number;
  name: string;
  category: GarmentCategory;
  gender: 'Women' | 'Men';
  img: string;
  colourHex: string;
  colourName: string;
  buyUrl?: string;
}

interface Selected {
  kind: 'outfit' | 'look' | 'hair';
  id: string;
  name: string;
  img: string;
  colourName?: string;
  colourHex?: string;
}

const GARMENT_CATEGORIES: GarmentCategory[] = ['Everyday', 'Office', 'Casual', 'Festive', 'Wedding', 'Party', 'Bridal', 'Traditional', 'Suit', 'Lehenga'];

const garments: Garment[] = [
  // â”€â”€ Everyday â€” Women & Men â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Everyday

  // â”€â”€ Office â€” Women & Men â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Office

  // â”€â”€ Casual â€” Women & Men â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Casual

  // â”€â”€ Festive â€” Women & Men â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Festive

  // â”€â”€ Wedding â€” Women & Men â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Wedding

  // â”€â”€ Party â€” Women & Men â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Party

  // â”€â”€ Bridal â€” Women & Men (Groom Ensembles) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Groom / Bridal

  // â”€â”€ Traditional â€” Women & Men â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Men Traditional

  // â”€â”€ Extended men's range â€” regional & occasion wear â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  { id: 159, category: 'Everyday', gender: 'Men', name: 'Classic Cotton T-Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/products/Snitch_March22_4094.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Beige', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 160, category: 'Everyday', gender: 'Men', name: 'Relaxed Linen Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/products/Arnold_march13th1525.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Natural Linen', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 161, category: 'Everyday', gender: 'Men', name: 'Essential Polo T-Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/af46e7db373878ad44bbdfe197b17a6b.webp?width=600', colourHex: '#2980B9', colourName: 'Navy Blue', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 162, category: 'Everyday', gender: 'Men', name: 'Casual Cotton Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/products/Snitch_March22_4171.jpg?width=600', colourHex: '#1A237E', colourName: 'Indigo', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 163, category: 'Everyday', gender: 'Men', name: 'Printed Casual Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/2e248750e8022a8c05deadc64feffa75.webp?width=600', colourHex: '#FFFFFF', colourName: 'Pure White', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 164, category: 'Everyday', gender: 'Men', name: 'Checked Casual Shirt', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/65KO_5393Maroon_1.jpg?width=600', colourHex: '#C0392B', colourName: 'Crimson', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 165, category: 'Everyday', gender: 'Men', name: 'Half Sleeve Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/34fccbd88dd45fb3def31efc5f68a8cc.webp?width=600', colourHex: '#16A085', colourName: 'Teal', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 166, category: 'Everyday', gender: 'Men', name: 'Mandarin Collar Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS2749-01-M43.jpg?width=600', colourHex: '#8E44AD', colourName: 'Violet', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 167, category: 'Everyday', gender: 'Men', name: 'Cotton Band Collar Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS2653-12-M19.jpg?width=600', colourHex: '#FFFFFF', colourName: 'Pure White', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 168, category: 'Everyday', gender: 'Men', name: 'Short Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_5095Olive_1.jpg?width=600', colourHex: '#27AE60', colourName: 'Emerald', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 169, category: 'Everyday', gender: 'Men', name: 'Printed Short Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/65SK_5564Purple_1.jpg?width=600', colourHex: '#D35400', colourName: 'Terracotta', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 170, category: 'Everyday', gender: 'Men', name: 'Cotton Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_650Sky_1.jpg?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 171, category: 'Everyday', gender: 'Men', name: 'Chikankari Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_678Black_2.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 172, category: 'Everyday', gender: 'Men', name: 'Linen Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_650Teal_1_6b7b3d93-c4b7-49ab-a3ea-4782b364f61b.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Natural Linen', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 173, category: 'Everyday', gender: 'Men', name: 'Casual Kurta Pant Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/65KO_5397Brown_1.jpg?width=600', colourHex: '#E74C3C', colourName: 'Coral', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 174, category: 'Everyday', gender: 'Men', name: 'Cotton Kurta Pajama', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_650Lemon_1.jpg?width=600', colourHex: '#581845', colourName: 'Plum', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 175, category: 'Everyday', gender: 'Men', name: 'Everyday Chinos', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/5f75ad1632170a7aa6f7dab5e6265f2a.webp?width=600', colourHex: '#C19A6B', colourName: 'Khaki Tan', buyUrl: 'https://www.myntra.com/men-trousers' },
  { id: 176, category: 'Everyday', gender: 'Men', name: 'Relaxed Cotton Trousers', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOPJ_011White_1_fd42beb6-ee49-437e-b8a3-535de3a39c3c.jpg?width=600', colourHex: '#7F8C8D', colourName: 'Slate Grey', buyUrl: 'https://www.myntra.com/men-trousers' },
  { id: 177, category: 'Everyday', gender: 'Men', name: 'Casual Cargo Pants', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/65SK_5397Pista_1.jpg?width=600', colourHex: '#1A1A1A', colourName: 'Onyx Black', buyUrl: 'https://www.myntra.com/men-trousers' },
  { id: 178, category: 'Everyday', gender: 'Men', name: 'Everyday Denim Jeans', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/44dd1df52bc361d659a97345cc9e17e1.webp?width=600', colourHex: '#2980B9', colourName: 'Washed Denim', buyUrl: 'https://www.myntra.com/men-jeans' },
  { id: 259, category: 'Office', gender: 'Men', name: 'Classic Formal Shirt', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/PAIZERPINKSHIRT_2_-Copy-vmake.png?width=600', colourHex: '#F5F1E8', colourName: 'Beige', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 260, category: 'Office', gender: 'Men', name: 'Oxford Business Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_36dcf199-fbd1-4f9c-a5d8-30cca60e7a6f.jpg?width=600', colourHex: '#2980B9', colourName: 'Royal Blue', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 261, category: 'Office', gender: 'Men', name: 'Solid Formal Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3877-06_1_3a68c86b-ecfe-47d1-88dc-399b999e81ba.jpg?width=600', colourHex: '#E67E22', colourName: 'Amber', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 262, category: 'Office', gender: 'Men', name: 'Striped Formal Shirt', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/UNIOS-WHITE-02263HERO.webp?width=600', colourHex: '#1A237E', colourName: 'Indigo', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 263, category: 'Office', gender: 'Men', name: 'Checked Formal Shirt', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/HERO-CROP_a08d0a68-d208-4dfe-b5e3-3fecbac936b1.jpg?width=600', colourHex: '#FFFFFF', colourName: 'Pure White', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 264, category: 'Office', gender: 'Men', name: 'Slim Fit Dress Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3513-08-M28_67bdea09-7c54-41cb-baa1-ece47c57624a.jpg?width=600', colourHex: '#C0392B', colourName: 'Crimson', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 265, category: 'Office', gender: 'Men', name: 'Mandarin Collar Formal Shirt', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MANDERINORANGE03105_57101ca8-241b-4b65-8286-9459dd90db33.webp?width=600', colourHex: '#16A085', colourName: 'Teal', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 266, category: 'Office', gender: 'Men', name: 'Linen Formal Shirt', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/HERO_38dc72aa-387d-4b69-b274-a03e2673e2c7.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Natural Linen', buyUrl: 'https://www.myntra.com/men-formal-shirts' },
  { id: 267, category: 'Office', gender: 'Men', name: 'Classic Navy Blazer', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/8907279520319_8_hm.webp?width=600', colourHex: '#7F8C8D', colourName: 'Ash Grey', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 268, category: 'Office', gender: 'Men', name: 'Charcoal Blazer', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MCR1007-02_1_5751d75a-8996-4181-ad9d-9e64e1e2d48e.jpg?width=600', colourHex: '#2C3E50', colourName: 'Charcoal', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 269, category: 'Office', gender: 'Men', name: 'Grey Formal Blazer', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/IMG_0115_91356624-2547-4c22-8e25-5c87a3e4bd06.jpg?width=600', colourHex: '#7F8C8D', colourName: 'Slate Grey', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 270, category: 'Office', gender: 'Men', name: 'Textured Formal Blazer', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/VENIZIA-BROWN1555_fccdfd83-000a-406a-9d89-bf88fffecc98.jpg?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 271, category: 'Office', gender: 'Men', name: 'Double Breasted Blazer', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/f99f5a4fdb3bf68f37642146376c39b2.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 272, category: 'Office', gender: 'Men', name: 'Slim Fit Formal Trousers', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/WATERSORANGE00116.webp?width=600', colourHex: '#2C3E50', colourName: 'Midnight', buyUrl: 'https://www.myntra.com/men-formal-trousers' },
  { id: 273, category: 'Office', gender: 'Men', name: 'Classic Formal Trousers', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/8907279267825hm.webp?width=600', colourHex: '#E74C3C', colourName: 'Coral', buyUrl: 'https://www.myntra.com/men-formal-trousers' },
  { id: 274, category: 'Office', gender: 'Men', name: 'Formal Waistcoat', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/0E4A6085.jpg?width=600', colourHex: '#581845', colourName: 'Plum', buyUrl: 'https://www.myntra.com/men-waistcoats' },
  { id: 275, category: 'Office', gender: 'Men', name: 'Classic Formal Suit', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/HERO_3fdbf85e-9117-4659-a96c-a8c331cf0e2c.jpg?width=600', colourHex: '#F4D03F', colourName: 'Marigold', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 276, category: 'Office', gender: 'Men', name: 'Bandhgala Suit', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/IMG_0085_8ae1dc7e-208e-4758-a1ca-0e7ab28f9dc2.jpg?width=600', colourHex: '#C19A6B', colourName: 'Sand', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 277, category: 'Office', gender: 'Men', name: 'Minimal Nehru Jacket', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/8907279559173_8_hm.webp?width=600', colourHex: '#BDC3C7', colourName: 'Pewter', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 278, category: 'Office', gender: 'Men', name: 'Formal Kurta Trousers Set', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/9515b6311b43a5cda840ca93cf83eddc.jpg?width=600', colourHex: '#1A1A1A', colourName: 'Onyx', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 359, category: 'Casual', gender: 'Men', name: 'Oversized Graphic T-Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mst2898-01_3.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Beige', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 360, category: 'Casual', gender: 'Men', name: 'Relaxed Polo T-Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2242-01-M31.jpg?width=600', colourHex: '#2980B9', colourName: 'Royal Blue', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 361, category: 'Casual', gender: 'Men', name: 'Striped Polo T-Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2242-03-M29.jpg?width=600', colourHex: '#E67E22', colourName: 'Amber', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 362, category: 'Casual', gender: 'Men', name: 'Cuban Collar Shirt', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/CLAY-BEIGE4726.jpg?width=600', colourHex: '#1A237E', colourName: 'Indigo', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 363, category: 'Casual', gender: 'Men', name: 'Resort Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2180-03-M22.jpg?width=600', colourHex: '#FFFFFF', colourName: 'Pure White', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 364, category: 'Casual', gender: 'Men', name: 'Printed Casual Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1001ea357c74ca3fa869bf48b807616d.jpg?width=600', colourHex: '#C0392B', colourName: 'Crimson', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 365, category: 'Casual', gender: 'Men', name: 'Linen Casual Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_de5f8fb2-dc24-4278-9681-68108ab17a68.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Natural Linen', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 366, category: 'Casual', gender: 'Men', name: 'Denim Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2228-03-M17.jpg?width=600', colourHex: '#2980B9', colourName: 'Washed Denim', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 367, category: 'Casual', gender: 'Men', name: 'Flannel Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mss4676-02_1.jpg?width=600', colourHex: '#7F8C8D', colourName: 'Ash Grey', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 368, category: 'Casual', gender: 'Men', name: 'Oversized Casual Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/products/Augusto2876.jpg?width=600', colourHex: '#27AE60', colourName: 'Emerald', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 369, category: 'Casual', gender: 'Men', name: 'Short Kurta', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/c0ca3072f2c98567a9a3367be5a26dd6.jpg?width=600', colourHex: '#D35400', colourName: 'Terracotta', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 370, category: 'Casual', gender: 'Men', name: 'Printed Kurta', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/548c3ec47a589f10fa78291b92880695.webp?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 371, category: 'Casual', gender: 'Men', name: 'Casual Pathani Kurta', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2418-0331.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 372, category: 'Casual', gender: 'Men', name: 'Casual Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2242-04-M31.jpg?width=600', colourHex: '#2C3E50', colourName: 'Midnight', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 373, category: 'Casual', gender: 'Men', name: 'Denim Jacket', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/3ab566c63dc5b0d037951f6f7e824b83.webp?width=600', colourHex: '#2980B9', colourName: 'Washed Denim', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 374, category: 'Casual', gender: 'Men', name: 'Bomber Jacket', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2068-04-M14851.jpg?width=600', colourHex: '#581845', colourName: 'Plum', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 375, category: 'Casual', gender: 'Men', name: 'Varsity Jacket', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2201-03-M41.jpg?width=600', colourHex: '#F4D03F', colourName: 'Marigold', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 376, category: 'Casual', gender: 'Men', name: 'Relaxed Denim Jeans', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_dd7005e6-c0fe-4c87-8ca9-8eadcee48237.jpg?width=600', colourHex: '#2980B9', colourName: 'Washed Denim', buyUrl: 'https://www.myntra.com/men-jeans' },
  { id: 377, category: 'Casual', gender: 'Men', name: 'Cargo Trousers', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2418-02-M25.jpg?width=600', colourHex: '#BDC3C7', colourName: 'Pewter', buyUrl: 'https://www.myntra.com/men-trousers' },
  { id: 378, category: 'Casual', gender: 'Men', name: 'Casual Jogger Pants', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/d9965ed82687bd15004f2d1f89439008.webp?width=600', colourHex: '#1A1A1A', colourName: 'Onyx', buyUrl: 'https://www.myntra.com/men-joggers' },
  { id: 459, category: 'Festive', gender: 'Men', name: 'Embroidered Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/DSC07968_9cc2c367-3fce-4896-9c4e-3fb36f29ec32.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Beige', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 460, category: 'Festive', gender: 'Men', name: 'Chikankari Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_678Purple_1_a236383f-0b66-4848-9d29-975a8ac46d8c.jpg?width=600', colourHex: '#2980B9', colourName: 'Royal Blue', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 461, category: 'Festive', gender: 'Men', name: 'Silk Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/65KP_PJ11B_5356Black_6.jpg?width=600', colourHex: '#E67E22', colourName: 'Amber', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 462, category: 'Festive', gender: 'Men', name: 'Banarasi Silk Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_5256Black_1.jpg?width=600', colourHex: '#1A237E', colourName: 'Indigo', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 463, category: 'Festive', gender: 'Men', name: 'Printed Silk Kurta', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-DPrint-03-P001-NJ-DFlwr-1125-SBlue-1_a3894aa4-59e1-4636-9fd1-b2253a1b60a6.jpg?width=600', colourHex: '#FFFFFF', colourName: 'Pure White', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 464, category: 'Festive', gender: 'Men', name: 'Zari Embroidered Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_5005Navy_1.jpg?width=600', colourHex: '#C0392B', colourName: 'Crimson', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 465, category: 'Festive', gender: 'Men', name: 'Mirror Work Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_5006Coral_1.jpg?width=600', colourHex: '#16A085', colourName: 'Teal', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 466, category: 'Festive', gender: 'Men', name: 'Velvet Kurta', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-HvyKroch-1412-P041-NJ-StnFrama-1811-Crm-1_05fa01a5-4e6f-4c5a-8deb-ac3ca803b60c.jpg?width=600', colourHex: '#581845', colourName: 'Wine Velvet', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 467, category: 'Festive', gender: 'Men', name: 'Embroidered Kurta Pajama', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_5005Beige_1_33a2727b-2add-472f-994d-fb1ac6c94b94.jpg?width=600', colourHex: '#7F8C8D', colourName: 'Ash Grey', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 468, category: 'Festive', gender: 'Men', name: 'Silk Kurta Pajama', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/65KP_PJ11W_5356White_1.jpg?width=600', colourHex: '#27AE60', colourName: 'Emerald', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 469, category: 'Festive', gender: 'Men', name: 'Festive Pathani Set', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/LASMOS-B-LIGHT-GREY04009.jpg?width=600', colourHex: '#D35400', colourName: 'Terracotta', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 470, category: 'Festive', gender: 'Men', name: 'Dhoti Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/WhatsAppImage2023-07-12at1.47.31PM.jpg?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 471, category: 'Festive', gender: 'Men', name: 'Embroidered Dhoti Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/KO_5006Purple_1.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 472, category: 'Festive', gender: 'Men', name: 'Festive Nehru Jacket', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/lasmos-b1offwhitehm.webp?width=600', colourHex: '#2C3E50', colourName: 'Midnight', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 473, category: 'Festive', gender: 'Men', name: 'Silk Nehru Jacket', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-Dup-096-Crm-NJ-BootaDmn-1784-Wine-1_323c3e3e-621f-4e97-a4a4-c91ef5614934.jpg?width=600', colourHex: '#E74C3C', colourName: 'Coral', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 474, category: 'Festive', gender: 'Men', name: 'Brocade Nehru Jacket', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/DELIAPINK_4.webp?width=600', colourHex: '#581845', colourName: 'Plum', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 475, category: 'Festive', gender: 'Men', name: 'Festive Bandhgala', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/8907279615084_4.webp?width=600', colourHex: '#F4D03F', colourName: 'Marigold', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 476, category: 'Festive', gender: 'Men', name: 'Embroidered Bandhgala', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/emerald-mens-bandi-light-beige27624_08afc945-8d9f-4533-a298-eefea737ef1b.jpg?width=600', colourHex: '#C19A6B', colourName: 'Sand', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 477, category: 'Festive', gender: 'Men', name: 'Festive Indo-Western Set', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MITZIOFFWHITEhm.webp?width=600', colourHex: '#BDC3C7', colourName: 'Pewter', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 478, category: 'Festive', gender: 'Men', name: 'Designer Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-Pintex-304-P001-NJ-DFlwr-1122-Pink-1_866d04f6-0285-458f-a11e-9a28c3eddb7a.jpg?width=600', colourHex: '#1A1A1A', colourName: 'Onyx', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 559, category: 'Wedding', gender: 'Men', name: 'Royal Wedding Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_146Purple_1.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Beige', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 560, category: 'Wedding', gender: 'Men', name: 'Ivory Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_142Black_1.jpg?width=600', colourHex: '#FDEBD0', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 561, category: 'Wedding', gender: 'Men', name: 'Cream Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_145Beige_1.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Cream', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 562, category: 'Wedding', gender: 'Men', name: 'Pastel Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MEDO-B-PASTEL-PURPLE04093.jpg?width=600', colourHex: '#F8BBD0', colourName: 'Pastel Rose', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 563, category: 'Wedding', gender: 'Men', name: 'Maroon Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/8907279615534_1_-hm.webp?width=600', colourHex: '#900C3F', colourName: 'Deep Maroon', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 564, category: 'Wedding', gender: 'Men', name: 'Velvet Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/zivapurplehm.webp?width=600', colourHex: '#581845', colourName: 'Wine Velvet', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 565, category: 'Wedding', gender: 'Men', name: 'Silk Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_137Cream_1.jpg?width=600', colourHex: '#16A085', colourName: 'Teal', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 566, category: 'Wedding', gender: 'Men', name: 'Brocade Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_144Navy_1.jpg?width=600', colourHex: '#8E44AD', colourName: 'Violet', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 567, category: 'Wedding', gender: 'Men', name: 'Zardozi Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_140White_1.jpg?width=600', colourHex: '#7F8C8D', colourName: 'Ash Grey', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 568, category: 'Wedding', gender: 'Men', name: 'Embroidered Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/EMERALD-LIGHT-BLUE-CC3348HERO.jpg?width=600', colourHex: '#27AE60', colourName: 'Emerald', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 569, category: 'Wedding', gender: 'Men', name: 'Designer Achkan', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-Sun-Boota-1184-Blk-P012-NJ-DFlwr-1122-Pch-1_0c100aaf-fa58-4812-b4ae-2d522f3b9a39.jpg?width=600', colourHex: '#D35400', colourName: 'Terracotta', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 570, category: 'Wedding', gender: 'Men', name: 'Embroidered Achkan', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MITZI-BLACK_1_-hm.webp?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 571, category: 'Wedding', gender: 'Men', name: 'Silk Achkan', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_176Pista_1.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 572, category: 'Wedding', gender: 'Men', name: 'Velvet Achkan', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/IMG_0081_5197a89a-e15d-45eb-9589-1104bfab3d53.jpg?width=600', colourHex: '#581845', colourName: 'Wine Velvet', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 573, category: 'Wedding', gender: 'Men', name: 'Wedding Indo-Western Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_179Blue_1.jpg?width=600', colourHex: '#E74C3C', colourName: 'Coral', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 574, category: 'Wedding', gender: 'Men', name: 'Embroidered Indo-Western Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/1_6833ba36-96fa-4395-bee7-40f5be251dac.jpg?width=600', colourHex: '#581845', colourName: 'Plum', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 575, category: 'Wedding', gender: 'Men', name: 'Classic Jodhpuri Suit', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/8907279615138_1_-hm.webp?width=600', colourHex: '#F4D03F', colourName: 'Marigold', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 576, category: 'Wedding', gender: 'Men', name: 'Silk Jodhpuri Suit', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/DUFFYDARKNAVY_7_d938040c-3479-4c0a-b995-e7ede99e9bb6.webp?width=600', colourHex: '#C19A6B', colourName: 'Sand', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 577, category: 'Wedding', gender: 'Men', name: 'Wedding Bandhgala', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/CAMERODARKREDhm.webp?width=600', colourHex: '#BDC3C7', colourName: 'Pewter', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 578, category: 'Wedding', gender: 'Men', name: 'Wedding Nehru Jacket Set', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/LK-NFoil-12-SGrn-Pyj-12-NJ-FoilLin-423-Crm_946d9cc8-21b3-4d36-92df-cd5298ec7ca5.jpg?width=600', colourHex: '#1A1A1A', colourName: 'Onyx', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 659, category: 'Party', gender: 'Men', name: 'Satin Party Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4_132de74b-6541-42e1-808f-fddc37b0be51.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Beige', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 660, category: 'Party', gender: 'Men', name: 'Black Satin Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MLX1014-02_5_38e37099-ac5d-42f2-af78-a346261a66fd.jpg?width=600', colourHex: '#1A1A1A', colourName: 'Onyx Black', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 661, category: 'Party', gender: 'Men', name: 'Printed Silk Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_379ea195-715e-4f55-ad3f-5e24f66cb493.jpg?width=600', colourHex: '#E67E22', colourName: 'Amber', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 662, category: 'Party', gender: 'Men', name: 'Velvet Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_fc95a037-6d60-4503-9666-843286ccbe8c.jpg?width=600', colourHex: '#581845', colourName: 'Wine Velvet', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 663, category: 'Party', gender: 'Men', name: 'Sequin Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/2_829af3e9-1af9-4cd4-91d0-2ac598f5d95b.jpg?width=600', colourHex: '#FFFFFF', colourName: 'Pure White', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 664, category: 'Party', gender: 'Men', name: 'Embroidered Party Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_68fc8abb-23e5-4560-a148-f09ef9dc5b67.jpg?width=600', colourHex: '#C0392B', colourName: 'Crimson', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 665, category: 'Party', gender: 'Men', name: 'Metallic Party Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_b46a41fc-dfd8-4492-aaf0-b7b366b361e3.jpg?width=600', colourHex: '#BDC3C7', colourName: 'Metallic Pewter', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 666, category: 'Party', gender: 'Men', name: 'Silk Band Collar Shirt', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_4b400f07-6d7e-4046-bbf7-74baf56e8e26.jpg?width=600', colourHex: '#8E44AD', colourName: 'Violet', buyUrl: 'https://www.myntra.com/men-shirts' },
  { id: 667, category: 'Party', gender: 'Men', name: 'Velvet Blazer', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/mazeygreenhm.webp?width=600', colourHex: '#581845', colourName: 'Wine Velvet', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 668, category: 'Party', gender: 'Men', name: 'Sequin Blazer', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MAZEYBLUEhm.webp?width=600', colourHex: '#27AE60', colourName: 'Emerald', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 669, category: 'Party', gender: 'Men', name: 'Metallic Blazer', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/VEWETMUSTARDhm.webp?width=600', colourHex: '#BDC3C7', colourName: 'Metallic Pewter', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 670, category: 'Party', gender: 'Men', name: 'Textured Dinner Jacket', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_015ff5e1-24ba-444f-af5e-4d68d184cbf4.jpg?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 671, category: 'Party', gender: 'Men', name: 'Brocade Party Jacket', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_5678931a-99d1-4cf8-bb37-9738552bb6ca.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 672, category: 'Party', gender: 'Men', name: 'Black Dinner Jacket', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/freepik__create-a-high-resolution-hyper-realistic-exact-com__17357.png?width=600', colourHex: '#1A1A1A', colourName: 'Onyx Black', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 673, category: 'Party', gender: 'Men', name: 'Double Breasted Party Blazer', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mss4512-01_1.jpg?width=600', colourHex: '#E74C3C', colourName: 'Coral', buyUrl: 'https://www.myntra.com/men-blazers' },
  { id: 674, category: 'Party', gender: 'Men', name: 'Classic Tuxedo', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_b60996c6-7865-4668-8b43-2f9948f7fd2b.jpg?width=600', colourHex: '#581845', colourName: 'Plum', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 675, category: 'Party', gender: 'Men', name: 'Party Bandhgala', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/lookbook-preset-cam-front-close.jpg?width=600', colourHex: '#F4D03F', colourName: 'Marigold', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 676, category: 'Party', gender: 'Men', name: 'Party Nehru Jacket', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4msk8757-01_1.jpg?width=600', colourHex: '#C19A6B', colourName: 'Sand', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 677, category: 'Party', gender: 'Men', name: 'Designer Party Kurta', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_091e9ea7-bdca-4121-9d12-f19de15269fc.jpg?width=600', colourHex: '#BDC3C7', colourName: 'Pewter', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 678, category: 'Party', gender: 'Men', name: 'Luxe Silk Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4mlx1242-01_1.jpg?width=600', colourHex: '#1A1A1A', colourName: 'Onyx', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 759, category: 'Bridal', gender: 'Men', name: 'Royal Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/cerny-mens-bandi-black27624_a2b478e7-5694-4714-b2de-ba3f618bc79f.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Beige', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 760, category: 'Bridal', gender: 'Men', name: 'Ivory Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKPWCS_5377White_6.jpg?width=600', colourHex: '#FDEBD0', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 761, category: 'Bridal', gender: 'Men', name: 'Cream Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/LUX-LK-DamanNeck-1392-DGreen-Trou-033-1_979b82b6-e230-42fb-be2c-9c23596e912d.jpg?width=600', colourHex: '#F5F1E8', colourName: 'Cream', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 762, category: 'Bridal', gender: 'Men', name: 'Pastel Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MEDO-BPURPLE_4.webp?width=600', colourHex: '#F8BBD0', colourName: 'Pastel Rose', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 763, category: 'Bridal', gender: 'Men', name: 'Maroon Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/IMG_0031_dc2ffe72-ee31-4467-8eeb-b3c76a81b7fd.jpg?width=600', colourHex: '#900C3F', colourName: 'Deep Maroon', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 764, category: 'Bridal', gender: 'Men', name: 'Gold Embroidered Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/emerald-mens-bandi-light-pink27624_fb86e99b-de02-4da8-8e13-c1444dd5065d.jpg?width=600', colourHex: '#D4AC0D', colourName: 'Antique Gold', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 765, category: 'Bridal', gender: 'Men', name: 'Zardozi Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/CERNY-BEIGE00038.jpg?width=600', colourHex: '#16A085', colourName: 'Teal', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 766, category: 'Bridal', gender: 'Men', name: 'Velvet Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/0_886ba99d-5ce6-4ccf-8c1a-e739eee9e721.jpg?width=600', colourHex: '#581845', colourName: 'Wine Velvet', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 767, category: 'Bridal', gender: 'Men', name: 'Silk Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/50JIND_162Cream_1_8fffc151-936c-4a05-9ae6-221812a7660d.jpg?width=600', colourHex: '#7F8C8D', colourName: 'Ash Grey', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 768, category: 'Bridal', gender: 'Men', name: 'Brocade Groom Sherwani', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/cameroltbeigehm.webp?width=600', colourHex: '#27AE60', colourName: 'Emerald', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 769, category: 'Bridal', gender: 'Men', name: 'Designer Groom Achkan', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_5306Grey_1.jpg?width=600', colourHex: '#D35400', colourName: 'Terracotta', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 770, category: 'Bridal', gender: 'Men', name: 'Royal Embroidered Achkan', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/LASMOS-B1BLACKhm.webp?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 771, category: 'Bridal', gender: 'Men', name: 'Groom Indo-Western Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/1_c73d7e94-9ef5-4099-a5e7-d6302c4bd98a.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 772, category: 'Bridal', gender: 'Men', name: 'Layered Groom Indo-Western', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/1_383e02c4-fb00-431c-8c72-6ecca8c7b0eb.jpg?width=600', colourHex: '#2C3E50', colourName: 'Midnight', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 773, category: 'Bridal', gender: 'Men', name: 'Groom Kurta Pajama Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_D_5091White_1.jpg?width=600', colourHex: '#E74C3C', colourName: 'Coral', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 774, category: 'Bridal', gender: 'Men', name: 'Groom Dhoti Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_D_5077Purple_6.jpg?width=600', colourHex: '#581845', colourName: 'Plum', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 775, category: 'Bridal', gender: 'Men', name: 'Royal Jodhpuri Suit', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/BOZELLIBLACKhm.webp?width=600', colourHex: '#F4D03F', colourName: 'Marigold', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 776, category: 'Bridal', gender: 'Men', name: 'Velvet Jodhpuri Suit', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/HERO_86c964b3-cddc-4cef-93e1-9d707752273c.jpg?width=600', colourHex: '#581845', colourName: 'Wine Velvet', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 777, category: 'Bridal', gender: 'Men', name: 'Groom Bandhgala', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/COLACDARKNAVYHM.webp?width=600', colourHex: '#BDC3C7', colourName: 'Pewter', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 778, category: 'Bridal', gender: 'Men', name: 'Designer Nehru Jacket Set', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/LASMOS-B1BEIGE00506.webp?width=600', colourHex: '#1A1A1A', colourName: 'Onyx', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 859, category: 'Traditional', gender: 'Men', name: 'Classic Kurta Pajama', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKPWCS_5262Navy_1.jpg?width=600', colourHex: '#FDEBD0', colourName: 'Ivory Silk', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 860, category: 'Traditional', gender: 'Men', name: 'Punjabi Kurta Pajama', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_5212Black_1.jpg?width=600', colourHex: '#2980B9', colourName: 'Royal Blue', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 861, category: 'Traditional', gender: 'Men', name: 'Pathani Suit', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_5212White_1.jpg?width=600', colourHex: '#E67E22', colourName: 'Amber', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 862, category: 'Traditional', gender: 'Men', name: 'Black Pathani Suit', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_696Black_1.jpg?width=600', colourHex: '#1A1A1A', colourName: 'Onyx Black', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 863, category: 'Traditional', gender: 'Men', name: 'White Pathani Suit', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_696White_1.jpg?width=600', colourHex: '#FFFFFF', colourName: 'Pure White', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 864, category: 'Traditional', gender: 'Men', name: 'Embroidered Pathani Suit', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MEDO-B1DARKNAVYhm_222610ac-2ece-4e4e-b4c9-223e7a7c9922.webp?width=600', colourHex: '#C0392B', colourName: 'Crimson', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 865, category: 'Traditional', gender: 'Men', name: 'Kurta Churidar Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_640Grey_1.jpg?width=600', colourHex: '#D35400', colourName: 'Saffron Silk', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 866, category: 'Traditional', gender: 'Men', name: 'Silk Kurta Pajama', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/R-SJR-Buti-6010-Red-Dhoti-1104_1.jpg?width=600', colourHex: '#8E44AD', colourName: 'Violet', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 867, category: 'Traditional', gender: 'Men', name: 'Embroidered Kurta Pajama', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_5029Golden_1_e1853291-d1b8-49eb-966e-c4adaa078389.jpg?width=600', colourHex: '#7F8C8D', colourName: 'Ash Grey', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 868, category: 'Traditional', gender: 'Men', name: 'Dhoti Kurta', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/R-SJR-Buti-6014-Wine-Dhoti-1104_1.jpg?width=600', colourHex: '#E67E22', colourName: 'Saffron Gold', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 869, category: 'Traditional', gender: 'Men', name: 'Silk Dhoti Kurta', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/Q-SJR-114-SJDhoti_1104-1_5203ec80-48b9-4d83-a689-de9b5a3d9289.jpg?width=600', colourHex: '#D35400', colourName: 'Terracotta', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 870, category: 'Traditional', gender: 'Men', name: 'Embroidered Dhoti Kurta', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_5029Golden_1.jpg?width=600', colourHex: '#900C3F', colourName: 'Maroon', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 871, category: 'Traditional', gender: 'Men', name: 'Chikankari Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKP_5029Navy_1.jpg?width=600', colourHex: '#ECF0F1', colourName: 'Ivory', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 872, category: 'Traditional', gender: 'Men', name: 'Banarasi Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-LK-SareeDmn-2431-Mhndi-PC041-7.jpg?width=600', colourHex: '#2C3E50', colourName: 'Midnight', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 873, category: 'Traditional', gender: 'Men', name: 'Silk Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-201-SJDhoti_1104_1_bbea8fd5-d4c8-4ed8-98c4-edfc3f8b10fd.jpg?width=600', colourHex: '#E74C3C', colourName: 'Coral', buyUrl: 'https://www.myntra.com/men-kurtas' },
  { id: 874, category: 'Traditional', gender: 'Men', name: 'Achkan Churidar Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/products/JOKP_678Grey_1.jpg?width=600', colourHex: '#900C3F', colourName: 'Maroon Zari', buyUrl: 'https://www.myntra.com/men-sherwani' },
  { id: 875, category: 'Traditional', gender: 'Men', name: 'Nehru Jacket Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0070/4285/9119/files/JOKPWCS_W_5080Purple_1.jpg?width=600', colourHex: '#27AE60', colourName: 'Emerald Green', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 876, category: 'Traditional', gender: 'Men', name: 'Embroidered Nehru Jacket Set', img: 'https://cdn.shopify.com/s/files/1/0752/6435/files/MEDO-B1GREYhm_ac342020-5069-4415-aedc-b9f5411ca620.webp?width=600', colourHex: '#C19A6B', colourName: 'Sand', buyUrl: 'https://www.myntra.com/men-jackets' },
  { id: 877, category: 'Traditional', gender: 'Men', name: 'Bandhgala Kurta Set', img: 'https://cdn.shopify.com/s/files/1/0752/6435/products/HERO_6e6a20ca-cc11-400c-bdca-4950f8c451db.jpg?width=600', colourHex: '#2C3E50', colourName: 'Charcoal', buyUrl: 'https://www.myntra.com/men-suits' },
  { id: 878, category: 'Traditional', gender: 'Men', name: 'Traditional Indo-Western Set', img: 'https://cdn.shopify.com/s/files/1/0869/1934/8520/files/SJR-LK-SanjFoil-2401-Cream-PC041-5.jpg?width=600', colourHex: '#D35400', colourName: 'Rust Gold', buyUrl: 'https://www.myntra.com/men-sherwani' },

  // â”€â”€ Extended women's range â€” regional & occasion wear (20 items per category) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Women Everyday
  { id: 101, category: "Everyday", gender: 'Women', name: "Classic Cotton Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/teressa5.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 102, category: "Everyday", gender: 'Women', name: "Printed Cotton Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy3_2fd7bfeb-679d-42c0-8a4d-f12b361366bf.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 103, category: "Everyday", gender: 'Women', name: "A-Line Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy5_075260d7-b8c5-4231-88d9-ab681b666d3e.jpg?width=600", colourHex: "#E67E22", colourName: "Amber", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 104, category: "Everyday", gender: 'Women', name: "Straight Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Ambalika_BK1294N_4.jpg?width=600", colourHex: "#1A237E", colourName: "Indigo", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 105, category: "Everyday", gender: 'Women', name: "Short Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Menka_4.jpg?width=600", colourHex: "#FFFFFF", colourName: "Pure White", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 106, category: "Everyday", gender: 'Women', name: "Chikankari Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/mehfilArtboard_1_copy_5_2f532592-7a5a-4817-8308-2a5fdb02c823.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 107, category: "Everyday", gender: 'Women', name: "Printed Anarkali Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/SUjataBK1295N_3.jpg?width=600", colourHex: "#F8BBD0", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 108, category: "Everyday", gender: 'Women', name: "Cotton Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Meghna_min_6.jpg?width=600", colourHex: "#8E44AD", colourName: "Violet", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 109, category: "Everyday", gender: 'Women', name: "Kurti Pant Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Whisper_Lime_Fluttery_Cape_Sleeves_Midi_Dress1.jpg?width=600", colourHex: "#27AE60", colourName: "Emerald", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 110, category: "Everyday", gender: 'Women', name: "Casual Maxi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02006_4d7716a2-9117-4f0f-8733-81f3d6581c86.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 111, category: "Everyday", gender: 'Women', name: "Cotton Midi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard_3_7a3f2e78-0a0f-4180-b5d1-c08975e6429b.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 112, category: "Everyday", gender: 'Women', name: "Casual Shirt Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/satrnagiArtboard_1_copy.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 113, category: "Everyday", gender: 'Women', name: "Everyday Cotton Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/05Artboard_1_copy_2.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 114, category: "Everyday", gender: 'Women', name: "Classic Cotton Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/teressa5.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 115, category: "Everyday", gender: 'Women', name: "Printed Cotton Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy3_2fd7bfeb-679d-42c0-8a4d-f12b361366bf.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 116, category: "Everyday", gender: 'Women', name: "A-Line Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy5_075260d7-b8c5-4231-88d9-ab681b666d3e.jpg?width=600", colourHex: "#E67E22", colourName: "Amber", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 117, category: "Everyday", gender: 'Women', name: "Straight Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Ambalika_BK1294N_4.jpg?width=600", colourHex: "#1A237E", colourName: "Indigo", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 118, category: "Everyday", gender: 'Women', name: "Short Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Menka_4.jpg?width=600", colourHex: "#FFFFFF", colourName: "Pure White", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 119, category: "Everyday", gender: 'Women', name: "Chikankari Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/mehfilArtboard_1_copy_5_2f532592-7a5a-4817-8308-2a5fdb02c823.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 120, category: "Everyday", gender: 'Women', name: "Printed Anarkali Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/SUjataBK1295N_3.jpg?width=600", colourHex: "#F8BBD0", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  // Women Office
  { id: 201, category: "Office", gender: 'Women', name: "Solid Formal Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Flame_min_6.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1140, category: "Office", gender: 'Women', name: "Tinyphool Kota Doria Dress with Jacket", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02010_3b2df154-88df-4849-9c98-6bd48eda5395.jpg?width=600", colourHex: "#8B5A2B", colourName: "Brown", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 202, category: "Office", gender: 'Women', name: "A-Line Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0030.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1141, category: "Office", gender: 'Women', name: "Lovebirds Kota Doria Midi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02006_c0b7fb09-7ec0-462e-83a1-fbe877933e27.jpg?width=600", colourHex: "#87CEEB", colourName: "Sky Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 203, category: "Office", gender: 'Women', name: "Straight Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC03091copy.jpg?width=600", colourHex: "#E67E22", colourName: "Amber", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1142, category: "Office", gender: 'Women', name: "Pistacheo Lime Midi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02006_42700559-d308-4cd2-a51d-224ccde309b1.jpg?width=600", colourHex: "#A3C585", colourName: "Lime Green", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 204, category: "Office", gender: 'Women', name: "Chikankari Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/7_711bddb4-cdac-4c55-b4f8-2e369a5543da.jpg?width=600", colourHex: "#1A237E", colourName: "Indigo", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1143, category: "Office", gender: 'Women', name: "Ombre Pockets Orange Kota Midi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Ombre_Pockets_1.jpg?width=600", colourHex: "#E67E22", colourName: "Orange", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1144, category: "Office", gender: 'Women', name: "Anushka Red Mul Cotton Midi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Anushka_Red_Mul_Cotton_Midi_Dress1.jpg?width=600", colourHex: "#C0392B", colourName: "Red", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 205, category: "Office", gender: 'Women', name: "Printed Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/ChakravartiBK1270N_2.jpg?width=600", colourHex: "#FFFFFF", colourName: "Pure White", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1145, category: "Office", gender: 'Women', name: "Diora Lime Midi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy_c3c24107-7819-42f2-98f7-bee03235aedc.jpg?width=600", colourHex: "#A3C585", colourName: "Lime Green", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 206, category: "Office", gender: 'Women', name: "Mandarin Collar Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Radhika-01.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1146, category: "Office", gender: 'Women', name: "Regal Wine Indo-Western Jacket Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/regal-wine4.jpg?width=600", colourHex: "#800000", colourName: "Wine", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 207, category: "Office", gender: 'Women', name: "Minimal Anarkali Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/PravikaBK1188N_1.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 1147, category: "Office", gender: 'Women', name: "Orchid Blue Indo-Western Jacket Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/orchid_jecketArtboard_1_copy_5.jpg?width=600", colourHex: "#1A237E", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 208, category: "Office", gender: 'Women', name: "Solid Shirt Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC03154.jpg?width=600", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1148, category: "Office", gender: 'Women', name: "Women's Maxi Style Dress with Waist Belt", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/1_c807d6bf-b381-41e7-a370-9d70eebb7cb3.png?width=600", colourHex: "#94813D", colourName: "Olive", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 1149, category: "Office", gender: 'Women', name: "Women's Premium Rayon Printed Dress", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/8_a5a5f6c7-6018-4c85-b800-ad69fe0ffbe6.png?width=600", colourHex: "#800000", colourName: "Wine", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 209, category: "Office", gender: 'Women', name: "Formal Midi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC03105.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1150, category: "Office", gender: 'Women', name: "Women's Shirt & Wide Leg Co-Ord Set", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/1_1aae9206-aafd-4e83-843b-855e1b930427.png?width=600", colourHex: "#808080", colourName: "Grey", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 210, category: "Office", gender: 'Women', name: "Cotton Office Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy2_4d5b835c-ae03-4dbe-ac40-b5f1b9b233b4.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1151, category: "Office", gender: 'Women', name: "Women's 3-Piece Co-Ord Set with Long Shrug", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/2_d096c1d3-eedc-4492-b8c6-22c8bbeeb360.png?width=600", colourHex: "#228B22", colourName: "Green", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 211, category: "Office", gender: 'Women', name: "Chanderi Office Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Niaa_Chander_White_Midi_Dress.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1152, category: "Office", gender: 'Women', name: "Designer Rayon Dress", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/1_65081eef-0c44-47be-bdff-1c1d1897a33a.png?width=600", colourHex: "#E91E63", colourName: "Pink", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 212, category: "Office", gender: 'Women', name: "Printed Office Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy4_06080766-31b6-4a6a-bb6a-8795d56a251b.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1153, category: "Office", gender: 'Women', name: "Premium Rayon Dress for Women", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/10_bf662689-2596-40ef-9037-9a049a6e47de.png?width=600", colourHex: "#B49F98", colourName: "Beige", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 1154, category: "Office", gender: 'Women', name: "Pure Linen Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/2_27461870-ba8a-4502-a266-a18bcdc00cf7.png?width=600", colourHex: "#D81B60", colourName: "Pink", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 213, category: "Office", gender: 'Women', name: "Minimal Silk Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/pranali_2.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1155, category: "Office", gender: 'Women', name: "Designer Lycra Co-Ord Set", img: "https://cdn.shopify.com/s/files/1/0645/4693/0861/files/1_14af8edb-3f93-44a5-9a7b-01d26ba606bc.jpg?width=600", colourHex: "#3D3D3D", colourName: "Charcoal", buyUrl: "https://www.myntra.com/women/western-wear" },
  { id: 214, category: "Office", gender: 'Women', name: "Kurti with Trousers", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC03067.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1156, category: "Office", gender: 'Women', name: "Single Breasted Blazer And Trousers Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO314BRWN_1_4af5ef7c-b8b3-4822-9ac1-bd2d2947e5e1.jpg?width=600", colourHex: "#8B4513", colourName: "Brown", buyUrl: "https://www.fablestreet.com/products/single-breasted-blazer-and-trousers-co-ord-set-brown" },
  { id: 215, category: "Office", gender: 'Women', name: "Solid Formal Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Flame_min_6.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1157, category: "Office", gender: 'Women', name: "Satin Shirt And Skirt Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO349OFBK_1_0e4f83b1-6a8b-4755-8cac-e2dd3229e236.jpg?width=600", colourHex: "#F5F0E1", colourName: "Off White", buyUrl: "https://www.fablestreet.com/products/satin-shirt-and-skirt-co-ord-set-off-white-and-black-fsco349ofbk" },
  { id: 216, category: "Office", gender: 'Women', name: "A-Line Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0030.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1158, category: "Office", gender: 'Women', name: "Waistcoat And Trousers Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO311BRWN_1_4e43d193-b362-42cd-a3a0-08e2a7d31c16.jpg?width=600", colourHex: "#8B4513", colourName: "Brown", buyUrl: "https://www.fablestreet.com/products/waistcoat-and-trousers-co-ord-set-brown-fsco311brwn" },
  { id: 1159, category: "Office", gender: 'Women', name: "Cotton Linen Blazer and Trousers Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO571DKPK_5.jpg?width=600", colourHex: "#D8A7B1", colourName: "Dusty Pink", buyUrl: "https://www.fablestreet.com/products/cotton-linen-blazer-and-trousers-coord-dusty-pink-fsco571dkpk" },
  { id: 217, category: "Office", gender: 'Women', name: "Straight Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC03091copy.jpg?width=600", colourHex: "#E67E22", colourName: "Amber", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1160, category: "Office", gender: 'Women', name: "Single Breasted Blazer and Wide Leg Trousers Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO547GREY_2.jpg?width=600", colourHex: "#808080", colourName: "Grey", buyUrl: "https://www.fablestreet.com/products/single-breasted-blazer-and-wide-leg-trousers-coord-grey" },
  { id: 218, category: "Office", gender: 'Women', name: "Chikankari Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/7_711bddb4-cdac-4c55-b4f8-2e369a5543da.jpg?width=600", colourHex: "#1A237E", colourName: "Indigo", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1161, category: "Office", gender: 'Women', name: "Single Breasted Blazer And Trousers Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO346WHIT_2.jpg?width=600", colourHex: "#F5F0E1", colourName: "Off White", buyUrl: "https://www.fablestreet.com/products/single-breasted-blazer-and-trousers-co-ord-set-off-white-fsco346whit" },
  { id: 219, category: "Office", gender: 'Women', name: "Printed Office Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/ChakravartiBK1270N_2.jpg?width=600", colourHex: "#FFFFFF", colourName: "Pure White", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1162, category: "Office", gender: 'Women', name: "Blazer & Straight Trousers Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO554BRWN_1.jpg?width=600", colourHex: "#8B4513", colourName: "Brown", buyUrl: "https://www.fablestreet.com/products/blazer-straight-trousers-coord-brown" },
  { id: 220, category: "Office", gender: 'Women', name: "Mandarin Collar Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Radhika-01.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1163, category: "Office", gender: 'Women', name: "Blazer & Straight Skirt Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO560REDD_1.jpg?width=600", colourHex: "#C0392B", colourName: "Red", buyUrl: "https://www.fablestreet.com/products/blazer-straight-skirt-coord-red" },
  { id: 1164, category: "Office", gender: 'Women', name: "Satin Polka Dot Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO577PRBL_5.jpg?width=600", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.fablestreet.com/products/satin-polka-dot-coord-navy-blue-fsco577prbl" },
  { id: 1133, category: "Office", gender: 'Women', name: "Saanchi Peacock Blue V-Neckline Suit Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/saanchi_10.jpg?width=600", colourHex: "#1565C0", colourName: "Peacock Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1165, category: "Office", gender: 'Women', name: "Waistcoat and Trousers Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO584LTBG_5.jpg?width=600", colourHex: "#D2B48C", colourName: "Beige", buyUrl: "https://www.fablestreet.com/products/waistcoat-and-trousers-coord-beige-fsco584ltbg" },
  { id: 1134, category: "Office", gender: 'Women', name: "Ruhaana Maroon Puffy Suit Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Ruhaana_6.jpg?width=600", colourHex: "#900C3F", colourName: "Deep Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1166, category: "Office", gender: 'Women', name: "Striped Blazer and Trousers Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO587DPST.jpg?width=600", colourHex: "#E91E63", colourName: "Pink", buyUrl: "https://www.fablestreet.com/products/striped-blazer-and-trousers-coord-pink-fsco587dpst" },
  { id: 1135, category: "Office", gender: 'Women', name: "Narthaki Magenta V-Neckline Suit Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Narthaki_min_1.jpg?width=600", colourHex: "#C2185B", colourName: "Magenta", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1167, category: "Office", gender: 'Women', name: "Waistcoat and Trousers Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSCO588OLIV_4.jpg?width=600", colourHex: "#6B8E23", colourName: "Olive", buyUrl: "https://www.fablestreet.com/products/waistcoat-and-trousers-coord-olive-fsco588oliv" },
  { id: 1136, category: "Office", gender: 'Women', name: "Bhavini Handloom Blue Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0019_7f2ff2f2-cdfd-474b-9a2b-a05f5df5eded.jpg?width=600", colourHex: "#1A237E", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1168, category: "Office", gender: 'Women', name: "A-line Jacket Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR1295WHIT_1.jpg?width=600", colourHex: "#FFFFFF", colourName: "White", buyUrl: "https://www.fablestreet.com/products/a-line-jacket-dress-white-fsdr1295whit" },
  { id: 1169, category: "Office", gender: 'Women', name: "Panelled Sheath Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR1299BLAC_3_ead5a6cf-fe0e-45f7-8072-7b8a30ab27d6.jpg?width=600", colourHex: "#1A1A1A", colourName: "Black", buyUrl: "https://www.fablestreet.com/products/panelled-sheath-dress-black-fsdr1299blac" },
  { id: 1137, category: "Office", gender: 'Women', name: "Sumedha Crush Silk Suit Set in Rust", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sumedha-01.jpg?width=600", colourHex: "#D35400", colourName: "Rust Orange", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1170, category: "Office", gender: 'Women', name: "A-line Shirt Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR1128BLCK_2.jpg?width=600", colourHex: "#1A1A1A", colourName: "Black", buyUrl: "https://www.fablestreet.com/products/a-line-shirt-dress-black-fsdr1128blck" },
  { id: 1138, category: "Office", gender: 'Women', name: "Himanshi Mangalgiri Cotton Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02440.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1171, category: "Office", gender: 'Women', name: "Satin Polka Dot Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR1438NYPR_1.jpg?width=600", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.fablestreet.com/products/satin-striped-dress-navy-blue" },
  { id: 1139, category: "Office", gender: 'Women', name: "Parampara Maroon Stripes Handloom Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy2_95f2d3f4-2366-4ff5-9a83-4f53559181e2.jpg?width=600", colourHex: "#800000", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1172, category: "Office", gender: 'Women', name: "Round Collar Midi Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR1778OLIV_2.jpg?width=600", colourHex: "#6B8E23", colourName: "Olive", buyUrl: "https://www.fablestreet.com/products/round-collar-midi-dress-olive" },
  { id: 1173, category: "Office", gender: 'Women', name: "Short Sleeves Shift Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/KNDR871ORNG_2.jpg?width=600", colourHex: "#FFCBA4", colourName: "Peach", buyUrl: "https://www.fablestreet.com/products/short-sleeves-shift-dress-peach" },
  // Women Casual
  { id: 301, category: "Casual", gender: 'Women', name: "Relaxed Short Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/19_adf684e7-1950-428f-b040-73f2920ac0e6.png?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 302, category: "Casual", gender: 'Women', name: "Printed Peplum Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Teracotta_Olive_Green_Kota_Ruffle_Midi_Dress.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1174, category: "Casual", gender: 'Women', name: "Cotton Button Down Dress - Blue", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR572BLUE_1.jpg?width=600", colourHex: "#2980B9", colourName: "Blue", buyUrl: "https://www.fablestreet.com/products/cotton-button-down-a-line-dress-light-blue" },
  { id: 303, category: "Casual", gender: 'Women', name: "Block Print Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC06380.jpg?width=600", colourHex: "#E67E22", colourName: "Amber", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1175, category: "Casual", gender: 'Women', name: "Cotton Button Down Dress - Olive", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR572OLIV_1.jpg?width=600", colourHex: "#6B8E23", colourName: "Olive", buyUrl: "https://www.fablestreet.com/products/cotton-button-down-a-line-dress-olive" },
  { id: 304, category: "Casual", gender: 'Women', name: "Kalamkari Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Glowtide1.jpg?width=600", colourHex: "#1A237E", colourName: "Indigo", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1176, category: "Casual", gender: 'Women', name: "Denim Dress - Navy Blue", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR695NAVY.png?width=600", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.fablestreet.com/products/denim-dress-navy-blue" },
  { id: 305, category: "Casual", gender: 'Women', name: "Denim Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02010_6da92fc1-daf1-4037-b1f5-4916bbd78a15.jpg?width=600", colourHex: "#2980B9", colourName: "Washed Denim", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1177, category: "Casual", gender: 'Women', name: "Button-Down Strap Midi Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR555WHIT_1.jpg?width=600", colourHex: "#FFFFFF", colourName: "White", buyUrl: "https://www.fablestreet.com/products/button-down-strap-midi-dress-white" },
  { id: 306, category: "Casual", gender: 'Women', name: "Boho Print Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/1_9_4b0dcbd3-0229-485a-8934-f3c49fe0e12d.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1178, category: "Casual", gender: 'Women', name: "Front Pocket Lapel Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR157GREN_1.jpg?width=600", colourHex: "#4A7C59", colourName: "Moss Green", buyUrl: "https://www.fablestreet.com/products/front-pocket-lapel-dress-moss-green" },
  { id: 307, category: "Casual", gender: 'Women', name: "Mirror Work Kurti", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Kumari_11.jpg?width=600", colourHex: "#F8BBD0", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1179, category: "Casual", gender: 'Women', name: "Linen Dress With Elasticated Waist", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR725OLIV_1.jpg?width=600", colourHex: "#6B8E23", colourName: "Olive", buyUrl: "https://www.fablestreet.com/products/linen-dress-with-elasticated-waist-olive-dr725oliv" },
  { id: 308, category: "Casual", gender: 'Women', name: "Casual Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/durgaArtboard_1_copy.jpg?width=600", colourHex: "#8E44AD", colourName: "Violet", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 1180, category: "Casual", gender: 'Women', name: "Collared Pleated Fit and Flare Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR534OLIV_1.jpg?width=600", colourHex: "#6B8E23", colourName: "Olive", buyUrl: "https://www.fablestreet.com/products/collared-pleated-fit-and-flare-dress-olive" },
  { id: 309, category: "Casual", gender: 'Women', name: "Printed Maxi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/1_5_fbf0672c-e414-4d2d-a2ab-0f33d3f8d1e3.jpg?width=600", colourHex: "#7F8C8D", colourName: "Ash Grey", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1181, category: "Casual", gender: 'Women', name: "V Neck Pleated Fit and Flare Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR530RUST_1_f891a5cf-ca17-4fe2-ac8f-547118326bc3.jpg?width=600", colourHex: "#B7410E", colourName: "Rust", buyUrl: "https://www.fablestreet.com/products/v-neck-pleated-fit-and-flare-dress-rust" },
  { id: 310, category: "Casual", gender: 'Women', name: "Indo-Western Maxi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Kamala_5.jpg?width=600", colourHex: "#27AE60", colourName: "Emerald", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1182, category: "Casual", gender: 'Women', name: "LivIn Contrast Collar Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/navy_blue_5_copy.jpg?width=600", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.fablestreet.com/products/livin-contrast-collar-dress-navy-and-white-kndr883navy" },
  { id: 311, category: "Casual", gender: 'Women', name: "Casual Wrap Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02006_2aebec33-9a19-435b-aa6d-e1cbf0b86cd1.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 312, category: "Casual", gender: 'Women', name: "Indo-Western Peplum Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/vihaana_8.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1183, category: "Casual", gender: 'Women', name: "Ombre Pleated Dress - Green", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/KNDR1010GREN.jpg?width=600", colourHex: "#228B22", colourName: "Green", buyUrl: "https://www.fablestreet.com/products/ombre-pleated-dress-green-kndr1010gren" },
  { id: 313, category: "Casual", gender: 'Women', name: "Sequin Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard_1_0944810d-1b21-468a-9ff9-33705c7a8e7e.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1184, category: "Casual", gender: 'Women', name: "Ombre Pleated Dress - Pink and Purple", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/KNDR1010PRPL_1_2d9885d8-2698-416e-8ad5-38b77fd17457.jpg?width=600", colourHex: "#C2185B", colourName: "Pink Purple", buyUrl: "https://www.fablestreet.com/products/ombre-pleated-dress-pink-and-purple" },
  { id: 314, category: "Casual", gender: 'Women', name: "Satin Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/LOGOBULLIONKNOTDSC02438.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1185, category: "Casual", gender: 'Women', name: "Bodycon Knitted Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSKNDR1250BLAC_2.jpg?width=600", colourHex: "#1A1A1A", colourName: "Black", buyUrl: "https://www.fablestreet.com/products/bodycon-knitted-dress-black-fskndr1250blac" },
  { id: 315, category: "Casual", gender: 'Women', name: "Metallic Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC02438_58cabdbc-c351-41bc-ba1f-910f34e00309.jpg?width=600", colourHex: "#BDC3C7", colourName: "Metallic Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1186, category: "Casual", gender: 'Women', name: "Halter Neck Rib Knit Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/KNDR999BLAC_2.jpg?width=600", colourHex: "#1A1A1A", colourName: "Black", buyUrl: "https://www.fablestreet.com/products/halter-neck-rib-knit-dress-black-kndr999blac" },
  { id: 316, category: "Casual", gender: 'Women', name: "Sequin Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/chandrakala_1.jpg?width=600", colourHex: "#1A237E", colourName: "Navy Print", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 1187, category: "Casual", gender: 'Women', name: "Colour Block Polka Dot Shift Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR340BLAC_1.jpg?width=600", colourHex: "#1A1A1A", colourName: "Black", buyUrl: "https://www.fablestreet.com/products/colour-block-polka-dot-shift-dress-black-and-white" },
  { id: 317, category: "Casual", gender: 'Women', name: "Glitter Anarkali Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Gopika1.jpg?width=600", colourHex: "#8E44AD", colourName: "Violet", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 1188, category: "Casual", gender: 'Women', name: "Linen Striped V Neck Shift Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/DR519BLST_3.jpg?width=600", colourHex: "#2980B9", colourName: "Blue", buyUrl: "https://www.fablestreet.com/products/linen-striped-v-neck-shift-dress-blue-and-white" },
  { id: 318, category: "Casual", gender: 'Women', name: "Embellished Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/BloomTone_Kota_Pink_Midi_Dress.jpg?width=600", colourHex: "#7F8C8D", colourName: "Ash Grey", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 1189, category: "Casual", gender: 'Women', name: "Satin Marble Print Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR1062BLUE_f.jpg?width=600", colourHex: "#2980B9", colourName: "Blue", buyUrl: "https://www.fablestreet.com/products/satin-marble-print-dress-blue-fsdr1062blue" },
  { id: 319, category: "Casual", gender: 'Women', name: "Satin Slip Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Pink_Petal_Kota_Midi_Dress1.jpg?width=600", colourHex: "#27AE60", colourName: "Emerald", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1190, category: "Casual", gender: 'Women', name: "Side Knot Midi Dress", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR1297ORNG_2.jpg?width=600", colourHex: "#E67E22", colourName: "Orange", buyUrl: "https://www.fablestreet.com/products/side-knot-midi-dress-orange-fsdr1297orng" },
  { id: 320, category: "Casual", gender: 'Women', name: "Indo-Western Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Fiza_2.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 1191, category: "Casual", gender: 'Women', name: "Chanderi Shift Dress - Navy Blue", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/FSDR13NAVY.jpg?width=600", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.fablestreet.com/products/chanderi-shift-dress-navy-blue-fsdr13navy" },
  { id: 1222, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/18/vdpzqhlP_6d928862b2ae45ad9c4aa85bd6b907b9.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-a-line-maxi-dress/40071826/buy" },
  { id: 1298, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Net A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/JlFZ2gNp_08a28b88128248ad8752f1121f6b993c.jpg", colourHex: "#6B0F1A", colourName: "Maroon", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-net-a-line-maxi-dress/40091444/buy" },
  { id: 1299, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Fit & Flare Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/hytsZZvA_f119cf269d4c4e8e8400cbc6f2723262.jpg", colourHex: "#6B0F1A", colourName: "Maroon", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-fit--flare-maxi-dress/40091438/buy" },
  { id: 1300, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/3obfm8Mi_a5f57b81f1ba48d49a1b451826dffae9.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40091433/buy" },
  { id: 1301, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/24/byTox74k_c4bcf1e7e7264c3996556dfc991b53bc.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40071824/buy" },
  { id: 1302, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/qwPw3Kna_a1b83cc5b8254e2da657d92c0af29cb0.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40091449/buy" },
  { id: 1303, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/AUGUST/14/0b3cdda9adf541b08821e40f6d1396a8.jpg", colourHex: "#2E8B57", colourName: "Sea Green", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40091447/buy" },
  { id: 1304, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/sUq8SXm8_4115bc8c421a4352ad8ec1aad8f29af3.jpg", colourHex: "#181818", colourName: "Black", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40091241/buy" },
  { id: 1305, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/GZ6ocsUs_0d190027946743709026bd4af583b407.jpg", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40091226/buy" },
  { id: 1306, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/18/SW9DIwam_09e8bb4bd85c4277bb02164de97dce41.jpg", colourHex: "#6B0F1A", colourName: "Maroon", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-a-line-maxi-dress/40071823/buy" },
  { id: 1307, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Fit & Flare Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/16/5bGDDykK_6d568b6cc7d247c2965a655967bca8df.jpg", colourHex: "#6E4B3A", colourName: "Brown", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-fit--flare-maxi-dress/40071816/buy" },
  { id: 1308, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/16/7my3kGR2_ffc9fc4d86324574b90cf323931ab2ae.jpg", colourHex: "#27AE60", colourName: "Green", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40071815/buy" },
  { id: 1309, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Fit & Flare Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/18/TDO40fzE_1e648dcb2c9248ec85e1b4c4728705c5.jpg", colourHex: "#FF8C00", colourName: "Orange", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-fit--flare-maxi-dress/40071818/buy" },
  { id: 1310, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Net A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/2NS1F0Ej_2dde78a57cbc4ceabba4d577a346fb3a.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-net-a-line-maxi-dress/40091435/buy" },
  { id: 1311, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/16/pzspGnLL_3c34868dc44944daa3915265aa214af5.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-a-line-maxi-dress/40071819/buy" },
  { id: 1312, category: "Casual", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Net Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/0SJbj3Tf_212c8698b7e74ceabeef60ce54aac089.jpg", colourHex: "#181818", colourName: "Black", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-net-maxi-dress/40091437/buy" },
  // Women Festive
  { id: 401, category: "Festive", gender: 'Women', name: "Embroidered Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/MayaDress05-min.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 402, category: "Festive", gender: 'Women', name: "Chikankari Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0005_478e652a-9c71-43d0-a80e-f5e5c7697fda.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 403, category: "Festive", gender: 'Women', name: "Organza Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard_1_copy_2_aadbfc60-16fe-4cdb-b26d-7299a3cf03d9.jpg?width=600", colourHex: "#1A1A1A", colourName: "Black Gold", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 404, category: "Festive", gender: 'Women', name: "Silk Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Kanika1.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 405, category: "Festive", gender: 'Women', name: "Banarasi Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sachika-04.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 406, category: "Festive", gender: 'Women', name: "Organza Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Mrinalika.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 407, category: "Festive", gender: 'Women', name: "Embroidered Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/CarrotOrangeMidiDress03-min.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 408, category: "Festive", gender: 'Women', name: "Pre-Draped Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Vedika-06.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 409, category: "Festive", gender: 'Women', name: "Designer Festive Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0026_28f4edd1-c5bb-426c-9729-704643941e6b.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 410, category: "Festive", gender: 'Women', name: "Embroidered Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/MayaDress05-min.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 411, category: "Festive", gender: 'Women', name: "Chikankari Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0005_478e652a-9c71-43d0-a80e-f5e5c7697fda.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 412, category: "Festive", gender: 'Women', name: "Organza Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard_1_copy_2_aadbfc60-16fe-4cdb-b26d-7299a3cf03d9.jpg?width=600", colourHex: "#1A1A1A", colourName: "Black Gold", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 413, category: "Festive", gender: 'Women', name: "Silk Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Kanika1.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 414, category: "Festive", gender: 'Women', name: "Festive Lehenga Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Tarangini_1.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson Red", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 415, category: "Festive", gender: 'Women', name: "Banarasi Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sachika-04.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 416, category: "Festive", gender: 'Women', name: "Organza Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Mrinalika.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 417, category: "Festive", gender: 'Women', name: "Embroidered Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/CarrotOrangeMidiDress03-min.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 418, category: "Festive", gender: 'Women', name: "Pre-Draped Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Vedika-06.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 419, category: "Festive", gender: 'Women', name: "Designer Festive Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0026_28f4edd1-c5bb-426c-9729-704643941e6b.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 420, category: "Festive", gender: 'Women', name: "Wedding Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/RDM_9481_500KB.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 1192, category: "Festive", gender: 'Women', name: "Chikankari Kurta Palazzo Dupatta Set", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/ChatGPTImageApr26_2026at04_12_15PM.png?width=600", colourHex: "#D3C3B2", colourName: "Mushroom Beige", buyUrl: "https://ethenika.com/products/ethenika-ready-wear-chikankari-kurta-palazzo-dupatta-set" },
  { id: 1193, category: "Festive", gender: 'Women', name: "Afghani Floral Kurti Dupatta Pant Set", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/IMG-20230801-WA0172.jpg?width=600", colourHex: "#CDBE93", colourName: "Oat Beige", buyUrl: "https://ethenika.com/products/afghani-floral-work-kurti-dupatta-pant-set" },
  { id: 1194, category: "Festive", gender: 'Women', name: "Banarasi Silk Zari Lehenga Choli Set", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/66BD80B3-CEEE-4496-8BF3-26676FA23D69.jpg?width=600", colourHex: "#581845", colourName: "Wine", buyUrl: "https://ethenika.com/products/banarsi-silk-zari-weaving-work-lehenga-choli-set" },
  { id: 1195, category: "Festive", gender: 'Women', name: "Digital Print Anarkali Sharara Set", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/83DEDCE1-4282-4748-894F-1E3A2D06BC7D.jpg?width=600", colourHex: "#BEC2B3", colourName: "Sage", buyUrl: "https://ethenika.com/products/beautiful-digital-print-with-embroidery-lace-work-anarkali-kurti-with-sharara-dupatta-set-stitched" },
  { id: 1196, category: "Festive", gender: 'Women', name: "Gujarati Kutchi Chaniya Choli", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/04222F72-D27D-477C-B39D-4998E36F577B.jpg?width=600", colourHex: "#D3A782", colourName: "Peach", buyUrl: "https://ethenika.com/products/butter-silk-heavy-gujrati-kutchi-work-navratri-special-chaniya-choli" },
  { id: 1197, category: "Festive", gender: 'Women', name: "Lavender Chaniya Choli", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/3A17FBA7-3AD3-4DD6-AD28-BE097A1887AC.jpg?width=600", colourHex: "#B7A7D6", colourName: "Lavender", buyUrl: "https://ethenika.com/products/butter-silk-navratri-special-lavender-color-chaniya-choli" },
  { id: 1198, category: "Festive", gender: 'Women', name: "Chikankari Kaftan Dress", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/759F3938-CBF9-4F35-B661-A992CFB08B79.png?width=600", colourHex: "#C2A68C", colourName: "Sand", buyUrl: "https://ethenika.com/products/chanderi-chikankari-ready-to-wear-kaftan" },
  { id: 1199, category: "Festive", gender: 'Women', name: "Chanderi Moti Mirror Salwar Set", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/9F308258-6C12-4FCA-97D9-0CF213D8B099.jpg?width=600", colourHex: "#AC9400", colourName: "Mustard", buyUrl: "https://ethenika.com/products/chanderi-hand-moti-and-mirror-work-salwar-dress-material-stitched" },
  { id: 1200, category: "Festive", gender: 'Women', name: "Rani Pink Indowestern Dhoti Set", img: "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/6819e142ee263e50e7ed4e79/cat_img/Elegant_Rani_Pink_Indowestern_Three_Piece_Dhoti_Set_With_Bandhani_Print_Shrug_For_Women_OIC7R5Y8NW_2026-03-06_1.jpg", colourHex: "#C2185B", colourName: "Rani Pink", buyUrl: "https://shanaya.in/Elegant-Rani-Pink-Indowestern-Three-Piece-Dhoti-Set-With-Bandhani/catalogue/5wr6mY4o/uD10MLV-" },
  { id: 1251, category: "Festive", gender: 'Women', name: "ZARIKALI Floral Embroidered A-Line Kurti With Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/JULY/9/oHvNKwPD_b9dd228094d9425a90054650cf4093bb.jpg", colourHex: "#FFFDD0", colourName: "Cream", buyUrl: "https://www.myntra.com/kurta-sets/zarikali/zarikali-floral-embroidered-v-neck-a-line-kurti-with-palazzos--dupatta/35512764/buy" },
  { id: 1252, category: "Festive", gender: 'Women', name: "WAZIX Zari Velvet Kurta With Trousers", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/AUGUST/25/BnaHXZL0_45e3ad5d53414a7c95962ab35d428ff7.jpg", colourHex: "#2E8B57", colourName: "Green", buyUrl: "https://www.myntra.com/kurta-sets/wazix+clothing/wazix-clothing-floral-embroidered-v-neck-zari-velvet-kurta-with-trousers--dupatta/35376910/buy" },
  { id: 1253, category: "Festive", gender: 'Women', name: "HERE&NOW Embroidered Empire Kurti with Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/4/f2rsN4NL_5b636c6b099445c7bbaba29e520a174e.jpg", colourHex: "#2E8B57", colourName: "Sea Green", buyUrl: "https://www.myntra.com/kurta-sets/here%26now/herenow-women-ethnic-motifs-embroidered-empire-kurti-with-palazzos--with-dupatta/39844134/buy" },
  { id: 1254, category: "Festive", gender: 'Women', name: "DRIP CHOWK Tiered Sequinned Pure Silk Kurta", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/29/5n06MTBL_f0abbbc82fc24a5d95cbf5291198c10b.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/kurta-sets/drip+chowk/drip-chowk-women-ethnic-motifs-embroidered-tiered-sequinned-pure-silk-kurta-with-palazzos--with-dupatta/42686514/buy" },
  { id: 1255, category: "Festive", gender: 'Women', name: "Livewear Floral Sequinned Kurta With Dupatta", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/20/K0IeYzyi_83b4d824722248b58db54af24e81fd58.jpg", colourHex: "#FFFDD0", colourName: "Cream", buyUrl: "https://www.myntra.com/kurta-sets/livewear/livewear-women-floral-embroidered-regular-sequinned-kurta-with-dupatta/40791579/buy" },
  { id: 1256, category: "Festive", gender: 'Women', name: "SIDDESHWARY FAB Mirror Work Pure Silk Kurta", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/20/9b9iQtJy_7929e8b06aa94a3b93144634dc5bbcf4.jpg", colourHex: "#FF8C00", colourName: "Orange", buyUrl: "https://www.myntra.com/kurta-sets/siddeshwary+fab/siddeshwary-fab-women-ethnic-motifs-embroidered-regular-mirror-work-pure-silk-kurta-with-palazzos--with/40796922/buy" },
  { id: 1257, category: "Festive", gender: 'Women', name: "ZARIKALI Mirror Work Kurta with Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/4/qAnm838w_fb3c435a7f484c4daf054fb52b46b282.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/kurta-sets/zarikali/zarikali-women-ethnic-motifs-embroidered-regular-mirror-work-kurta-with-palazzos--with-dupatta/41821736/buy" },
  { id: 1258, category: "Festive", gender: 'Women', name: "HERIN ENTERPRISE Sequinned Kurta with Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/12/T8kFUuSq_a3223da84e5e41a688c72181a626a636.jpg", colourHex: "#6E4B3A", colourName: "Brown", buyUrl: "https://www.myntra.com/kurta-sets/herin+enterprise/herin-enterprise-women-floral-embroidered-regular-sequinned-kurta-with-palazzos--with-dupatta/40805150/buy" },
  // Women Wedding
  { id: 501, category: "Wedding", gender: 'Women', name: "Designer Wedding Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Saraswati_5_2bf689ed-884e-420b-a724-7576a60a9240.jpg?width=600", colourHex: "#F5F1E8", colourName: "Beige", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 502, category: "Wedding", gender: 'Women', name: "Embroidered Wedding Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Indiravastra1.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 503, category: "Wedding", gender: 'Women', name: "Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/latika_1_66dc4cf8-23e3-49b0-bfda-71c1cab50930.jpg?width=600", colourHex: "#E67E22", colourName: "Amber", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 504, category: "Wedding", gender: 'Women', name: "Velvet Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sona_Sitara_6.jpg?width=600", colourHex: "#581845", colourName: "Wine Velvet", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 505, category: "Wedding", gender: 'Women', name: "Ivory Chikankari Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Tyohar1.jpg?width=600", colourHex: "#FDEBD0", colourName: "Ivory Pearl", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 506, category: "Wedding", gender: 'Women', name: "Traditional Red Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/10_49_500KB.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 507, category: "Wedding", gender: 'Women', name: "Mirror Work Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/1_3_500KB_8452aa5b-0aae-4aab-ad67-08fe2022fb4a.jpg?width=600", colourHex: "#F8BBD0", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 508, category: "Wedding", gender: 'Women', name: "Sequin Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/RDM_1364_500KB.jpg?width=600", colourHex: "#8E44AD", colourName: "Violet", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 509, category: "Wedding", gender: 'Women', name: "Pastel Cape Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Shobita_4.jpg?width=600", colourHex: "#F8BBD0", colourName: "Pastel Rose", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 510, category: "Wedding", gender: 'Women', name: "Floral Embroidered Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/1_6_500KB_696be93f-c9a0-4f19-973b-aa56eef4f6f5.jpg?width=600", colourHex: "#27AE60", colourName: "Emerald", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 511, category: "Wedding", gender: 'Women', name: "Royal Anarkali Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/AkshayaBK1273N9.jpg?width=600", colourHex: "#16A085", colourName: "Teal", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 512, category: "Wedding", gender: 'Women', name: "Wedding Sharara Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/003.jpg?width=600", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women/ethnic-wear/sharara" },
  { id: 513, category: "Wedding", gender: 'Women', name: "Bridal Sharara Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/BULLIONKNOT0229516500KB.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/sharara" },
  { id: 514, category: "Wedding", gender: 'Women', name: "Wedding Gharara Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/21_16e4e7ff-6786-4f2b-a563-3263604b56c1.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral", buyUrl: "https://www.myntra.com/women/ethnic-wear/gharara" },
  { id: 515, category: "Wedding", gender: 'Women', name: "Designer Silk Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Twisha1_955b1e66-7c31-41b3-a771-1ade18d1c7cf.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 516, category: "Wedding", gender: 'Women', name: "Banarasi Wedding Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sheetal_28th_Jul72737_2.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 517, category: "Wedding", gender: 'Women', name: "Banarasi Wedding Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC04628.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 518, category: "Wedding", gender: 'Women', name: "Pre-Draped Wedding Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Nithya_2-In-1_Half_Saree_Red_With_Maggam_Handwork1.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 519, category: "Wedding", gender: 'Women', name: "Embroidered Wedding Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Garima_2-In-1_Half_Saree_Green_Handloom_sequin_handwork1.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 520, category: "Wedding", gender: 'Women', name: "Silk Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/OF-05_bfc70b2f-9dbf-4fe1-a8a9-e5deb9565631.jpg?width=600", colourHex: "#7F8C8D", colourName: "Ash Grey", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1207, category: "Wedding", gender: 'Women', name: "Fendi Silk Embroidery Sharara Dupatta Set", img: "https://cdn.shopify.com/s/files/1/0767/0071/3237/files/637B3986-7505-4BD6-9529-54B969700EF4.jpg?width=600", colourHex: "#581845", colourName: "Maroon", buyUrl: "https://ethenika.com/products/fendi-silk-embroidery-work-designer-kurti-sharara-dupatta-set" },
  { id: 1208, category: "Wedding", gender: 'Women', name: "HOUSE OF FETT Metallic Cape Sleeve Gown", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/SEPTEMBER/27/4aPGaEeQ_d975702e22e34fd3a378e78080b36cbf.jpg", colourHex: "#B87333", colourName: "Copper", buyUrl: "https://www.myntra.com/dresses/house-of-fett/house-of-fett-queen-of-hearts-women-metallic-cape-sleeve-gown-maxi-dress/37235213/buy" },
  { id: 1209, category: "Wedding", gender: 'Women', name: "JC Mode Red Round Neck Gown", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/JULY/19/RtmwJ6Ki_479ff19479ae456eaa859f0e2344d9aa.jpg", colourHex: "#C0392B", colourName: "Red", buyUrl: "https://www.myntra.com/dresses/jc-mode/jc-mode-women-round-neck-gown-dress/35842407/buy" },
  { id: 1243, category: "Wedding", gender: 'Women', name: "ZARIKALI Golden Gharara Set Dabka Pearl Work Benarasi Silk", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/19/PqvLmWZX_39307d5b5136407a88208b206b71da76.jpg", colourHex: "#D4AF37", colourName: "Gold", buyUrl: "https://www.myntra.com/kurta-sets/zarikali/zarikali-golden-gharara-set-dabka--pearl-work-benarasi-tissue-silk-ensemble/40753351/buy" },
  { id: 1244, category: "Wedding", gender: 'Women', name: "DRIP CHOWK Teal Pure Silk Kurta with Sharara", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/29/XIPQq9CV_20058f147208418492b5ba30d3e9f84a.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/kurta-sets/drip+chowk/drip-chowk-women-ethnic-motifs-embroidered-regular-pure-silk-kurta-with-sharara--with-dupatta/42686507/buy" },
  { id: 1245, category: "Wedding", gender: 'Women', name: "Colors of Earth Beadswork Peplum Kurti Sharara Set", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/19/2uURClRl_1ca4368373e5461c82ea6688d028cbfe.jpg", colourHex: "#D4AF37", colourName: "Gold", buyUrl: "https://www.myntra.com/kurta-sets/colors++of+earth/colors-of-earth-silk-embroidered-beadswork-peplum-kurti-and-sharara-set-with-dupatta/40162904/buy" },
  { id: 1246, category: "Wedding", gender: 'Women', name: "Varsha Fashion Pure Silk Kurta with Sharara", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/11/NYneATVC_8a243a2b61f842d992e964802cf31f39.jpg", colourHex: "#F5F1E8", colourName: "Off White", buyUrl: "https://www.myntra.com/kurta-sets/varsha+fashion/varsha-fashion-women-ethnic-motifs-regular-thread-work-pure-silk-kurta-with-sharara--with/39835095/buy" },
  { id: 1247, category: "Wedding", gender: 'Women', name: "ANVERI Silk A-Line Kurta with Sharara", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/AUGUST/26/e8B16Egl_9f8ab0f1b1e9403f88bc935cf95e6087.jpg", colourHex: "#FFFFFF", colourName: "White", buyUrl: "https://www.myntra.com/kurta-sets/anveri+textiles/anveri-textiles-women-ethnic-motifs-embroidered-silk-a-line-kurta-with-sharara--dupatta/36634555/buy" },
  { id: 1248, category: "Wedding", gender: 'Women', name: "krisha fashion Bandhani Sequinned Kurta Sharara", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/OCTOBER/1/VGdSM6uS_2495fe5039a5461f90124273bdbe970c.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/kurta-sets/krisha+fashion/krisha-fashion-women-bandhani-embroidered-regular-sequinned-kurta-with-sharara--dupatta/37290607/buy" },
  { id: 1249, category: "Wedding", gender: 'Women', name: "Ecolors Fab Thread Work Kurta with Sharara", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JANUARY/7/ndiphDuc_56c3ea8a3a7241b6b7d97670c74291c9.jpg", colourHex: "#581845", colourName: "Maroon", buyUrl: "https://www.myntra.com/kurta-sets/ecolors+fab/ecolors-fab-women-ethnic-motifs-embroidered-regular-thread-work-kurta-with-sharara--with-dupatta/39235319/buy" },
  { id: 1250, category: "Wedding", gender: 'Women', name: "KRYSAL Sequinned Kurta with Sharara", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JANUARY/31/ScXkKqB5_64b5a1b4ff07405ab46dd4ba4f3ac86c.jpg", colourHex: "#F5F1E8", colourName: "Off White", buyUrl: "https://www.myntra.com/kurta-sets/krysal/krysal-women-ethnic-motifs-embroidered-regular-sequinned-kurta-with-sharara--with-dupatta/39738357/buy" },
  { id: 1275, category: "Wedding", gender: 'Women', name: "Burgundy Embellished Georgette Maxi Gown", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/8/KYaixGuH_9f578347c518416ca7284af0c43e5635.jpg", colourHex: "#6B0F1A", colourName: "Burgundy", buyUrl: "https://www.myntra.com/dresses/rudraprayag/burgundy-embellished-georgette-maxi-gown/42908225/buy" },
  { id: 1276, category: "Wedding", gender: 'Women', name: "RUDRAPRAYAG Ethnic Motifs Georgette Maxi Gown", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/SxwUdyHB_5be23dfbf85e4c9bbdf63aca0219f29d.jpg", colourHex: "#181818", colourName: "Black", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-ethnic-motifs-georgette-maxi-gown/40091256/buy" },
  // Women Party (western party dresses)
  { id: 1101, category: "Party", gender: 'Women', name: "Black Sequin Halter Mini Dress", img: "https://m.media-amazon.com/images/I/41TVnH7dzmL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Onyx Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1102, category: "Party", gender: 'Women', name: "Two-Piece Sequin Cocktail Dress", img: "https://m.media-amazon.com/images/I/41UHszU0xxL._AC_SL1000_.jpg", colourHex: "#8D6E63", colourName: "Brown", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1103, category: "Party", gender: 'Women', name: "White Sequin Fringe Party Dress", img: "https://m.media-amazon.com/images/I/41sG-8KiruL._AC_SL1000_.jpg", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1104, category: "Party", gender: 'Women', name: "Sequin Tassel Bodycon Midi", img: "https://m.media-amazon.com/images/I/41b4-3YbPbL._AC_SL1000_.jpg", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1105, category: "Party", gender: 'Women', name: "Rose Sequin Mermaid Gown", img: "https://m.media-amazon.com/images/I/411K-mXaj3L._AC_SL1000_.jpg", colourHex: "#E8B4B8", colourName: "Rose", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1106, category: "Party", gender: 'Women', name: "Black Sequin V-Neck Cocktail Dress", img: "https://m.media-amazon.com/images/I/4101iWogyYL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Jet Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1107, category: "Party", gender: 'Women', name: "Apricot Sequin Bodycon Dress", img: "https://m.media-amazon.com/images/I/41z5k8wPpCL._AC_SL1000_.jpg", colourHex: "#F5B7B1", colourName: "Apricot", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1223, category: "Party", gender: 'Women', name: "Maroon One Shoulder Ruched Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/01/14125603a1b4688e/NM-IN-56-DRS-25-JUL-20853-MAROON(1).webp", colourHex: "#681828", colourName: "Maroon", buyUrl: "https://newme.asia/product/maroon-one-shoulder-ruched-maxi-dress" },
  { id: 1224, category: "Party", gender: 'Women', name: "Black Embroidered Ethnic A-Line Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/11142715691bc9e7/NM-IN-56-DRS-26-MAR-32194-BLACK(0).webp", colourHex: "#181818", colourName: "Black", buyUrl: "https://newme.asia/product/black-embroidered-ethnic-a-line-dress-4" },
  { id: 1225, category: "Party", gender: 'Women', name: "Black Cowl Neck Midi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/1114272011e56ba1/NM-IN-56-DRS-26-JUN-34296-BLACK(0).webp", colourHex: "#181818", colourName: "Black", buyUrl: "https://newme.asia/product/black-cowl-neck-midi-dress-2" },
  { id: 1226, category: "Party", gender: 'Women', name: "Red Belted Tube Mini Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/05/15092342e3421878/NM-IN-56-DRS-26-MAR-31783-RED(0).webp", colourHex: "#B31828", colourName: "Red", buyUrl: "https://newme.asia/product/red-belted-tube-mini-dress-2" },
  { id: 1227, category: "Party", gender: 'Women', name: "Maroon Extended Cape Sleeve Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2025/09/22070612a3387bfa/NM-IN-56-DRS-24-OCT-9947-MAROON_(1).webp", colourHex: "#680818", colourName: "Maroon", buyUrl: "https://newme.asia/product/maroon-extented-cape-sleeve-maxi-dress-2" },
  { id: 1108, category: "Party", gender: 'Women', name: "Black Rhinestone Halter Party Dress", img: "https://m.media-amazon.com/images/I/41Wi-4OLDCL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Onyx Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1109, category: "Party", gender: 'Women', name: "Black Sequin Long Sleeve Gown", img: "https://m.media-amazon.com/images/I/41dtbZoCyHL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Jet Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1110, category: "Party", gender: 'Women', name: "Black Sequin Boat Neck Dress", img: "https://m.media-amazon.com/images/I/41Gmlb4KVOL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Onyx Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1111, category: "Party", gender: 'Women', name: "Pink Sequin Ruched Dress", img: "https://m.media-amazon.com/images/I/31sPt7EAKKL._AC_SL1000_.jpg", colourHex: "#F8BBD0", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1112, category: "Party", gender: 'Women', name: "Black Satin One-Shoulder Midi", img: "https://m.media-amazon.com/images/I/31hN7WuV3UL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Jet Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1113, category: "Party", gender: 'Women', name: "Champagne Sequin Fit & Flare Dress", img: "https://m.media-amazon.com/images/I/41Cr80Unp6L._AC_SL1000_.jpg", colourHex: "#D4AF37", colourName: "Champagne Gold", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1114, category: "Party", gender: 'Women', name: "Navy Sequin Ruffle Sleeve Dress", img: "https://m.media-amazon.com/images/I/41OrPmBFrUL._AC_SL1000_.jpg", colourHex: "#1A237E", colourName: "Navy", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1228, category: "Party", gender: 'Women', name: "Red Solid Tiered Mini Halter Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/02/05093645b7b9cdfe/NM-IN-56-DRS-25-DEC-27775-RED(0).webp", colourHex: "#980818", colourName: "Red", buyUrl: "https://newme.asia/product/red-solid-tiered-mini-halter-dress" },
  { id: 1229, category: "Party", gender: 'Women', name: "Black Lace Bodycon Slit Mini Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/05/08101238dcbf75d8/NM-IN-56-DRS-25-NOV-26075-BLACK(0).webp", colourHex: "#181818", colourName: "Black", buyUrl: "https://newme.asia/product/black-lace-bodycon-slit-mini-dress-4" },
  { id: 1230, category: "Party", gender: 'Women', name: "Dark Blue One Shoulder Ruched Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/121609449b841408/NM-IN-56-DRS-26-JAN-29574-DARKBLUE(0).webp", colourHex: "#282848", colourName: "Dark Blue", buyUrl: "https://newme.asia/product/dark-blue-one-shoulder-ruched-maxi-dress-4" },
  { id: 1231, category: "Party", gender: 'Women', name: "Solid Satin Back Knot Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2025/06/0219465929563e25/NM-IN-56-DRS-23-NOV-2876-MAROON(1).webp", colourHex: "#888878", colourName: "Silver", buyUrl: "https://newme.asia/product/solid-satin-back-knot-maxi-dress-2" },
  { id: 1232, category: "Party", gender: 'Women', name: "Maroon Shimmer Halter Slit Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/02/17073359cf87c35d/NM-IN-56-DRS-25-OCT-25276-MAROON(0).webp", colourHex: "#680818", colourName: "Maroon", buyUrl: "https://newme.asia/product/maroon-shimmer-halter-slit-dress" },
  { id: 1115, category: "Party", gender: 'Women', name: "Black Bodycon Slit Dress", img: "https://m.media-amazon.com/images/I/31WcI3Al6vL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Onyx Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1116, category: "Party", gender: 'Women', name: "Rose Gold Sequin Dress", img: "https://m.media-amazon.com/images/I/41GHpY1ZwNL._AC_SL1000_.jpg", colourHex: "#B76E79", colourName: "Rose Gold", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1117, category: "Party", gender: 'Women', name: "Black Halter Cocktail Dress", img: "https://m.media-amazon.com/images/I/31vA+kYGhJL._AC_SL1000_.jpg", colourHex: "#1A1A1A", colourName: "Jet Black", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1118, category: "Party", gender: 'Women', name: "White Halter Mini Dress", img: "https://m.media-amazon.com/images/I/31W6ePumsgL._AC_SL1000_.jpg", colourHex: "#FFFFFF", colourName: "Pure White", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1120, category: "Party", gender: 'Women', name: "Floral Print Cocktail Dress", img: "https://m.media-amazon.com/images/I/41QSanyEM0L._AC_SL1000_.jpg", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women-party-wear-dresses" },
  { id: 1210, category: "Party", gender: 'Women', name: "EVANIK Embellished Embroidered Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/DECEMBER/12/Fm0rwwhG_936add6ef946438694c49877d1e9e6cc.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/evanik/evanik-embellished-embroidered-maxi-dress/38599737/buy" },
  { id: 1233, category: "Party", gender: 'Women', name: "Light Pink Lace Slit Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/12160901e9a10f01/NM-IN-56-DRS-26-JUN-34376-LIGHTPINK(0).webp", colourHex: "#C8A8A8", colourName: "Light Pink", buyUrl: "https://newme.asia/product/light-pink-lace-slit-maxi-dress-2" },
  { id: 1234, category: "Party", gender: 'Women', name: "Red Striped One-Shoulder Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/121610050c833859/NM-IN-56-DRS-26-APR-32601-RED(0).webp", colourHex: "#B31828", colourName: "Red", buyUrl: "https://newme.asia/product/red-striped-one-shoulder-maxi-dress-4" },
  { id: 1235, category: "Party", gender: 'Women', name: "Black One Shoulder Ruched Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/01/14125604d1524eb0/NM-IN-56-DRS-25-JUL-20853-BLACK_(1).webp", colourHex: "#181818", colourName: "Black", buyUrl: "https://newme.asia/product/black-one-shoulder-ruched-maxi-dress-11" },
  { id: 1236, category: "Party", gender: 'Women', name: "Wine Lace Plunge Wrap Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/1216094837f1b84f/NM-IN-56-DRS-26-JUN-34739-WINE(0).webp", colourHex: "#6B0F1A", colourName: "Wine", buyUrl: "https://newme.asia/product/wine-lace-plunge-wrap-dress-2" },
  { id: 1237, category: "Party", gender: 'Women', name: "Light Pink Floral Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/11142803a793ab2e/NM-IN-56-DRS-26-MAY-34013-LIGHTPINK(0).webp", colourHex: "#C8A8A8", colourName: "Light Pink", buyUrl: "https://newme.asia/product/light-pink-floral-maxi-dress-32" },
  { id: 1211, category: "Party", gender: 'Women', name: "RUDRAPRAYAG Yellow Embellished Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/APRIL/24/4RkqCVow_a7baf753d7824adbb3187eb5700f7e77.jpg", colourHex: "#F1C40F", colourName: "Yellow", buyUrl: "https://www.myntra.com/dresses/rudraprayag/yellow-embellished-georgette-maxi-dress/41594050/buy" },
  { id: 1212, category: "Party", gender: 'Women', name: "RUDRAPRAYAG Pink Embellished Georgette A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/19/q6TqunK5_7322ff8a88064d27b50dba6fbb23d316.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/dresses/rudraprayag/pink-embellished-georgette-a-line-maxi-dress/41594048/buy" },
  { id: 1213, category: "Party", gender: 'Women', name: "RUDRAPRAYAG Brown Embellished Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/8/HgrHgdAe_74843fd831cc45519ea46f9fb4860ab8.jpg", colourHex: "#6E4B3A", colourName: "Brown", buyUrl: "https://www.myntra.com/dresses/rudraprayag/brown-embellished-georgette-maxi-dress/42908223/buy" },
  { id: 1214, category: "Party", gender: 'Women', name: "bebe Embellished Flared Sleeve Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/7/3GOAeIlw_7f6d7448c7f54ecd90f45bd69b373157.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/dresses/bebe/bebe-embellished-flared-sleeve-maxi-dress/37819300/buy" },
  { id: 1215, category: "Party", gender: 'Women', name: "RUNAYA NX Floral Embroidered Satin Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/28/E2aUFPVd_0cea9620153f48f1af92270f6c04df0f.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/runaya-nx/runaya-nx-floral-embroidered-satin-maxi-dress/40393662/buy" },
  { id: 1216, category: "Party", gender: 'Women', name: "TANUJ FASHION Embroidered Flared Sleeve Chiffon Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/20/tvKGJjnA_82417532b5fd4557b819c27366d0dbd1.jpg", colourHex: "#F5F1E8", colourName: "Off White", buyUrl: "https://www.myntra.com/dresses/tanuj-fashion/tanuj-fashion-embroidered-flared-sleeve-chiffon-fit-flare-dress/40198838/buy" },
  { id: 1217, category: "Party", gender: 'Women', name: "Eavan Rose Lace Maxi Dress With Jacket", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/16008392/2021/11/3/9bb8a36e-9524-4035-9e1f-62220c557cc21635963759136EavanRoseGoldLaceMaxiDress1.jpg", colourHex: "#B76E79", colourName: "Rose Gold", buyUrl: "https://www.myntra.com/dresses/eavan/eavan-rose-lace-maxi-dress-with-attached-jacket/16008392/buy" },
  { id: 1238, category: "Party", gender: 'Women', name: "Wine One Shoulder Ruched Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/1216093379fb1d66/NM-IN-56-DRS-26-JAN-29574-WINE(0).webp", colourHex: "#6B0F1A", colourName: "Wine", buyUrl: "https://newme.asia/product/wine-one-shoulder-ruched-maxi-dress-11" },
  { id: 1239, category: "Party", gender: 'Women', name: "Yellow Fitted High Neck Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/04/161010424f33c0da/NM-IN-56-DRS-24-JUN-6896-YELLOW(0).webp", colourHex: "#E8C828", colourName: "Yellow", buyUrl: "https://newme.asia/product/yellow-fitted-high-neck-maxi-dress" },
  { id: 1240, category: "Party", gender: 'Women', name: "Wine One-Shoulder Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/08/12161022ad7d37f7/NM-IN-56-DRS-26-FEB-30972-WINE(0).webp", colourHex: "#6B0F1A", colourName: "Wine", buyUrl: "https://newme.asia/product/wine-one-shoulder-maxi-dress-7" },
  { id: 1241, category: "Party", gender: 'Women', name: "Yellow Spaghetti Strap Tiered Dress", img: "https://assets.newme.asia/wp-content/uploads/2024/08/27110833990dbf18/NM-IN-56-DRS-24-MAY-5444-YELLOW(1).webp", colourHex: "#E8C828", colourName: "Yellow", buyUrl: "https://newme.asia/product/yellow-spaghetti-strap-tiered-dress-2" },
  { id: 1242, category: "Party", gender: 'Women', name: "Yellow Floral Ruched Maxi Dress", img: "https://assets.newme.asia/wp-content/uploads/2026/02/250703191646732a/NM-IN-56-DRS-26-JAN-22502-YELLOW(0).webp", colourHex: "#E8C828", colourName: "Yellow", buyUrl: "https://newme.asia/product/yellow-floral-ruched-maxi-dress" },
  { id: 1268, category: "Party", gender: 'Women', name: "Purple Embellished Georgette A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/Xp2wuo04_6cee096423634b58be863cf7bc8ac534.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/purple-embellished-georgette-a-line-maxi-dress/40091227/buy" },
  { id: 1269, category: "Party", gender: 'Women', name: "Teal Embellished Ethnic Motif Fit & Flare Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/13/ehAA7fZV_1fabf4d1dc6d418eb2cea816f4c14048.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/dresses/tilki/teal-embellished-ethnic-motif-fit--flare-maxi-dress/40658170/buy" },
  { id: 1270, category: "Party", gender: 'Women', name: "Purple Embellished Georgette A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/19/v7UvsW8x_1fc1d513faff4d34bce95a10be5f8d07.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/purple-embellished-georgette-a-line-maxi-dress/41594049/buy" },
  { id: 1271, category: "Party", gender: 'Women', name: "EVANIK Embellished Embroidered Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/DECEMBER/12/lfhn7k19_894db7473ab549bc81a60f61fc1bf6b9.jpg", colourHex: "#2980B9", colourName: "Blue", buyUrl: "https://www.myntra.com/dresses/evanik/evanik-embellished-embroidered-maxi-dress/38599738/buy" },
  { id: 1272, category: "Party", gender: 'Women', name: "EVANIK Embellished Embroidered Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/DECEMBER/12/CoMIZGHd_2ed0cf40ab504c3fb5871ba8ebae6ef6.jpg", colourHex: "#7CB342", colourName: "Lime Green", buyUrl: "https://www.myntra.com/dresses/evanik/evanik-embellished-embroidered-maxi-dress/38599736/buy" },
  { id: 1273, category: "Party", gender: 'Women', name: "Blue Embellished Georgette A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/25/SkJfdTyf_26c634421b0648b6b6558e29fd248e44.jpg", colourHex: "#2980B9", colourName: "Blue", buyUrl: "https://www.myntra.com/dresses/rudraprayag/blue-embellished-georgette-a-line-maxi-dress/41594052/buy" },
  { id: 1274, category: "Party", gender: 'Women', name: "RUNAYA NX Floral Embroidered Velvet Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/28/8PBcKMrR_a28f1eadf44d4f669fa152b2d374d038.jpg", colourHex: "#C8B8A8", colourName: "Multi", buyUrl: "https://www.myntra.com/dresses/runaya+nx/runaya-nx-floral-embroidered-velvet-maxi-dress/40400505/buy" },
  // Women Bridal
  { id: 701, category: "Bridal", gender: 'Women', name: "Red Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Amulya1.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson Red", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 702, category: "Bridal", gender: 'Women', name: "Maroon Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Lajja_4_a9381f10-4436-49ce-afca-f18b306c0944.jpg?width=600", colourHex: "#900C3F", colourName: "Deep Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 703, category: "Bridal", gender: 'Women', name: "Pink Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/peetalgulabi3.jpg?width=600", colourHex: "#C2185B", colourName: "Rani Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 704, category: "Bridal", gender: 'Women', name: "Velvet Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Pritti_1.jpg?width=600", colourHex: "#581845", colourName: "Wine Velvet", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 705, category: "Bridal", gender: 'Women', name: "Zardozi Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/zardosi_leher_6.jpg?width=600", colourHex: "#FFFFFF", colourName: "Pure White", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 706, category: "Bridal", gender: 'Women', name: "Kundan Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Nilambarinoor_1.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 707, category: "Bridal", gender: 'Women', name: "Pearl Work Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Bhargavi4.jpg?width=600", colourHex: "#F8BBD0", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 708, category: "Bridal", gender: 'Women', name: "Heavy Embroidered Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Navya_Soft_Silk_Lime_Green_Lehenga1.jpg?width=600", colourHex: "#8E44AD", colourName: "Violet", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 709, category: "Bridal", gender: 'Women', name: "Gota Patti Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/GaurikaBK1283N4.jpg?width=600", colourHex: "#7F8C8D", colourName: "Ash Grey", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 710, category: "Bridal", gender: 'Women', name: "Sequin Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Kaushika_2.jpg?width=600", colourHex: "#27AE60", colourName: "Emerald", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 711, category: "Bridal", gender: 'Women', name: "Bridal Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sheetal28thJul73155_2.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 712, category: "Bridal", gender: 'Women', name: "Red Bridal Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/22_c6128942-a355-4be0-993f-5c5a47b841d7.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson Red", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 713, category: "Bridal", gender: 'Women', name: "Bridal Sharara", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/LaxmiRedlehenga3.jpg?width=600", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women/ethnic-wear/sharara" },
  { id: 714, category: "Bridal", gender: 'Women', name: "Bridal Gharara", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/49_0c3656c6-f93c-49db-9849-dac9293a1dcc.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/gharara" },
  { id: 715, category: "Bridal", gender: 'Women', name: "Bridal Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KamalPadma_2.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 716, category: "Bridal", gender: 'Women', name: "Banarasi Bridal Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sheetal28thJul72601_2.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 717, category: "Bridal", gender: 'Women', name: "Designer Bridal Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/RasikaBK1268N_3692fa36-a2ac-4eec-8fc2-d9d5962e7a1b.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 718, category: "Bridal", gender: 'Women', name: "Silk Bridal Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Rangbhoomi_4.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 719, category: "Bridal", gender: 'Women', name: "Bridal Pre-Draped Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Mohini4.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 720, category: "Bridal", gender: 'Women', name: "Royal Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Prathna1.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1121, category: "Bridal", gender: 'Women', name: "Maharani Red Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/10_53_500KB.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1122, category: "Bridal", gender: 'Women', name: "Wineesha Maroon Dola Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/005.jpg?width=600", colourHex: "#900C3F", colourName: "Deep Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1123, category: "Bridal", gender: 'Women', name: "Sona Sitara Gold Silk Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sona_Sitara_5.jpg?width=600", colourHex: "#D4AF37", colourName: "Gold", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1124, category: "Bridal", gender: 'Women', name: "Hemanjali Banarasi Silk Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sheetal_28th_Jul72760_2.jpg?width=600", colourHex: "#B8860B", colourName: "Golden Silk", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1125, category: "Bridal", gender: 'Women', name: "Rakta Kamal Silk Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/27_15021f0f-4a4f-442f-a6aa-63397bc9aacd.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral Red", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1126, category: "Bridal", gender: 'Women', name: "Indulekha Soft Silk Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/41_ffd7f7f9-3dd3-446e-a468-0ac5cccf1103.jpg?width=600", colourHex: "#1E8449", colourName: "Emerald Green", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1127, category: "Bridal", gender: 'Women', name: "Chandra Gauri Pattu Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/chandra_gauri_model_image__1.jpg?width=600", colourHex: "#F5B7B1", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1128, category: "Bridal", gender: 'Women', name: "Paithani Pratha Peach Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sheetal28thJul72648_2.jpg?width=600", colourHex: "#FAD7A0", colourName: "Peach", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1129, category: "Bridal", gender: 'Women', name: "Elakshi Designer Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/OPTIMIZE_BACKUP_PRODUCT_Elakshi_5.jpg?width=600", colourHex: "#8E44AD", colourName: "Violet", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1130, category: "Bridal", gender: 'Women', name: "Bunaai Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Bunaai_4.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1131, category: "Bridal", gender: 'Women', name: "Cinderella Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Cinderella.jpg?width=600", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1132, category: "Bridal", gender: 'Women', name: "Pankti Bridal Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Pankti_1.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  // Women Traditional
  { id: 801, category: "Traditional", gender: 'Women', name: "Banarasi Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/SUTRADHARA_4.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 802, category: "Traditional", gender: 'Women', name: "Chanderi Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/NAVRANG_2_5.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 803, category: "Traditional", gender: 'Women', name: "Bandhani Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/NAZAKAT_2.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 804, category: "Traditional", gender: 'Women', name: "Designer Silk Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/dhoop_chhao_5_ef05f78c-e9c6-4a29-8051-0d7840cc8bf9.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 805, category: "Traditional", gender: 'Women', name: "Traditional Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/varidanvan.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 806, category: "Traditional", gender: 'Women', name: "Patiala Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KalaKriti_1.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/salwar-kameez" },
  { id: 807, category: "Traditional", gender: 'Women', name: "Draped Saree Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC_4706copy2.jpg?width=600", colourHex: "#16A085", colourName: "Teal", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 808, category: "Traditional", gender: 'Women', name: "Designer Party Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Twilight_7.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 809, category: "Traditional", gender: 'Women', name: "Patiala Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/vaibhavi_2.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/salwar-kameez" },
  { id: 810, category: "Traditional", gender: 'Women', name: "Banarasi Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/SUTRADHARA_4.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 811, category: "Traditional", gender: 'Women', name: "Chanderi Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/NAVRANG_2_5.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 812, category: "Traditional", gender: 'Women', name: "Bandhani Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/NAZAKAT_2.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 813, category: "Traditional", gender: 'Women', name: "Designer Silk Saree", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/dhoop_chhao_5_ef05f78c-e9c6-4a29-8051-0d7840cc8bf9.jpg?width=600", colourHex: "#F4D03F", colourName: "Marigold", buyUrl: "https://www.myntra.com/women/ethnic-wear/sarees" },
  { id: 814, category: "Traditional", gender: 'Women', name: "Traditional Anarkali", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/varidanvan.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/anarkali" },
  { id: 815, category: "Traditional", gender: 'Women', name: "Morpankh | Indigo Handloom Half Saree| Festive Elegance", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/MORPANKH_6.jpg?v=1784987162", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/morpankh-indigo-handloom-half-saree-festive-elegance" },
  { id: 816, category: "Traditional", gender: 'Women', name: "Sutradhara | Orange Handloom Half Saree | Festive Heritage", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/SUTRADHARA_4.jpg?v=1784986795", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/sutradhara-orange-handloom-half-saree-festive-heritage" },
  { id: 817, category: "Traditional", gender: 'Women', name: "Navrang | Multicolor Handloom Half Saree | Festive Celebration", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/NAVRANG_2_5.jpg?v=1785238160", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/navrang-multicolor-handloom-half-saree-festive-celebration" },
  { id: 818, category: "Traditional", gender: 'Women', name: "Nazakat | Magenta Handloom Half Saree | Festive Charm", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/NAZAKAT_2.jpg?v=1784986956", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/nazakat-magenta-handloom-half-saree-festive-charm" },
  { id: 819, category: "Traditional", gender: 'Women', name: "Nilotsav | Purple Handloom Half Saree | Festive Grace", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/NILOTSAV_4.jpg?v=1784987020", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/nilotsav-purple-handloom-half-saree-festive-grace" },
  { id: 820, category: "Traditional", gender: 'Women', name: "Kumkum | Pink Handloom Half Saree | Festive Radiance", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KUMKUM_7.jpg?v=1784987070", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/kumkum-pink-handloom-half-saree-festive-radiance" },
  { id: 1218, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Purple Ethnic Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/mxXCHr8T_b6f8b067a1574069b1f68157e9dc18f4.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/purple-ethnic-embroidered-georgette-maxi-dress/40091232/buy" },
  { id: 1219, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Turquoise Ethnic Motifs Georgette Gown", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/19/oylsaI2v_f71d09bb99f448aebf891534a89c89d7.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/dresses/rudraprayag/turquoise-blue-ethnic-motifs-embroidered-georgette-gown/40091245/buy" },
  { id: 1220, category: "Traditional", gender: 'Women', name: "WISHFUL Purple Ethnic Motifs Print Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/24614924/2023/9/11/e943dd33-9e2e-4180-aa45-efbefec89f931694429641444-WISHFUL-Purple-Ethnic-Motifs-Print-Maxi-Dress-81016944296413-11.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/wishful/wishful-purple-ethnic-motifs-print-maxi-dress/24614924/buy" },
  { id: 1221, category: "Traditional", gender: 'Women', name: "EVANIK Ethnic Motifs Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/26/Xk4zMptE_eaf5feafd0d94a6fb1a8afbd7e01c80c.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/dresses/evanik/evanik-ethnic-motifs-maxi-dress/40354502/buy" },
  { id: 1259, category: "Traditional", gender: 'Women', name: "RAJGRANTH Thread Work Pure Silk Kurta With Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/11/ldLPB19L_feba949567474a76a1ccf63f21dd9998.jpg", colourHex: "#FFFDD0", colourName: "Cream", buyUrl: "https://www.myntra.com/kurta-sets/rajgranth/rajgranth-ethnic-motifs-embroidered-thread-work-pure-silk-kurta-with-palazzos--dupatta/39840906/buy" },
  { id: 1260, category: "Traditional", gender: 'Women', name: "DHVIJA FASHION Printed Kurta with Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JANUARY/28/eSwNLdE4_f0eb54a0f9c347fbb582af908bbf64d1.jpg", colourHex: "#D2B48C", colourName: "Beige", buyUrl: "https://www.myntra.com/kurta-sets/dhvija+fashion/dhvija-fashion-women-ethnic-motifs-printed-regular-kurta-with-palazzos--with-dupatta/39671162/buy" },
  { id: 1261, category: "Traditional", gender: 'Women', name: "Apexaura Thread Work Cotton Kurta with Trousers", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/13/doleJZxx_7b5b30e31fd341f29f6c99f9acc84b48.jpg", colourHex: "#D2B48C", colourName: "Beige", buyUrl: "https://www.myntra.com/kurta-sets/apexaura/apexaura-women-ethnic-motifs-embroidered-regular-thread-work-pure-cotton-kurta-with-trousers--with-dupatta/42125080/buy" },
  { id: 1262, category: "Traditional", gender: 'Women', name: "KUKUME Embroidered Kurta with Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/25/KGZNa2wr_d431d605ed504d08a7b63911e0de5ad7.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/kurta-sets/kukume/kukume-women-embroidered-kurta-with-palazzos--with-dupatta/40914715/buy" },
  { id: 1263, category: "Traditional", gender: 'Women', name: "Ecolors Fab Velvet Kurta with Palazzos", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JANUARY/8/5TedkODl_156080b3fdd5426cba5f4f88b8998610.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/kurta-sets/ecolors+fab/ecolors-fab-women-ethnic-motifs-embroidered-regular-thread-work-velvet-kurta-with-palazzos--with-dupatta/39247543/buy" },
  { id: 1264, category: "Traditional", gender: 'Women', name: "HERE&NOW Paisley Embroidered Kurta with Trousers", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/22/txc5jDBX_965e20d352e64f459a7ba31d1b93c93f.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/kurta-sets/here%26now/herenow-women-paisley-embroidered-regular-kurta-with-trousers/40231611/buy" },
  { id: 1265, category: "Traditional", gender: 'Women', name: "ODETTE Floral Georgette Kurta Trouser Set", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/29521454/2024/7/4/b97be1a1-eec9-4b76-b658-713b790b633b1720089769767-ODETTE-Women-Floral-Embroidered-Regular-Thread-Work-Kurti-wi-1.jpg", colourHex: "#FFDAB9", colourName: "Peach", buyUrl: "https://www.myntra.com/kurta-sets/odette/odette-embroidered-floral-georgette-kurta-trouser-set-with-dupatta/29521454/buy" },
  { id: 1266, category: "Traditional", gender: 'Women', name: "Omicron Fab Thread Work Pure Silk Kurta", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/7/5BKSl36a_a9c0afa053be4b3dae5d8f423decc782.jpg", colourHex: "#F1C40F", colourName: "Yellow", buyUrl: "https://www.myntra.com/kurta-sets/omicron+fab/omicron-fab-women-ethnic-motifs-embroidered-regular-thread-work-pure-silk-kurta-with-palazzos--with-dupatta/41685881/buy" },
  { id: 1267, category: "Traditional", gender: 'Women', name: "HERE&NOW Embroidered Kurta with Trousers", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/24/8c5YtpAH_28e5921197dd4458bf0df3698225763b.jpg", colourHex: "#F1C40F", colourName: "Yellow", buyUrl: "https://www.myntra.com/kurta-sets/here%26now/herenow-women-embroidered-regular-kurta-with-trousers--with-dupatta/40870078/buy" },
  { id: 1277, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Ethnic Motifs Georgette A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/QZuLSxA4_6ec61faadf2b42e5bcf584cc6767c540.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-ethnic-motifs-georgette-a-line-maxi-dress/40091236/buy" },
  { id: 1278, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/16/vmlObCxG_d9ae955c215148feb276b89b4deaeb87.jpg", colourHex: "#FFFFFF", colourName: "White", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40071558/buy" },
  { id: 1279, category: "Traditional", gender: 'Women', name: "ANVERI TEXTILES Ethnic Motifs Embroidered Satin Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/1/BoN2JyVb_f8fe1ce146ff412998f05bf18a21abe8.jpg", colourHex: "#F1C40F", colourName: "Yellow", buyUrl: "https://www.myntra.com/dresses/anveri+textiles/anveri-textiles-ethnic-motifs-embroidered-satin-maxi-dress/42730585/buy" },
  { id: 1280, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/3F2yOzIe_d80c908831a7405380b186fe2b7606e9.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-dress/40091222/buy" },
  { id: 1281, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/19/c5ZDTH1P_eef12013c77141af8d00a15c9f244dc0.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-dress/40091254/buy" },
  { id: 1282, category: "Traditional", gender: 'Women', name: "EVANIK Ethnic Motifs Embroidered A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/26/RpaRxTAT_86a5f83098ba4a97855ef25bd8271f4f.jpg", colourHex: "#6B0F1A", colourName: "Maroon", buyUrl: "https://www.myntra.com/dresses/evanik/evanik-ethnic-motifs-embroidered-a-line-maxi-dress/40354501/buy" },
  { id: 1283, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/19/sz9pVTfG_d2485732e65f4eb6b6e6c396c529c8e0.jpg", colourHex: "#2E8B57", colourName: "Sea Green", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-dress/40091224/buy" },
  { id: 1284, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MAY/19/MspGed1B_6e7ebb2d78f54d86b8d44ae8053a8d65.jpg", colourHex: "#008080", colourName: "Teal", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-dress/40091225/buy" },
  { id: 1285, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/18RZGCTG_7842fb0ad07c479fadd5909bfd4c517e.jpg", colourHex: "#27AE60", colourName: "Green", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-dress/40091250/buy" },
  { id: 1286, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/2/rNWu6ZUL_c74c71cff61244959feb528543196c29.jpg", colourHex: "#F5F1E8", colourName: "Off White", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-dress/40091238/buy" },
  { id: 1287, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/24/A8Cotxhf_80d2b129c2a04a47a77a73242551502f.jpg", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40091255/buy" },
  { id: 1288, category: "Traditional", gender: 'Women', name: "Purple Ethnic Embroidered Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/24/CyCA3f1t_cc68662e625845f8b7c798204972c5fc.jpg", colourHex: "#581845", colourName: "Purple", buyUrl: "https://www.myntra.com/dresses/rudraprayag/purple-ethnic-embroidered-maxi-dress/40091246/buy" },
  { id: 1289, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/7hpgPqdm_7d101dd3d0204369b19bec3a800e3d44.jpg", colourHex: "#181818", colourName: "Black", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40091239/buy" },
  { id: 1290, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/2/deZmGj1n_4e2f5071527f42cdbfc31a9b81849cb4.jpg", colourHex: "#181818", colourName: "Black", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-dress/40091243/buy" },
  { id: 1291, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/B6VC27zj_663c3c5a88fa459b8e7f51cd3e36114c.jpg", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40091230/buy" },
  { id: 1292, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/ynoLpE8R_f398023c68234e9e9759834de801522d.jpg", colourHex: "#181818", colourName: "Black", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40091233/buy" },
  { id: 1293, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/y5MYID4s_c758ec2ee297498eac5a747ee54b0b53.jpg", colourHex: "#F1C40F", colourName: "Yellow", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40091436/buy" },
  { id: 1294, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Fit & Flare Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/2/OF02nOGB_4099c695a7e243c4937e4ea86ea9c9b6.jpg", colourHex: "#FFDAB9", colourName: "Peach", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-fit--flare-maxi-dress/40071562/buy" },
  { id: 1295, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/FEBRUARY/17/LfyoTMbq_5db42c205cdd405a8fc6cf648c1c5c89.jpg", colourHex: "#F8BBD0", colourName: "Pink", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40091445/buy" },
  { id: 1296, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette A-Line Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/10/2OticWS7_64b21063efbe4055a80497f93dd4809a.jpg", colourHex: "#1B2A5B", colourName: "Navy Blue", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-a-line-maxi-dress/40071559/buy" },
  { id: 1297, category: "Traditional", gender: 'Women', name: "RUDRAPRAYAG Floral Embroidered Georgette Maxi Dress", img: "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/JUNE/2/LNly6VJr_4fc1bb3f90a5431fa84ab51195a463f2.jpg", colourHex: "#2AA198", colourName: "Turquoise Blue", buyUrl: "https://www.myntra.com/dresses/rudraprayag/rudraprayag-floral-embroidered-georgette-maxi-dress/40071568/buy" },
  // Women Suit
  { id: 901, category: "Suit", gender: 'Women', name: "Kurti Palazzo Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Lipika-02.jpg?width=600", colourHex: "#7F8C8D", colourName: "Ash Grey", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 902, category: "Suit", gender: 'Women', name: "Straight Salwar Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Antra_min_4.jpg?width=600", colourHex: "#D35400", colourName: "Terracotta", buyUrl: "https://www.myntra.com/women/ethnic-wear/salwar-kameez" },
  { id: 903, category: "Suit", gender: 'Women', name: "Embroidered Punjabi Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Vishwa_1.jpg?width=600", colourHex: "#2980B9", colourName: "Royal Blue", buyUrl: "https://www.myntra.com/women/ethnic-wear/salwar-kameez" },
  { id: 904, category: "Suit", gender: 'Women', name: "Printed Salwar Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Basude-01.jpg?width=600", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women/ethnic-wear/salwar-kameez" },
  { id: 905, category: "Suit", gender: 'Women', name: "Cotton Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0005_f5d34150-26f1-4bab-99fe-adbd6b0d87dd.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 906, category: "Suit", gender: 'Women', name: "Printed Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Mishka_5.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 907, category: "Suit", gender: 'Women', name: "Casual Sharara Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/02Artboard_1_copy_5.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/sharara" },
  { id: 908, category: "Suit", gender: 'Women', name: "Linen Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC08506.jpg?width=600", colourHex: "#F5F1E8", colourName: "Natural Linen", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 909, category: "Suit", gender: 'Women', name: "Straight Pant Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/1_3_d944a1e0-b4a1-409d-bff4-992c8b6dd967.jpg?width=600", colourHex: "#8E44AD", colourName: "Violet", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 910, category: "Suit", gender: 'Women', name: "Cigarette Pant Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0005_e3c970f2-05aa-4aa2-a038-a96ab472273b.jpg?width=600", colourHex: "#7F8C8D", colourName: "Ash Grey", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 911, category: "Suit", gender: 'Women', name: "Office Palazzo Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/tulsiArtboard_1_copy_5.jpg?width=600", colourHex: "#27AE60", colourName: "Emerald", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 912, category: "Suit", gender: 'Women', name: "Formal Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/POshak_Kurta_set_BK1304N-1_1.jpg?width=600", colourHex: "#16A085", colourName: "Teal", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 913, category: "Suit", gender: 'Women', name: "Printed Straight Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Rushika-01.jpg?width=600", colourHex: "#BDC3C7", colourName: "Pewter Grey", buyUrl: "https://www.myntra.com/women/ethnic-wear/salwar-kameez" },
  { id: 914, category: "Suit", gender: 'Women', name: "Printed Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Zaribaag_2.jpg?width=600", colourHex: "#16A085", colourName: "Teal", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 915, category: "Suit", gender: 'Women', name: "Casual Sharara Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC03259.jpg?width=600", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women/ethnic-wear/sharara" },
  { id: 916, category: "Suit", gender: 'Women', name: "Short Kurta Palazzo Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/006_191d6e42-2ff5-4655-a9ba-400051280f0b.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 917, category: "Suit", gender: 'Women', name: "Punjabi Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/03Artboard_1_copy_4.jpg?width=600", colourHex: "#E74C3C", colourName: "Coral", buyUrl: "https://www.myntra.com/women/ethnic-wear/salwar-kameez" },
  { id: 918, category: "Suit", gender: 'Women', name: "Floral Print Co-ord Suit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/KH__0005_27bc49ab-8e27-4cd5-8b62-a09817c784a6.jpg?width=600", colourHex: "#F8BBD0", colourName: "Blush Pink", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 919, category: "Suit", gender: 'Women', name: "Cape Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC08353_e7636014-0b60-482b-9c9a-3c7d94534525.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 920, category: "Suit", gender: 'Women', name: "Dhoti Kurta Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Shurtiblue_6.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 1201, category: "Suit", gender: 'Women', name: "Dusty Pink Fendi Silk Kurta Pant Set", img: "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/6819e142ee263e50e7ed4e79/cat_img/Dusty_Pink_Fendi_Silk_Embroidery_Designer_Kurta_With_Pant___Dupatta_For_Women_4UKYKOEZ8W_2026-01-29_4.png", colourHex: "#C0838A", colourName: "Dusty Pink", buyUrl: "https://shanaya.in/Dusty-Pink-Fendi-Silk-Embroidery-Designer-Kurta-With-Pant-/catalogue/R5RTOKO_/laGH__RM" },
  { id: 1202, category: "Suit", gender: 'Women', name: "Black Fendi Silk Kurta Pant Set", img: "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/6819e142ee263e50e7ed4e79/cat_img/244O_T0A_739YFN57BJ_2026-05-21_2.png", colourHex: "#1A1A1A", colourName: "Black", buyUrl: "https://shanaya.in/Black-Fendi-Silk-Embroidery-Designer-Kurta-With-Pant--/catalogue/244O_T0A/yAKifDyl" },
  { id: 1203, category: "Suit", gender: 'Women', name: "Blush Pink Chinon Kurta Pant Set", img: "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/6819e142ee263e50e7ed4e79/cat_img/Blush_Pink_Printed_Chinon_Kurta_With_Sequence_Embroidery_Pant___Dupatta_For_Women_MYBJI63QV2_2026-01-23_1.jpg", colourHex: "#E8B4B8", colourName: "Blush Pink", buyUrl: "https://shanaya.in/Blush-Pink-Printed-Chinon-Kurta-With-Sequence-Embroidery-Pant-/catalogue/JTsRQ1Jm/yMW5EhDl" },
  { id: 1204, category: "Suit", gender: 'Women', name: "Sky Blue Georgette Kurta Palazzo Set", img: "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/6819e142ee263e50e7ed4e79/cat_img/4vnDKQmf_2S0GOJB78X_2026-02-24_1.png", colourHex: "#87CEEB", colourName: "Sky Blue", buyUrl: "https://shanaya.in/Sky-Blue-Georgette-Embroidery-Kurta-Palazzo-Set-With-Dupatta-For/catalogue/4vnDKQmf/lAOcxFnp" },
  { id: 1205, category: "Suit", gender: 'Women', name: "Soft Beige Georgette Kurta Palazzo Set", img: "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/6819e142ee263e50e7ed4e79/cat_img/YYwcZgkj_0BTDZPOHRR_2026-02-25_1.png", colourHex: "#BFAFA0", colourName: "Soft Beige", buyUrl: "https://shanaya.in/Soft-Beige-Georgette-Embroidery-Kurta-Palazzo-Set-With-Dupatta-For/catalogue/YYwcZgkj/pjo8g1wS" },
  { id: 1206, category: "Suit", gender: 'Women', name: "White Georgette Kurta Palazzo Set", img: "https://d1311wbk6unapo.cloudfront.net/NushopCatalogue/6819e142ee263e50e7ed4e79/cat_img/1IOMqO02_6X7MLTNQ7Y_2026-02-25_1.png", colourHex: "#F5F1E8", colourName: "Ivory White", buyUrl: "https://shanaya.in/White-Georgette-Embroidery-Kurta-Palazzo-Set-With-Dupatta-For-Women/catalogue/1IOMqO02/YY3FI5_B" },
  // Women Gowns (moved from Party)
  { id: 601, category: "Suit", gender: 'Women', name: "Black Sequin Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Vinitha4.jpg?width=600", colourHex: "#1A1A1A", colourName: "Onyx Black", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 602, category: "Suit", gender: 'Women', name: "Sequin Bodycon Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Auralika_4.jpg?width=600", colourHex: "#1A237E", colourName: "Sapphire Blue", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 603, category: "Suit", gender: 'Women', name: "Sequin Maxi Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/MistBloom.jpg_6.jpg?width=600", colourHex: "#C19A6B", colourName: "Champagne", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 604, category: "Suit", gender: 'Women', name: "Embellished Shimmer Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Prizam_1.jpg?width=600", colourHex: "#BDC3C7", colourName: "Silver", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 605, category: "Suit", gender: 'Women', name: "Sequin Column Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Mirunika_1.jpg?width=600", colourHex: "#7F8C8D", colourName: "Silver Grey", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 606, category: "Suit", gender: 'Women', name: "Satin Slit Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/006_9b2d1340-08c8-4e44-bcb7-a6eff5f7d718.jpg?width=600", colourHex: "#C0392B", colourName: "Crimson", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 607, category: "Suit", gender: 'Women', name: "Sequin Bodice Party Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/tasviArtboard_1_copy_6.jpg?width=600", colourHex: "#1A1A1A", colourName: "Jet Black", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 608, category: "Suit", gender: 'Women', name: "Off-Shoulder Sequin Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/005_afcddb97-eb60-4786-9e81-de1b85f0d7aa.jpg?width=600", colourHex: "#808000", colourName: "Olive Sequin", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 609, category: "Suit", gender: 'Women', name: "Halter Neck Maxi Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Nainika-02.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 610, category: "Suit", gender: 'Women', name: "Backless Sequin Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC01382.jpg?width=600", colourHex: "#B76E79", colourName: "Rose Gold", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 611, category: "Suit", gender: 'Women', name: "Embellished Ball Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC01598.jpg?width=600", colourHex: "#D4AC0D", colourName: "Antique Gold", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 612, category: "Suit", gender: 'Women', name: "Floral Tulle Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC01418_fc2d060f-62a1-479d-9dd7-ab81e2985456.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 613, category: "Suit", gender: 'Women', name: "Metallic Shimmer Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/DSC01742.jpg?width=600", colourHex: "#34495E", colourName: "Gunmetal", buyUrl: "https://www.myntra.com/party-dresses" },
  { id: 615, category: "Suit", gender: 'Women', name: "Party Sharara Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/kaaynaArtboard_1_copy_2.jpg?width=600", colourHex: "#FFFFFF", colourName: "Pure White", buyUrl: "https://www.myntra.com/women/ethnic-wear/sharara" },
  { id: 616, category: "Suit", gender: 'Women', name: "Sequin Co-ord Set", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/04Artboard_1_copy_4.jpg?width=600", colourHex: "#ECF0F1", colourName: "Ivory", buyUrl: "https://www.myntra.com/women/ethnic-wear/kurtas-kurtis" },
  { id: 617, category: "Suit", gender: 'Women', name: "Party Jumpsuit", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Cindrella_Blush.jpg?width=600", colourHex: "#2C3E50", colourName: "Midnight", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 618, category: "Suit", gender: 'Women', name: "Velvet Party Dress", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/lavander_moonligthArtboard_1_copy_4.jpg?width=600", colourHex: "#581845", colourName: "Wine Velvet", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  { id: 620, category: "Suit", gender: 'Women', name: "Cape Style Gown", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/umapattu_2_7b761f06-590e-4eed-aacc-073739fcc596.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/indo-western" },
  // Women Lehenga
  { id: 1001, category: "Lehenga", gender: 'Women', name: "Embroidered Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Urja2.jpg?width=600", colourHex: "#D4AC0D", colourName: "Marigold Gold", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1002, category: "Lehenga", gender: 'Women', name: "Metallic Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/009_2c297489-2e47-4591-a1d2-53b409e627f9.jpg?width=600", colourHex: "#BDC3C7", colourName: "Metallic Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1003, category: "Lehenga", gender: 'Women', name: "Traditional Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy_d5d5c08b-bbcf-4d3b-916f-985b2471979a.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1004, category: "Lehenga", gender: 'Women', name: "Chaniya Choli", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Chestha_1.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1005, category: "Lehenga", gender: 'Women', name: "Embroidered Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Urja2.jpg?width=600", colourHex: "#D4AC0D", colourName: "Marigold Gold", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1006, category: "Lehenga", gender: 'Women', name: "Metallic Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/009_2c297489-2e47-4591-a1d2-53b409e627f9.jpg?width=600", colourHex: "#BDC3C7", colourName: "Metallic Pewter", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1007, category: "Lehenga", gender: 'Women', name: "Traditional Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Artboard1copy_d5d5c08b-bbcf-4d3b-916f-985b2471979a.jpg?width=600", colourHex: "#581845", colourName: "Plum", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1008, category: "Lehenga", gender: 'Women', name: "Chaniya Choli", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Chestha_1.jpg?width=600", colourHex: "#C19A6B", colourName: "Sand", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 1009, category: "Lehenga", gender: 'Women', name: "Testing Dress Midi", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Sheetal28thJul73151_2_70566557-39dc-4039-8e4e-c35061d100c5.webp?v=1786198467", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/golden-lehenga" },
  { id: 1010, category: "Lehenga", gender: 'Women', name: "Paridhaan | Purple and Red Wedding Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/paridhhan_2.jpg?v=1784978260", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/paridhaan-purple-wedding-lehenga" },
  { id: 1011, category: "Lehenga", gender: 'Women', name: "Gauri Kanak | Golden Tissue Kalamkari Festive Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/gauri_kanak_3_59ce9bf8-1c24-418c-86cd-cac441074970.jpg?v=1784978131", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/gauri-kanak-golden-festive-lehenga" },
  { id: 1012, category: "Lehenga", gender: 'Women', name: "Nilkanth Mrig |Purple Silk Pashmina Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Nilkanth_Mrig_2_9530a147-3467-4fda-b71a-75d41358c6c4.jpg?v=1785871009", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/nilkanth-mrig-purple-silk-lehenga" },
  { id: 1013, category: "Lehenga", gender: 'Women', name: "Vrindavan | Golden Tissu kalamkari Traditional Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/varidanvan.jpg?v=1784978881", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/vrindavan-golden-traditional-lehenga" },
  { id: 1014, category: "Lehenga", gender: 'Women', name: "Zardozi Leher | Blue Silk Gadval Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/zardosi_leher_6.jpg?v=1784978594", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/zardozi-leher-blue-silk-lehenga" },
  { id: 1015, category: "Lehenga", gender: 'Women', name: "Dhoop Chhaon | Wine and Onion Silk Gadval Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/dhoop_chhao_5_ef05f78c-e9c6-4a29-8051-0d7840cc8bf9.jpg?v=1784978412", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/dhoop-chhaon-wine-silk-lehenga" },
  { id: 1016, category: "Lehenga", gender: 'Women', name: "Swarnamayi | Golden Kanjivaram Silk Lehenga for Weddings", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/swarnamayi_5.webp?v=1782887637", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/swarnamayi-golden-kanjivaram-silk-lehenga-for-weddings" },
  { id: 1017, category: "Lehenga", gender: 'Women', name: "Can Can Skirt + Hemanjali Banarasi Silk Lehenga Bundle", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Hemanjali_a2afe3b1-5b99-4c8e-af9f-09fad6cdf1c0.jpg?v=1779359848", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/can-can-skirt-hemanjali-banarasi-silk-lehenga-set-in-golden-for-festive-elegance" },
  { id: 1018, category: "Lehenga", gender: 'Women', name: "Can Can Skirt + Latika Bridal Lehenga Bundle Savings", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Latika.jpg?v=1779359849", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/can-can-skirt-latika-bridal-pink-lehenga-set-in-shimmar-net" },
  { id: 1019, category: "Lehenga", gender: 'Women', name: "Can Can Skirt and Lajja Lehenga Bundle for Women", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Lajja.jpg?v=1779359849", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/can-can-skirt-lajja-russian-maroon-lehenga-set-elegant-ethnic-wear" },
  { id: 1020, category: "Lehenga", gender: 'Women', name: "Can Can Skirt + Chestha Lehenga Bundle for Elegant Ethnic Wear", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Chestha.jpg?v=1779359848", colourHex: "#C0392B", colourName: "Peacock Red", buyUrl: "https://bullionknot.com/products/can-can-skirt-chestha-tissue-zari-purple-lehenga-set-elegant-ethnic-wear" },
  // Women Party Lehengas (moved from Party)
  { id: 614, category: "Lehenga", gender: 'Women', name: "Sequin Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/rooprekha_5.jpg?width=600", colourHex: "#1A237E", colourName: "Indigo", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
  { id: 619, category: "Lehenga", gender: 'Women', name: "Party Lehenga", img: "https://cdn.shopify.com/s/files/1/0630/4628/7536/files/Rudhira_1.jpg?width=600", colourHex: "#900C3F", colourName: "Maroon", buyUrl: "https://www.myntra.com/women/ethnic-wear/lehenga-choli" },
];

interface TemplateItem { id: string; title: string; thumb: string; }

const tabs: { id: Mode; label: string }[] = [
  { id: 'outfits', label: 'Outfits' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'hair', label: 'Hair' },
];

export default function TryOn() {
  const referenceImageUrl = useStyleStore((s) => s.referenceImageUrl);
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const addWardrobeItem = useStyleStore((s) => s.addWardrobeItem);
  const { clothes, makeup, hair } = useTryOn();
  const [, setLocation] = useLocation();

  // Try-on renders onto the analysed photo, so it is only meaningful once the
  // colour analysis has run. Both halves are persisted, and a reference photo
  // can be set without an analysis, so the page checks for both.
  const hasAnalysis = Boolean(referenceImageUrl && analysisResult);

  const [mode, setMode] = useState<Mode>('outfits');
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>('Everyday');
  const [genderFilter, setGenderFilter] = useState<Gender>('All');
  const [selected, setSelected] = useState<Selected | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const categoryScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCategories = (dir: 1 | -1) => {
    categoryScrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  const selectedGarment = useMemo(() => {
    if (!selected || selected.kind !== 'outfit') return null;
    return garments.find((g) => String(g.id) === selected.id) ?? null;
  }, [selected]);

  // Hair and makeup come from the curated list in lib/tryon-styles, not from
  // YouCam's template endpoint: the provider's own catalogue is mostly novelty
  // looks (face paint, flags, rainbow dye) that have no place here.
  const styleItems = useMemo(() => {
    const source = mode === 'hair' ? INDIAN_HAIR_STYLES : INDIAN_MAKEUP_LOOKS;
    return genderFilter === 'All' ? source : source.filter((s) => s.gender === genderFilter);
  }, [mode, genderFilter]);

  const palette = useMemo(() => {
    if (!analysisResult) return [];
    return getSeasonInfo(analysisResult.colourSeason, analysisResult.colorProfile.undertone).palette;
  }, [analysisResult]);

  const filteredByCategory = garments.filter(
    (g) => g.category === activeCategory && (genderFilter === 'All' || g.gender === genderFilter)
  );

  const isPending = clothes.isPending || makeup.isPending || hair.isPending;

  const handleSelect = (item: Selected) => {
    setSelected(item);
    setResultUrl(null);
    setIsFallback(false);
  };

  const handleTryOn = () => {
    if (!selected) return;
    // Reached without an analysis (a stale reference photo, or a direct link
    // into the page) — send them to run one rather than rendering the garment
    // onto a stand-in photo that is not theirs.
    if (!hasAnalysis || !referenceImageUrl) {
      setLocation(ROUTES.upload);
      return;
    }
    setResultUrl(null);
    setIsFallback(false);
    const refUrl = referenceImageUrl;
    if (selected.kind === 'outfit') {
      // Bundled garments are sent as their app-relative path so the server can
      // read them off disk â€” prefixing the origin would hand the try-on provider
      // a URL it cannot reach.
      clothes.mutate(
        { garmentUrl: selected.img, garmentName: selected.name, garmentImg: selected.img, colourHex: selected.colourHex, personImageUrl: refUrl },
        {
          onSuccess: (r) => {
            setResultUrl(r.data.resultUrl);
            setIsFallback(r.data.source === 'fallback');
          },
          onError: () => {
            setResultUrl(selected.img);
            setIsFallback(true);
          },
        },
      );
    } else if (selected.kind === 'look') {
      makeup.mutate({ productId: selected.id, productName: selected.name, productThumb: selected.img }, {
        onSuccess: (r) => {
          setResultUrl(r.data.resultUrl);
          setIsFallback(r.data.source === 'fallback');
        },
        onError: () => {
          setResultUrl(refUrl);
          setIsFallback(true);
        },
      });
    } else {
      hair.mutate({ styleId: selected.id, styleName: selected.name, styleThumb: selected.img }, {
        onSuccess: (r) => {
          setResultUrl(r.data.resultUrl);
          setIsFallback(r.data.source === 'fallback');
        },
        onError: () => {
          setResultUrl(refUrl);
          setIsFallback(true);
        },
      });
    }
  };

  const handleAddToWardrobe = () => {
    if (selected?.kind !== 'outfit' || !resultUrl) return;
    addWardrobeItem({
      id: `look-${selected.id}-${Date.now()}`,
      imageUrl: resultUrl,
      name: selected.name,
      category: 'Virtual Try-On',
      palette: selected.colourHex ? [selected.colourHex] : [],
      styleTags: [],
      addedAt: new Date().toISOString(),
    });
    success('Saved to your dashboard');
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    const name = (selected?.name ?? 'tryon-result').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const res = await fetch(resultUrl, { mode: 'cors' });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tryon-${name}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, '_blank');
    }
  };

  const ctaLabel = isPending
    ? selected?.kind === 'look' ? 'Applyingâ€¦' : 'Trying Onâ€¦'
    : resultUrl ? 'Try Again'
      : selected?.kind === 'look' ? 'Apply This Look'
        : selected?.kind === 'hair' ? 'Try This Hairstyle'
          : 'Try On This Outfit';

  return (
    <div className="w-full pb-24">
      {/* â”€â”€ Hero â€” full-bleed campaign background like Home page â”€â”€ */}
      <CampaignSection
        src={CAMPAIGN.archetype.base}
        alt={CAMPAIGN.archetype.alt}
        position={CAMPAIGN.archetype.position}
        anchor="bottom-left"
        height="tall"
        scrim="left"
        priority
        cinematicIntensity={0.95}
        fadeEdges
        className="min-h-[min(88svh,52rem)]"
        contentPadding="pb-24 md:pb-32 lg:pb-40"
      >
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* Left: copy */}
          <div className="max-w-[38rem]">
            <Reveal variant="fade">
              <EyebrowLabel tone="gold" rule>Virtual Try-On</EyebrowLabel>
            </Reveal>
            <motion.div
              initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
              animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="mt-5 will-change-[clip-path]"
            >
              <EditorialHeading as="h1" size="xl" className="text-cream-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                See Your Colours, <Emphasis>On You.</Emphasis>
              </EditorialHeading>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-5 max-w-[44ch] text-lede font-light text-cream-primary/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
            >
              Select a category, pick any outfit, and watch it appear on your photo â€” powered by AI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {GARMENT_CATEGORIES.map((cat) => (
                <span key={cat} className="rounded-sm border border-gold-hairline bg-surface-0/75 px-3 py-1 eyebrow-micro text-gold-primary backdrop-blur-sm">
                  {cat}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: before/after slider â€” same model, dress changed */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <BeforeAfterSlider
                beforeSrc="https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=500"
                afterColour="#1E3A5F"
                beforeLabel="Original"
                afterLabel="With Outfit"
                className="h-[26rem] w-72 shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold-hairline bg-surface-0/90 px-4 py-1.5 text-[0.6rem] uppercase tracking-widest text-gold-primary backdrop-blur-sm"
              >
                â† drag to compare â†’
              </motion.div>
            </div>
          </motion.div>
        </div>
      </CampaignSection>

      <EditorialContainer width="content" className="pt-2 max-w-[1440px] px-2 sm:px-4 lg:px-6 mx-auto">

        {!hasAnalysis ? (
          <div className="mx-auto mt-14 w-full max-w-xl border border-gold-hairline bg-surface-3 p-8 text-center">
            <span aria-hidden className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-surface-4 text-gold-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-serif text-[length:var(--text-h5)] text-cream-primary">Run your colour analysis first</h2>
            <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
              Virtual try-on renders onto your analysed photo. Upload a selfie and
              analyse it once — then every garment, look and hairstyle here is yours to try.
            </p>
            <Link href={ROUTES.upload} className="mt-8 inline-block">
              <Button size="lg">Analyse My Colours</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mode tabs */}
            <div className="mt-2 border-b border-gold-hairline w-full">
              <div role="tablist" aria-label="Try-on category" className="flex gap-0 justify-start">
                {tabs.map((tab) => (
                  <button key={tab.id} type="button" role="tab" aria-selected={mode === tab.id}
                    onClick={() => { setMode(tab.id); setSelected(null); setResultUrl(null); }}
                    className={cn('eyebrow relative px-5 py-2.5 text-xs transition-colors duration-200',
                      mode === tab.id ? 'text-cream-primary font-medium' : 'text-cream-primary/55 hover:text-cream-primary')}
                  >
                    {tab.label}
                    {mode === tab.id && (
                      <motion.div layoutId="tab-indicator" className="absolute inset-x-0 bottom-0 h-[2px] bg-gold-primary"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2.5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_350px] lg:items-start w-full"
            >
              {/* Left â€” options (Exactly 3 columns per row) */}
              <section className="w-full">
                {/* Gender Filter sub-tabs: ALL | WOMEN | MEN — applies to every mode */}
                <div className="mb-2 flex items-center gap-1.5 justify-start">
                  <span className="text-[0.58rem] font-medium uppercase tracking-wider text-cream-primary/50 shrink-0">
                    Gender:
                  </span>
                  {(['All', 'Women', 'Men'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => { setGenderFilter(g); setSelected(null); setResultUrl(null); }}
                      className={cn(
                        'inline-flex h-6 items-center rounded-sm border px-2.5 text-[0.58rem] font-semibold uppercase tracking-wider transition-all duration-200 shrink-0',
                        genderFilter === g
                          ? 'border-gold-primary bg-gold-primary text-surface-0 shadow-sm'
                          : 'border-gold-hairline/60 bg-surface-3/60 text-cream-primary/70 hover:border-gold-primary/60 hover:text-cream-primary'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {mode === 'outfits' && (
                  <>
                    {/* Category sub-tabs */}
                    <div className="mb-3 flex items-center gap-1 justify-start">
                      <button type="button" onClick={() => scrollCategories(-1)} aria-label="Scroll categories left"
                        className="h-7 w-6 shrink-0 flex items-center justify-center rounded-sm border border-gold-hairline bg-surface-3 text-cream-primary/70 transition-colors hover:border-gold-primary hover:text-cream-primary">
                        <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <div ref={categoryScrollRef} className="scrollbar-none overflow-x-auto overscroll-x-contain flex-1">
                        <div role="group" aria-label="Garment categories" className="flex w-max gap-1 pb-0.5 justify-start">
                          {GARMENT_CATEGORIES.map((cat) => (
                            <button key={cat} type="button"
                              onClick={() => { setActiveCategory(cat); setSelected(null); setResultUrl(null); }}
                              className={cn('inline-flex h-7 items-center rounded-sm border px-2.5 text-[0.62rem] font-medium uppercase tracking-wider transition-colors duration-200 shrink-0',
                                activeCategory === cat
                                  ? 'border-gold-primary bg-gold-primary text-surface-0 font-semibold'
                                  : 'border-gold-hairline bg-surface-3 text-cream-primary/70 hover:border-gold-primary hover:text-cream-primary')}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => scrollCategories(1)} aria-label="Scroll categories right"
                        className="h-7 w-6 shrink-0 flex items-center justify-center rounded-sm border border-gold-hairline bg-surface-3 text-cream-primary/70 transition-colors hover:border-gold-primary hover:text-cream-primary">
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>

                    {/* Garment grid (Exactly 3 Columns per row) */}
                    <motion.div
                      key={activeCategory}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
                      initial="hidden" animate="visible"
                    >
                      {filteredByCategory.map((garment) => {
                        const isSelected = selected?.id === String(garment.id);
                        return (
                          <motion.div key={garment.id}
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
                          >
                            <button type="button"
                              onClick={() => handleSelect({ kind: 'outfit', id: String(garment.id), name: garment.name, img: garment.img, colourName: garment.colourName, colourHex: garment.colourHex })}
                              aria-pressed={isSelected}
                              className={cn('group w-full overflow-hidden border text-left transition-all duration-300 rounded-sm',
                                isSelected ? 'border-gold-primary bg-surface-1 shadow-[0_0_10px_rgba(201,168,76,0.2)]' : 'border-gold-hairline/60 bg-surface-1/40 hover:border-gold-primary/60')}
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden border-b border-gold-hairline/40 bg-surface-2">
                                <img src={garment.img} srcSet={srcsetFromUrl(garment.img, [300, 600])}
                                  sizes="(min-width:1024px) 18vw, 36vw" alt={garment.name}
                                  width={300} height={400} loading="lazy"
                                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                              <div className="p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className="h-1.5 w-1.5 rounded-full border border-gold-hairline/40 shrink-0"
                                    style={{ backgroundColor: garment.colourHex }} />
                                  <p className="text-[0.52rem] uppercase tracking-wider text-cream-primary/45 truncate">{garment.colourName}</p>
                                </div>
                                <p className="text-[0.72rem] font-light text-cream-primary leading-tight line-clamp-1">{garment.name}</p>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </>
                )}

                {mode !== 'outfits' && (
                  <TemplateGrid
                    items={styleItems}
                    selectedId={selected?.id ?? null}
                    onSelect={(item) => handleSelect({ kind: mode === 'makeup' ? 'look' : 'hair', id: item.id, name: item.title, img: item.thumb })}
                  />
                )}
              </section>

              {/* Right â€” studio (Shifted Upwards so Buttons never cut off) */}
              <section className="lg:sticky lg:top-14 w-full max-w-[350px] mx-auto lg:mx-0">
                <div>
                  {selected ? (
                    <>
                      {/* Result: Pure BeforeAfter Slider view when try-on result available */}
                      {resultUrl && !isFallback ? (
                        <div>
                          <p className="text-[0.52rem] uppercase tracking-wider text-cream-primary/55 mb-1">
                            Drag to compare
                          </p>
                          <div className="relative aspect-[3/4] max-h-[470px] w-full overflow-hidden border border-gold-hairline rounded-sm shadow-md mx-auto">
                            <BeforeAfterSlider
                              beforeSrc={assetUrl(referenceImageUrl)}
                              afterSrc={resultUrl}
                              afterColour={selected.colourHex}
                              beforeLabel="You"
                              afterLabel="Try-On"
                              className="h-full w-full"
                            />

                            {/* Top-Right 3-Dots Dropdown Menu */}
                            <div ref={menuRef} className="absolute top-2.5 right-2.5 z-30">
                              <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-hairline bg-surface-0/85 text-cream-primary backdrop-blur-md transition-all hover:bg-gold-primary hover:text-surface-0 hover:border-gold-primary active:scale-95 shadow-lg"
                                title="More options"
                                aria-label="More options"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <AnimatePresence>
                                {menuOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="absolute right-0 top-10 z-40 min-w-[190px] overflow-hidden rounded-md border border-gold-hairline bg-surface-1/95 p-1 shadow-2xl backdrop-blur-md"
                                  >
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleDownload();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Download className="h-4 w-4 text-gold-primary" />
                                      <span>Download</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleAddToWardrobe();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Bookmark className="h-4 w-4 text-gold-primary" />
                                      <span>Add to Saved Looks</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="relative aspect-[3/4] max-h-[470px] w-full overflow-hidden border border-gold-hairline rounded-sm shadow-md mx-auto">
                            <AnimatePresence mode="wait">
                              <motion.img key={resultUrl ?? selected.img}
                                src={resultUrl ?? selected.img}
                                alt={resultUrl ? `Try-on: ${selected.name}` : selected.name}
                                width={480} height={640}
                                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                onError={(e) => {
                                  if (selected?.img && e.currentTarget.src !== selected.img) {
                                    e.currentTarget.src = selected.img;
                                  }
                                }}
                              />
                            </AnimatePresence>
                            {isFallback && resultUrl && selected.colourHex && (
                              <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply"
                                style={{ backgroundColor: selected.colourHex, opacity: 0.4 }} />
                            )}

                            {/* Top-Right 3-Dots Dropdown Menu */}
                            <div ref={menuRef} className="absolute top-2.5 right-2.5 z-30">
                              <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-hairline bg-surface-0/85 text-cream-primary backdrop-blur-md transition-all hover:bg-gold-primary hover:text-surface-0 hover:border-gold-primary active:scale-95 shadow-lg"
                                title="More options"
                                aria-label="More options"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <AnimatePresence>
                                {menuOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="absolute right-0 top-10 z-40 min-w-[190px] overflow-hidden rounded-md border border-gold-hairline bg-surface-1/95 p-1 shadow-2xl backdrop-blur-md"
                                  >
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleDownload();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Download className="h-4 w-4 text-gold-primary" />
                                      <span>Download</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleAddToWardrobe();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Bookmark className="h-4 w-4 text-gold-primary" />
                                      <span>Add to Saved Looks</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Buttons Side-by-Side in 1 Row */}
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Button size="sm" onClick={handleTryOn} disabled={isPending} className="h-10 text-[0.6rem] px-1.5">
                          {isPending ? <LoaderCircle className="animate-spin" aria-hidden /> : <RotateCw aria-hidden />}
                          {ctaLabel}
                        </Button>
                        {selectedGarment?.buyUrl && (
                          <a href={selectedGarment.buyUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex h-10 w-full items-center justify-center bg-gold-primary px-2 text-[0.6rem] font-semibold uppercase tracking-wider text-surface-0 transition-all hover:bg-gold-dark hover:text-cream-primary active:scale-[0.98] rounded-sm">
                            Buy on Myntra â†’
                          </a>
                        )}
                      </div>

                      {(clothes.isError || makeup.isError || hair.isError) && !isFallback && (
                        <p className="mt-2 text-[length:var(--text-body-sm)] text-error">The try-on could not be completed. Please try again.</p>
                      )}
                    </>
                  ) : (
                    <div className="py-16 text-center">
                      <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">Select to begin</p>
                      <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
                        Choose a category on the left, then pick an outfit to preview.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          </>
        )}
      </EditorialContainer>
    </div>
  );
}

function TemplateGrid({ items, selectedId, onSelect }: {
  items: TemplateItem[];
  selectedId: string | null;
  onSelect: (item: TemplateItem) => void;
}) {
  return (
    <div>
      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button key={item.id} type="button" onClick={() => onSelect(item)} aria-pressed={isSelected}
              className={cn('group overflow-hidden border text-left transition-all duration-300',
                isSelected ? 'border-gold-primary' : 'border-gold-hairline hover:border-gold-primary/50')}
            >
              <div className="aspect-[4/5] w-full overflow-hidden border-b border-gold-hairline bg-surface-3/40">
                {item.thumb ? (
                  <img src={item.thumb} alt={item.title}
                    width={400} height={500} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface-3">
                    <span className="eyebrow text-gold-primary/40">{item.title}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-serif text-[length:var(--text-body-sm)] font-light text-cream-primary">{item.title}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


