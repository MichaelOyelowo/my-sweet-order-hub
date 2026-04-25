import React from 'react';

// Clean, premium text without emojis
const baseRow1 =[
  'Soft Doughnuts',
  'Creamy Cakes',
  'Banana Bread',
  'Puff Puff',
  'Chocolate Treats',
  'Spicy Meatpies'
];

const baseRow2 =[
  'Baked Fresh Daily',
  'Fast Delivery',
  'Quality Ingredients',
  'Fans Favorite',
  'Always On Time',
  'Perfect Taste'
];

const row1Items = [...baseRow1, ...baseRow1, ...baseRow1];
const row2Items =[...baseRow2, ...baseRow2, ...baseRow2];

export default function Marquee() {
  return (
    <div className="marquee-section" aria-label="Our categories and features">
      
      {/* Row 1: Scrolls Left */}
      <div className="marquee-track track-left">
        {row1Items.map((text, i) => (
          <span key={`r1-${i}`} className="marquee-item">
            {/* Alternates between solid text and outlined (hollow) text */}
            <span className={i % 2 === 0 ? "marquee-text solid" : "marquee-text outline"}>
              {text}
            </span>
            {/* Premium 4-point star SVG separator */}
            <svg className="marquee-star" viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor"/>
            </svg>
          </span>
        ))}
      </div>

      {/* Row 2: Scrolls Right */}
      <div className="marquee-track track-right" aria-hidden="true">
        {row2Items.map((text, i) => (
          <span key={`r2-${i}`} className="marquee-item">
            {/* Offset the alternating pattern so it looks staggered */}
            <span className={i % 2 !== 0 ? "marquee-text solid" : "marquee-text outline"}>
              {text}
            </span>
            <svg className="marquee-star" viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor"/>
            </svg>
          </span>
        ))}
      </div>

    </div>
  );
}