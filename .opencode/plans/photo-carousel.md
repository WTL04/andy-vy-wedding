# Photo Carousel Implementation Plan

## Components

### 1. `src/components/PhotoCarousel.tsx`

**State:**
- `activeIndex: number` — tracks which photo is centered (0, 1, or 2)

**Images:**
- 3 slots, all using `/imgs/photo_1.JPG` as placeholder

**Navigation:**
- Left click → `activeIndex = (activeIndex - 1 + 3) % 3` (counter-clockwise)
- Right click → `activeIndex = (activeIndex + 1) % 3` (clockwise)

**Position calculation:**
- Each `<img>` gets a position class: `"center"`, `"left"`, or `"right"` based on offset from activeIndex

**JSX structure:**
```jsx
<div className="carousel">
  <button className="carousel-arrow left" onClick={prev}>‹</button>
  <div className="carousel-track">
    {images.map((src, i) => (
      <img className={`carousel-slide ${getPosition(offset)}`} src={src} alt={...} />
    ))}
  </div>
  <button className="carousel-arrow right" onClick={next}>›</button>
</div>
```

### 2. `src/components/PhotoCarousel.css`

**Track:**
- `.carousel-track` — relative container, fixed height (~450px), holds 3 absolute-positioned images

**Slide positions:**
- `.carousel-slide.center` — full size, z-index 2, centered
- `.carousel-slide.left` — scaled to 0.7, shifted left, z-index 1, slight opacity reduction
- `.carousel-slide.right` — scaled to 0.7, shifted right, z-index 1, slight opacity reduction

**Transitions:**
- `transition: transform 0.5s ease, opacity 0.5s ease` on slides

**Arrows:**
- Semi-transparent white circle buttons with `‹` / `›`
- Hover effect: background brightens

### 3. `src/App.tsx`

- Import and add `<PhotoCarousel />` below the RSVP button

### 4. `src/App.css`

- Add margin-top for spacing above the carousel

## Files to create/modify:
- CREATE: `src/components/PhotoCarousel.tsx`
- CREATE: `src/components/PhotoCarousel.css`
- MODIFY: `src/App.tsx`
- MODIFY: `src/App.css`
