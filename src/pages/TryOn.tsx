import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { success } from '@/lib/toast';
import { Bookmark, Download, LoaderCircle, RotateCw, Scissors, Shirt, Sparkles } from 'lucide-react';
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
import { listTryOnTemplates, assetUrl } from '@/services/api';
import { cn, srcsetFromUrl } from '@/lib/utils';

type Mode = 'outfits' | 'makeup' | 'hair';
type GarmentCategory = 'Dresses' | 'Tops' | 'Bottoms' | 'Outerwear' | 'Ethnic Wear';

interface Garment {
  id: number;
  name: string;
  category: GarmentCategory;
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

const GARMENT_CATEGORIES: GarmentCategory[] = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Ethnic Wear'];

const garments: Garment[] = [
  // ── Dresses — all unique dress photos ────────────────────────────────────
  { id:101, category:'Dresses', name:'Floral Wrap Dress',      img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80', colourHex:'#E8C4A0', colourName:'Peach Blossom', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:102, category:'Dresses', name:'Boho Maxi Dress',        img:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', colourHex:'#8B5E3C', colourName:'Earthy Brown',  buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:103, category:'Dresses', name:'Ruffle Mini Dress',      img:'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80', colourHex:'#E07B7B', colourName:'Coral Red',     buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:104, category:'Dresses', name:'Off-Shoulder Sundress',  img:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80', colourHex:'#F5CBA7', colourName:'Warm Cream',    buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:105, category:'Dresses', name:'Pleated Evening Gown',   img:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80', colourHex:'#5B2C6F', colourName:'Deep Plum',     buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:106, category:'Dresses', name:'Denim Shirt Dress',      img:'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80', colourHex:'#2E86C1', colourName:'Denim Blue',    buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:107, category:'Dresses', name:'Halter Neck Dress',      img:'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&q=80', colourHex:'#7D6678', colourName:'Dusty Mauve',   buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:108, category:'Dresses', name:'A-Line Floral Dress',    img:'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80', colourHex:'#F9E4B7', colourName:'Butter Yellow', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:109, category:'Dresses', name:'Linen Casual Dress',     img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', colourHex:'#D5DBDB', colourName:'Soft Grey',     buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:110, category:'Dresses', name:'Flared Skater Dress',    img:'https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?w=600&q=80', colourHex:'#CB4335', colourName:'Cherry Red',    buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:111, category:'Dresses', name:'Knit Sweater Dress',     img:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', colourHex:'#6E2F00', colourName:'Rust',          buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:112, category:'Dresses', name:'Puff Sleeve Dress',      img:'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80', colourHex:'#FAD7A0', colourName:'Apricot',       buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:113, category:'Dresses', name:'Teal Sleeveless Dress',  img:'https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=600&q=80', colourHex:'#008080', colourName:'Teal',          buyUrl:'https://www.myntra.com/sleeveless-dresses' },
  { id:114, category:'Dresses', name:'Printed Wrap Dress',     img:'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80', colourHex:'#1E8449', colourName:'Forest Green',  buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:115, category:'Dresses', name:'Bodycon Black Dress',    img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', colourHex:'#1A1A1A', colourName:'Jet Black',     buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:116, category:'Dresses', name:'Tiered Boho Dress',      img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', colourHex:'#A9CCE3', colourName:'Sky Blue',      buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:117, category:'Dresses', name:'Satin Slip Dress',       img:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', colourHex:'#C9A2A4', colourName:'Blush Pink',    buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:118, category:'Dresses', name:'Cami Summer Dress',      img:'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80', colourHex:'#F0B27A', colourName:'Amber',         buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:119, category:'Dresses', name:'Blazer Shirt Dress',     img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', colourHex:'#2C3E50', colourName:'Dark Slate',    buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:120, category:'Dresses', name:'Lace Midi Dress',        img:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80', colourHex:'#FDEBD0', colourName:'Ivory',         buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },

  // ── Tops (201-220) — unique top/shirt/blouse photos ─────────────────────
  { id:201, category:'Tops', name:'Classic White Tee',        img:'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80', colourHex:'#FFFFFF', colourName:'Pure White',    buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:202, category:'Tops', name:'Beige Knit Cardigan',      img:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', colourHex:'#D2B48C', colourName:'Warm Tan',      buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:203, category:'Tops', name:'Cream Turtleneck',         img:'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80', colourHex:'#F5F5DC', colourName:'Cream',         buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:204, category:'Tops', name:'Pink Floral Blouse',       img:'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80', colourHex:'#F8BBD0', colourName:'Petal Pink',    buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:205, category:'Tops', name:'Striped Cotton Top',       img:'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=80', colourHex:'#4A90D9', colourName:'Navy Stripe',   buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:206, category:'Tops', name:'Tie-Front Crop Top',       img:'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=600&q=80', colourHex:'#E8C4A0', colourName:'Peach',         buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:207, category:'Tops', name:'Ribbed Cami Top',          img:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80', colourHex:'#F0E68C', colourName:'Khaki',         buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:208, category:'Tops', name:'Light Blue Oxford Shirt',  img:'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80', colourHex:'#87CEEB', colourName:'Light Blue',    buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:209, category:'Tops', name:'Grey Oversized Hoodie',    img:'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80', colourHex:'#808080', colourName:'Mid Grey',      buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:210, category:'Tops', name:'Graphic Print Tee',        img:'https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=600&q=80', colourHex:'#1A1A1A', colourName:'Black',         buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:211, category:'Tops', name:'Satin Cami Blouse',        img:'https://images.unsplash.com/photo-1594938296094-9be6d5e9e5e9?w=600&q=80', colourHex:'#C9A2A4', colourName:'Dusty Rose',    buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:212, category:'Tops', name:'Blue Denim Shirt',         img:'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80', colourHex:'#6C7A94', colourName:'Denim Blue',    buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:213, category:'Tops', name:'Coral Polo Shirt',         img:'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80', colourHex:'#E07B7B', colourName:'Coral',         buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:214, category:'Tops', name:'Rust Mock Neck Sweater',   img:'https://images.unsplash.com/photo-1614251056216-f748f76cd228?w=600&q=80', colourHex:'#8B4513', colourName:'Rust Brown',    buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:215, category:'Tops', name:'White Linen Shirt',        img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', colourHex:'#F5F5DC', colourName:'Off White',     buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:216, category:'Tops', name:'Black Fitted Crop Top',    img:'https://images.unsplash.com/photo-1512237798647-84b57b22b517?w=600&q=80', colourHex:'#1A1A1A', colourName:'Jet Black',     buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:217, category:'Tops', name:'Ivory Puff Sleeve Top',    img:'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=600&q=80', colourHex:'#FDEBD0', colourName:'Ivory',         buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:218, category:'Tops', name:'Olive Green Shirt',        img:'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=600&q=80', colourHex:'#556B2F', colourName:'Olive Green',   buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:219, category:'Tops', name:'Pink Bardot Top',          img:'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80', colourHex:'#F8BBD0', colourName:'Baby Pink',     buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:220, category:'Tops', name:'Checked Flannel Shirt',    img:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80', colourHex:'#8B4513', colourName:'Flannel Brown',  buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },

  // ── Bottoms (301-320) — unique trouser/jeans/skirt photos ───────────────
  { id:301, category:'Bottoms', name:'Olive Pleated Trousers',    img:'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80', colourHex:'#556B2F', colourName:'Olive',       buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:302, category:'Bottoms', name:'Dark Denim Jeans',          img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', colourHex:'#1A237E', colourName:'Dark Denim',  buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:303, category:'Bottoms', name:'Ivory Wide-Leg Pants',      img:'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&q=80', colourHex:'#F3E7CF', colourName:'Warm Ivory',  buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:304, category:'Bottoms', name:'Caramel Mini Skirt',        img:'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&q=80', colourHex:'#C19A6B', colourName:'Caramel',     buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:305, category:'Bottoms', name:'Khaki Tailored Shorts',     img:'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=80', colourHex:'#C2B280', colourName:'Khaki',       buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:306, category:'Bottoms', name:'Black Palazzo Pants',       img:'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=600&q=80', colourHex:'#1A1A1A', colourName:'Black',       buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:307, category:'Bottoms', name:'Blush Satin Skirt',         img:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', colourHex:'#C9A2A4', colourName:'Blush Pink',  buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:308, category:'Bottoms', name:'Wash-Out Boyfriend Jeans',  img:'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80', colourHex:'#6C7A94', colourName:'Light Blue',  buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:309, category:'Bottoms', name:'White Wide Trousers',       img:'https://images.unsplash.com/photo-1624637542267-9843a7e8e4d5?w=600&q=80', colourHex:'#FFFFFF', colourName:'White',       buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:310, category:'Bottoms', name:'Burgundy Midi Skirt',       img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', colourHex:'#800020', colourName:'Burgundy',    buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:311, category:'Bottoms', name:'Charcoal Joggers',          img:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80', colourHex:'#2C3E50', colourName:'Charcoal',    buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:312, category:'Bottoms', name:'Floral Wrap Skirt',         img:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80', colourHex:'#E07B7B', colourName:'Coral Pink',  buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:313, category:'Bottoms', name:'Navy Cigarette Pants',      img:'https://images.unsplash.com/photo-1551232864-3f0890e1777e?w=600&q=80', colourHex:'#16213E', colourName:'Navy',        buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:314, category:'Bottoms', name:'Beige Linen Trousers',      img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', colourHex:'#D2B48C', colourName:'Beige',       buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:315, category:'Bottoms', name:'Rust Corduroy Pants',       img:'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80', colourHex:'#8B4513', colourName:'Rust',        buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:316, category:'Bottoms', name:'Mauve Pleated Skirt',       img:'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80', colourHex:'#7D6678', colourName:'Mauve',       buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:317, category:'Bottoms', name:'Black Leather Skirt',       img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', colourHex:'#1A1A1A', colourName:'Jet Black',   buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:318, category:'Bottoms', name:'Grey Sweatpants',           img:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80', colourHex:'#808080', colourName:'Grey',        buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:319, category:'Bottoms', name:'Green Cargo Pants',         img:'https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?w=600&q=80', colourHex:'#556B2F', colourName:'Army Green',  buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:320, category:'Bottoms', name:'Camel Paperbag Trousers',   img:'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80', colourHex:'#C19A6B', colourName:'Camel',       buyUrl:'https://www.myntra.com/women/bottomwear' },

  // ── Outerwear (401-420) — unique jacket/coat/blazer photos ─────────────
  { id:401, category:'Outerwear', name:'Camel Linen Blazer',        img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', colourHex:'#C19A6B', colourName:'Camel',        buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:402, category:'Outerwear', name:'Black Leather Jacket',      img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', colourHex:'#1A1A1A', colourName:'Jet Black',     buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:403, category:'Outerwear', name:'Navy Tailored Coat',        img:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80', colourHex:'#16213E', colourName:'Navy',         buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:404, category:'Outerwear', name:'Sage Utility Jacket',       img:'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80', colourHex:'#8A8D7A', colourName:'Sage Green',   buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:405, category:'Outerwear', name:'Green Puffer Parka',        img:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80', colourHex:'#1E8449', colourName:'Forest Green', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:406, category:'Outerwear', name:'Washed Denim Jacket',       img:'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&q=80', colourHex:'#6C7A94', colourName:'Washed Blue',  buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:407, category:'Outerwear', name:'Crimson Red Blazer',        img:'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&q=80', colourHex:'#A4161A', colourName:'Crimson',     buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:408, category:'Outerwear', name:'Brown Bomber Jacket',       img:'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80', colourHex:'#8B4513', colourName:'Saddle Brown', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:409, category:'Outerwear', name:'Tan Belted Trench',         img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', colourHex:'#D2B48C', colourName:'Tan',         buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:410, category:'Outerwear', name:'White Structured Blazer',   img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', colourHex:'#FDEBD0', colourName:'Ivory',       buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:411, category:'Outerwear', name:'Burgundy Wool Coat',        img:'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80', colourHex:'#800020', colourName:'Burgundy',    buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:412, category:'Outerwear', name:'Olive Varsity Jacket',      img:'https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=600&q=80', colourHex:'#556B2F', colourName:'Olive',       buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:413, category:'Outerwear', name:'Grey Peacoat',              img:'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80', colourHex:'#808080', colourName:'Grey',        buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:414, category:'Outerwear', name:'Blush Pink Blazer',         img:'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&q=80', colourHex:'#F8BBD0', colourName:'Blush Pink',  buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:415, category:'Outerwear', name:'Oatmeal Longline Cardigan', img:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', colourHex:'#E8DCC8', colourName:'Oatmeal',     buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:416, category:'Outerwear', name:'Black Puffer Jacket',       img:'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80', colourHex:'#1A1A1A', colourName:'Black',       buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:417, category:'Outerwear', name:'Caramel Faux Fur Coat',     img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', colourHex:'#C19A6B', colourName:'Caramel',     buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:418, category:'Outerwear', name:'Slate Blue Windbreaker',    img:'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&q=80', colourHex:'#6C7A94', colourName:'Slate Blue',  buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:419, category:'Outerwear', name:'Espresso Faux Leather Coat',img:'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80', colourHex:'#2C1810', colourName:'Espresso',   buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:420, category:'Outerwear', name:'Cream Cape Coat',           img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', colourHex:'#F5F5DC', colourName:'Cream',      buyUrl:'https://www.myntra.com/women/jackets-and-coats' },

  // ── Ethnic Wear (501-520) ────────────────────────────────────────────────
  { id:501, category:'Ethnic Wear', name:'Embroidered Anarkali Suit', img:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', colourHex:'#C0392B', colourName:'Royal Red',     buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:502, category:'Ethnic Wear', name:'Printed Saree Blouse Set', img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', colourHex:'#6E2F00', colourName:'Rust Orange',    buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:503, category:'Ethnic Wear', name:'Straight Cut Kurti',       img:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80', colourHex:'#1E8449', colourName:'Emerald',        buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:504, category:'Ethnic Wear', name:'Flared Lehenga Set',       img:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80', colourHex:'#FAD7A0', colourName:'Golden Yellow',  buyUrl:'https://www.myntra.com/women/ethnic-wear/lehnga-choli' },
  { id:505, category:'Ethnic Wear', name:'Block Print Kurta',        img:'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80', colourHex:'#A9CCE3', colourName:'Powder Blue',    buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:506, category:'Ethnic Wear', name:'Palazzo Kurti Co-ord',     img:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80', colourHex:'#5B2C6F', colourName:'Deep Violet',    buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:507, category:'Ethnic Wear', name:'Bandhani Print Dress',     img:'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80', colourHex:'#E07B7B', colourName:'Coral Pink',     buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:508, category:'Ethnic Wear', name:'Sharara Suit',             img:'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&q=80', colourHex:'#7D6678', colourName:'Dusty Rose',     buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:509, category:'Ethnic Wear', name:'Tie-Dye Maxi Kurta',       img:'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80', colourHex:'#2E86C1', colourName:'Indigo',         buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:510, category:'Ethnic Wear', name:'Kalamkari Salwar Suit',    img:'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&q=80', colourHex:'#1B2631', colourName:'Dark Teal',      buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:511, category:'Ethnic Wear', name:'Chanderi Silk Saree',      img:'https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?w=600&q=80', colourHex:'#CB4335', colourName:'Ruby Red',       buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:512, category:'Ethnic Wear', name:'Phulkari Dupatta Set',     img:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', colourHex:'#F0B27A', colourName:'Warm Ochre',     buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:513, category:'Ethnic Wear', name:'Lucknowi Chikankari Kurti',img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', colourHex:'#FDEBD0', colourName:'Ivory White',    buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:514, category:'Ethnic Wear', name:'Festive Lehenga Choli',    img:'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80', colourHex:'#CB4335', colourName:'Scarlet',        buyUrl:'https://www.myntra.com/women/ethnic-wear/lehnga-choli' },
  { id:515, category:'Ethnic Wear', name:'Mirror Work Blouse',       img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', colourHex:'#1E8449', colourName:'Bottle Green',   buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:516, category:'Ethnic Wear', name:'Ikat Print Kurta',         img:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', colourHex:'#8B5E3C', colourName:'Earthy Tan',     buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:517, category:'Ethnic Wear', name:'Silk Patiala Salwar Set',  img:'https://images.unsplash.com/photo-1551232864-3f0890e1777e?w=600&q=80', colourHex:'#FAD7A0', colourName:'Marigold',       buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:518, category:'Ethnic Wear', name:'Cotton A-Line Kurta',      img:'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80', colourHex:'#A9CCE3', colourName:'Soft Blue',      buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:519, category:'Ethnic Wear', name:'Banarasi Silk Saree',      img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', colourHex:'#7D6678', colourName:'Rose Gold',      buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:520, category:'Ethnic Wear', name:'Georgette Anarkali Gown',  img:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80', colourHex:'#5B2C6F', colourName:'Purple',         buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
];

const tabs: { id: Mode; label: string; icon: typeof Shirt }[] = [
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'makeup',  label: 'Makeup',  icon: Sparkles },
  { id: 'hair',    label: 'Hair',    icon: Scissors },
];

interface TemplateItem { id: string; title: string; thumb: string; }

export default function TryOn() {
  const referenceImageUrl  = useStyleStore((s) => s.referenceImageUrl);
  const analysisResult     = useStyleStore((s) => s.analysisResult);
  const addWardrobeItem    = useStyleStore((s) => s.addWardrobeItem);
  const { clothes, makeup, hair } = useTryOn();

  const [mode,           setMode]           = useState<Mode>('outfits');
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>('Dresses');
  const [selected,       setSelected]       = useState<Selected | null>(null);
  const [resultUrl,      setResultUrl]      = useState<string | null>(null);
  const [isFallback,     setIsFallback]     = useState(false);

  const selectedGarment = useMemo(() => {
    if (!selected || selected.kind !== 'outfit') return null;
    return garments.find((g) => String(g.id) === selected.id) ?? null;
  }, [selected]);

  const looksQuery = useQuery({
    queryKey: ['tryon-looks'],
    queryFn: () => listTryOnTemplates('look-vto').then((r) => r.data.items),
  });
  const hairQuery = useQuery({
    queryKey: ['tryon-hairs'],
    queryFn: () => listTryOnTemplates('hair-style').then((r) => r.data.items),
  });

  const palette = useMemo(() => {
    if (!analysisResult) return [];
    return getSeasonInfo(analysisResult.colourSeason, analysisResult.colorProfile.undertone).palette;
  }, [analysisResult]);

  const filteredByCategory = garments.filter((g) => g.category === activeCategory);

  const isPending = clothes.isPending || makeup.isPending || hair.isPending;

  const handleSelect = (item: Selected) => {
    setSelected(item);
    setResultUrl(null);
    setIsFallback(false);
  };

  const handleTryOn = () => {
    if (!selected || !referenceImageUrl) return;
    setResultUrl(null);
    setIsFallback(false);
    if (selected.kind === 'outfit') {
      clothes.mutate(
        { garmentUrl: selected.img, garmentName: selected.name, colourHex: selected.colourHex },
        { onSuccess: (r) => { setResultUrl(r.data.resultUrl); setIsFallback(r.data.source === 'fallback'); } },
      );
    } else if (selected.kind === 'look') {
      makeup.mutate(selected.id, {
        onSuccess: (r) => { setResultUrl(r.data.resultUrl); setIsFallback(r.data.source === 'fallback'); },
      });
    } else {
      hair.mutate(selected.id, {
        onSuccess: (r) => { setResultUrl(r.data.resultUrl); setIsFallback(r.data.source === 'fallback'); },
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
    ? selected?.kind === 'look' ? 'Applying…' : 'Trying On…'
    : resultUrl ? 'Try Again'
    : selected?.kind === 'look' ? 'Apply This Look'
    : selected?.kind === 'hair' ? 'Try This Hairstyle'
    : 'Try On This Outfit';

  return (
    <div className="w-full pb-24">
      {/* ── Hero — full-bleed campaign background like Home page ── */}
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
              Select a category, pick any outfit, and watch it appear on your photo — powered by AI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {['Dresses', 'Tops', 'Ethnic Wear', 'Outerwear', 'Bottoms'].map((cat) => (
                <span key={cat} className="rounded-sm border border-gold-hairline bg-surface-0/75 px-3 py-1 eyebrow-micro text-gold-primary backdrop-blur-sm">
                  {cat}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: before/after slider — same model, dress changed */}
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
                ← drag to compare →
              </motion.div>
            </div>
          </motion.div>
        </div>
      </CampaignSection>

      <EditorialContainer width="content" className="pt-12">

        {!referenceImageUrl ? (
          <div className="mx-auto mt-14 w-full max-w-xl border border-gold-hairline bg-surface-3 p-8 text-center">
            <span aria-hidden className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-surface-4 text-gold-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-serif text-[length:var(--text-h5)] text-cream-primary">Upload your selfie first</h2>
            <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
              Virtual try-on needs a reference photo of you. Analyse one to unlock your palette.
            </p>
            <Link href={ROUTES.upload} className="mt-8 inline-block">
              <Button size="lg">Upload a Selfie</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mode tabs */}
            <div className="mt-12 border-b border-gold-hairline">
              <div role="tablist" aria-label="Try-on category" className="flex gap-0">
                {tabs.map((tab) => (
                  <button key={tab.id} type="button" role="tab" aria-selected={mode === tab.id}
                    onClick={() => { setMode(tab.id); setSelected(null); setResultUrl(null); }}
                    className={cn('eyebrow relative px-6 py-4 transition-colors duration-200',
                      mode === tab.id ? 'text-cream-primary' : 'text-cream-primary/55 hover:text-cream-primary')}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start"
            >
              {/* Left — options */}
              <section>
                {mode === 'outfits' && (
                  <>
                    {/* Category sub-tabs */}
                    <div className="mb-6 overflow-x-auto scrollbar-none">
                      <div role="group" aria-label="Garment categories" className="flex w-max gap-2 pb-1">
                        {GARMENT_CATEGORIES.map((cat) => (
                          <button key={cat} type="button"
                            onClick={() => { setActiveCategory(cat); setSelected(null); setResultUrl(null); }}
                            className={cn('inline-flex min-h-10 items-center rounded-sm border px-4 eyebrow-micro transition-colors duration-200',
                              activeCategory === cat
                                ? 'border-gold-primary bg-gold-primary text-surface-0'
                                : 'border-gold-hairline bg-surface-3 text-cream-primary/70 hover:border-gold-primary hover:text-cream-primary')}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Garment grid */}
                    <motion.div
                      key={activeCategory}
                      className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                      initial="hidden" animate="visible"
                    >
                      {filteredByCategory.map((garment) => {
                        const isSelected = selected?.id === String(garment.id);
                        return (
                          <motion.div key={garment.id}
                            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }}
                          >
                            <button type="button"
                              onClick={() => handleSelect({ kind:'outfit', id:String(garment.id), name:garment.name, img:garment.img, colourName:garment.colourName, colourHex:garment.colourHex })}
                              aria-pressed={isSelected}
                              className={cn('group w-full overflow-hidden border text-left transition-all duration-300',
                                isSelected ? 'border-gold-primary' : 'border-gold-hairline hover:border-gold-primary/50')}
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden border-b border-gold-hairline">
                                <img src={garment.img} srcSet={srcsetFromUrl(garment.img, [300,600])}
                                  sizes="(min-width:1024px) 20vw, 40vw" alt={garment.name}
                                  width={300} height={400} loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                              </div>
                              <div className="p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="h-3 w-3 rounded-full border border-gold-hairline/40 shrink-0"
                                    style={{ backgroundColor: garment.colourHex }} />
                                  <p className="text-[0.6rem] uppercase tracking-wider text-cream-primary/45">{garment.colourName}</p>
                                </div>
                                <p className="text-body-sm font-light text-cream-primary leading-snug">{garment.name}</p>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </>
                )}

                {mode !== 'outfits' && (
                  <TemplateGrid mode={mode}
                    items={mode === 'makeup' ? looksQuery.data : hairQuery.data}
                    isLoading={mode === 'makeup' ? looksQuery.isLoading : hairQuery.isLoading}
                    selectedId={selected?.id ?? null}
                    onSelect={(item) => handleSelect({ kind: mode === 'makeup' ? 'look' : 'hair', id:item.id, name:item.title, img:item.thumb })}
                  />
                )}
              </section>

              {/* Right — studio */}
              <section className="lg:sticky lg:top-24">
                <EditorialHeading as="h2" size="sm">Try-On Studio</EditorialHeading>
                <div className="mt-6 border-t border-gold-hairline pt-6">
                  {selected ? (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                            {selected.kind === 'outfit' ? 'Selected outfit' : selected.kind === 'look' ? 'Selected look' : 'Selected hairstyle'}
                          </p>
                          <p className="mt-1 font-serif text-[length:var(--text-h5)] text-cream-primary">{selected.name}</p>
                        </div>
                        <Badge variant="gold">{selected.colourName ?? (selected.kind === 'look' ? 'Makeup' : selected.kind === 'hair' ? 'Hair' : 'Look')}</Badge>
                      </div>

                      {/* Result: Before/After slider when try-on result available, else side-by-side */}
                      {resultUrl && !isFallback ? (
                        <div className="mt-6">
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55 mb-2">
                            Drag to compare
                          </p>
                          <BeforeAfterSlider
                            beforeSrc={assetUrl(referenceImageUrl)}
                            afterSrc={resultUrl}
                            afterColour={selected.colourHex}
                            beforeLabel="You"
                            afterLabel="Try-On"
                            className="aspect-[3/4] w-full"
                          />
                        </div>
                      ) : (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">You</p>
                          <div className="mt-2 aspect-[3/4] w-full overflow-hidden border border-gold-hairline">
                            <img src={assetUrl(referenceImageUrl)} alt="Your reference photo"
                              width={480} height={640} className="h-full w-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                              {resultUrl ? (isFallback ? 'Colour Preview' : 'Try-on') : 'Preview'}
                            </p>
                            {isFallback && resultUrl && (
                              <span className="rounded-sm border border-gold-hairline bg-surface-4 px-2 py-0.5 text-[0.55rem] uppercase tracking-widest text-gold-primary/70">Preview</span>
                            )}
                          </div>
                          <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden border border-gold-hairline">
                            <AnimatePresence mode="wait">
                              <motion.img key={resultUrl ?? selected.img}
                                src={resultUrl ?? selected.img}
                                alt={resultUrl ? `Try-on: ${selected.name}` : selected.name}
                                width={480} height={640}
                                initial={{ opacity:0, scale:1.04 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.97 }}
                                transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            </AnimatePresence>
                            {isFallback && resultUrl && selected.colourHex && (
                              <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply"
                                style={{ backgroundColor: selected.colourHex, opacity: 0.4 }} />
                            )}
                          </div>
                          {isFallback && resultUrl && (
                            <p className="mt-1 text-[0.6rem] text-cream-primary/40">Colour preview — AI try-on coming soon</p>
                          )}
                        </div>
                      </div>
                      )}

                      <div className="mt-8 flex flex-col gap-3">
                        <Button size="lg" onClick={handleTryOn} disabled={isPending}>
                          {isPending ? <LoaderCircle className="animate-spin" aria-hidden /> : <RotateCw aria-hidden />}
                          {ctaLabel}
                        </Button>
                        {resultUrl && (
                          <Button variant="secondary" size="lg" onClick={handleDownload}>
                            <Download aria-hidden /> Download Result
                          </Button>
                        )}
                        {resultUrl && selected.kind === 'outfit' && (
                          <>
                            <Button variant="secondary" size="lg" onClick={handleAddToWardrobe}>
                              <Bookmark aria-hidden /> Add to Saved Looks
                            </Button>
                            {selectedGarment?.buyUrl && (
                              <a href={selectedGarment.buyUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex min-h-[52px] w-full items-center justify-center bg-gold-primary px-10 text-nav font-semibold uppercase tracking-wider text-surface-0 transition-all hover:bg-gold-dark hover:text-cream-primary active:scale-[0.98]">
                                Buy on Myntra →
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      {(clothes.isError || makeup.isError || hair.isError) && !isFallback && (
                        <p className="mt-4 text-[length:var(--text-body-sm)] text-error">The try-on could not be completed. Please try again.</p>
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

function TemplateGrid({ mode, items, isLoading, selectedId, onSelect }: {
  mode: Mode;
  items?: TemplateItem[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (item: TemplateItem) => void;
}) {
  // Indian hairstyle fallbacks when YouCam templates unavailable
  const indianHairStyles: TemplateItem[] = [
    { id: 'hair-local-1', title: 'Classic Bun',           thumb: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { id: 'hair-local-2', title: 'Loose Waves',           thumb: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&q=80' },
    { id: 'hair-local-3', title: 'Sleek Straight',        thumb: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&q=80' },
    { id: 'hair-local-4', title: 'Braided Plait',         thumb: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80' },
    { id: 'hair-local-5', title: 'Half-Up Half-Down',     thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
    { id: 'hair-local-6', title: 'Curly Natural',         thumb: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80' },
  ];

  // Indian makeup look fallbacks
  const indianMakeupLooks: TemplateItem[] = [
    { id: 'makeup-local-1', title: 'Bridal Glam',         thumb: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&q=80' },
    { id: 'makeup-local-2', title: 'Festive Smokey Eye',  thumb: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80' },
    { id: 'makeup-local-3', title: 'Dewy Natural Look',   thumb: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&q=80' },
    { id: 'makeup-local-4', title: 'Bold Red Lip',        thumb: 'https://images.unsplash.com/photo-1512551980832-13df02babc9e?w=400&q=80' },
    { id: 'makeup-local-5', title: 'Nude Glam',           thumb: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&q=80' },
    { id: 'makeup-local-6', title: 'Kajal & Kohl Look',   thumb: 'https://images.unsplash.com/photo-1519699047748-de8e44489c0e?w=400&q=80' },
  ];

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse border border-gold-hairline bg-surface-3/40" />
        ))}
      </div>
    );
  }

  // Use local Indian fallbacks when YouCam returns empty
  const displayItems = (items && items.length > 0)
    ? items
    : mode === 'hair' ? indianHairStyles : indianMakeupLooks;

  const isLocalFallback = !items || items.length === 0;

  return (
    <div>
      {isLocalFallback && (
        <p className="mb-4 text-body-sm text-gold-primary/70 border border-gold-hairline/30 bg-gold-primary/5 px-4 py-2 rounded-sm">
          Showing curated Indian {mode === 'hair' ? 'hairstyle' : 'makeup'} styles — AI try-on preview will apply closest match.
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {displayItems.map((item) => {
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


