# Image Dimensions Guide for Unwritten Events Homepage

## Overview

This document specifies the exact dimensions for all image blocks used throughout the home page (UnwrittenEvents.jsx). Use these dimensions to crop your images for perfect fit and responsive display.

---

## 🎞️ HERO SECTION

**Location:** Top banner of the home page

### Hero Carousel Images (4 images - rotating every 3 seconds)

- **Desktop (1440px):** 1360px × 550px
- **Tablet (1024px):** 960px × 420px
- **Mobile Landscape (768px):** 720px × 320px
- **Mobile Portrait (480px):** 448px × 240px

**Aspect Ratio:** 16:5 (or 2.47:1)

**Image Paths in Code:**

```
src/assets/frontEnd-images/Home-image.png
src/assets/frontEnd-images/Home-image-2.png
src/assets/frontEnd-images/services_image.jpg
src/assets/frontEnd-images/Home_page_main_picture.jpg
```

**Recommended Final Dimensions:** Crop to **1360px × 550px** (desktop width), the responsive sizes will be handled by CSS

---

## 🎨 SCROLLING IMAGE STRIP

**Location:** Below hero, horizontally scrolling section with 8 gradient blocks

### Strip Individual Blocks

Each block in the strip has these dimensions:

- **Desktop (1440px):** 280px × 200px
- **Tablet (1024px):** 280px × 200px
- **Mobile Landscape (768px):** 180px × 140px
- **Mobile Portrait (480px):** 140px × 100px

**Aspect Ratio:** 7:5 (or 1.4:1)

**Total Strip Blocks:** 8 blocks (duplicated to create infinite scroll effect)

**Note:** Currently using gradient placeholders. Replace the divs with `<img>` tags and crop images to **280px × 200px**

**HTML Location in Code:**

```jsx
{[...stripColors, ...stripColors].map((bg, i) => (
  <div key={i} style={{width: 280, height: 200, ...}}>
    {/* Replace with: <img src="strip-{index}.jpg" alt="" /> */}
  </div>
))}
```

---

## 🖼️ GALLERY SECTION

**Location:** After "WHO WE ARE" section, displays 6 event photos in 2 rows (3 per row)

### Gallery Cards

The gallery is divided into two rows:

**Row 1 - Light/Colorful Events (3 cards):**

- **Desktop & Tablet (1024px+):** 280px × 240px each
- **Mobile Landscape (768px):** 280px × 240px (stacked, full width)
- **Mobile Portrait (480px):** 100% width × 160px

**Row 2 - Dark/Dramatic Events (3 cards):**

- **Desktop & Tablet (1024px+):** 280px × 240px each
- **Mobile Landscape (768px):** 280px × 240px (stacked, full width)
- **Mobile Portrait (480px):** 100% width × 160px

**Aspect Ratio:** 7:6 (or 1.167:1)

**Gallery Items:**

```
1. Bridal Shower (light gradient background)
2. Housewarming (light gradient background)
3. Wedding Plan (light gradient background)
4. Vineyard Wedding (dark background)
5. Summer Solstice Gala (dark background)
6. Nordic Winter Retreat (dark background)
```

**Recommended Final Dimensions:** Crop to **280px × 240px** for all images

**Note:** Images currently use placeholder divs with gradients. Replace with:

```jsx
<img
  className="ue-gallery-card img"
  src="assets/gallery-{number}.jpg"
  alt="{item.label}"
/>
```

---

## 📰 JOURNAL SECTION

**Location:** Bottom section with blog article cards (2 cards side-by-side)

### Journal Card Images

Each journal article has a featured image:

- **Desktop & Tablet (1024px+):** 100% width × 200px
- **Mobile Landscape (768px):** 100% width × 180px
- **Mobile Portrait (480px):** 100% width × 140px

**Aspect Ratio:** Variable (flexible width), Height varies per breakpoint

**Journal Articles:**

```
1. Article 1: "Embracing Minimalism in Floral Design"
2. Article 2: "The Art of the Table Setting"
```

**Recommended Final Dimensions:**

- Crop to **600px × 200px** minimum (scales up responsively)
- At least 1200px wide for high-quality desktop display

**Note:** Images currently use placeholder gradients:

```jsx
<div className="ue-journal-placeholder">
  {/* Replace with: <img src="journal-{number}.jpg" alt="" /> */}
</div>
```

---

## 📊 RESPONSIVE BREAKPOINT SUMMARY TABLE

| Section           | Desktop (1440px) | Tablet (1024px) | Mobile-L (768px) | Mobile-S (480px) |
| ----------------- | ---------------- | --------------- | ---------------- | ---------------- |
| **Hero**          | 1360×550         | 960×420         | 720×320          | 448×240          |
| **Strip Block**   | 280×200          | 280×200         | 180×140          | 140×100          |
| **Gallery Card**  | 280×240          | 280×240         | 280×240          | 100%×160         |
| **Journal Image** | 100%×200         | 100%×200        | 100%×180         | 100%×140         |

---

## 🎯 CROPPING RECOMMENDATIONS

### Master Image Sizes (Crop to these first)

1. **Hero Images:** 1360px × 550px (then let CSS scale down)
2. **Strip Images:** 280px × 200px (mobile scales handled by CSS)
3. **Gallery Images:** 280px × 240px (card size)
4. **Journal Images:** 1200px × 400px (for high-quality desktop display)

### Quality Tips

- Use **300 DPI** or higher for print-quality display
- Ensure images are **sharp and centered** before cropping
- Use **consistent lighting** across all event images for gallery
- Light photos for Row 1, darker/moody photos for Row 2 in gallery

---

## 🔧 Implementation Steps

1. **Prepare your images:**
   - Gather all 18 images (4 hero + 8 strip + 6 gallery + 2 journal)
   - Crop to dimensions specified above using Photoshop, Figma, or free tools (Pixlr, Photopea)

2. **Optimize for web:**
   - Convert to JPG (photos) or WebP (for better compression)
   - Compress using TinyPNG or similar tools
   - Target: under 100KB per image

3. **Place images in folders:**

   ```
   src/assets/frontEnd-images/
   ├── Home-image.png (hero 1)
   ├── Home-image-2.png (hero 2)
   ├── services_image.jpg (hero 3)
   ├── Home_page_main_picture.jpg (hero 4)
   ├── strip-1.jpg through strip-8.jpg
   ├── gallery-1.jpg through gallery-6.jpg
   └── journal-1.jpg & journal-2.jpg
   ```

4. **Update HTML/JSX:**
   - Replace placeholder divs with `<img>` tags
   - Update `src` paths to point to cropped images
   - Add `alt` text for accessibility

---

## 📝 Notes

- All dimensions account for `box-sizing: border-box`
- Images use `object-fit: cover` for consistent cropping within containers
- Responsive scaling is handled by CSS media queries - images will scale proportionally
- Strip images repeat 2x to create infinite scroll effect
- Gallery supports both color and dark-themed images
- Journal cards maintain aspect ratio flexibility

---

## ✅ Verification Checklist

- [ ] All 18 images cropped to correct dimensions
- [ ] Images optimized for web (compressed, proper format)
- [ ] Images placed in `src/assets/frontEnd-images/` folder
- [ ] JSX updated with image paths
- [ ] Tested on desktop, tablet, and mobile viewports
- [ ] Images display without distortion or stretching
- [ ] Gallery alternates between light and dark themed images properly
- [ ] Strip scrolls smoothly with cropped images
- [ ] Hero carousel transitions smoothly between images
- [ ] Journal images display in cards without overflow

---

**Last Updated:** March 6, 2026
**App:** Unwritten Events - Luxury Event Planning Website
**Status:** Ready for image implementation ✨
