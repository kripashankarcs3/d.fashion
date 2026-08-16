import fs from 'fs';
import path from 'path';

const brainDir = `C:\\Users\\kripa\\.gemini\\antigravity-ide\\brain\\f9cf778d-4867-4e50-bf87-292fb8d060e9`;
const targetDir = `c:\\Users\\kripa\\Desktop\\DeeStyle\\public\\images\\garments`;

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(brainDir);

files.forEach(f => {
  if (f.startsWith('men_') && f.endsWith('.png')) {
    const src = path.join(brainDir, f);
    let destName = f;
    if (f.includes('men_dhoti_kurta')) destName = 'men_dhoti_kurta.png';
    else if (f.includes('men_pathani_suit')) destName = 'men_pathani_suit.png';
    else if (f.includes('men_royal_achkan')) destName = 'men_royal_achkan.png';
    else if (f.includes('men_kurta_pajama')) destName = 'men_kurta_pajama.png';
    else if (f.includes('men_traditional_angarkha')) destName = 'men_traditional_angarkha.png';
    else if (f.includes('men_silk_churidar_kurta')) destName = 'men_silk_churidar_kurta.png';
    else if (f.includes('men_heritage_bandhgala')) destName = 'men_heritage_bandhgala.png';
    else if (f.includes('men_embroidered_nehru_jacket')) destName = 'men_embroidered_nehru_jacket.png';
    else if (f.includes('men_polo_tshirt')) destName = 'men_polo_tshirt.png';
    else if (f.includes('men_everyday_chinos')) destName = 'men_everyday_chinos.png';
    else if (f.includes('men_casual_denim_jeans')) destName = 'men_casual_denim_jeans.png';
    
    fs.copyFileSync(src, path.join(targetDir, destName));
    console.log(`Copied ${f} to ${destName}`);
  }
});
