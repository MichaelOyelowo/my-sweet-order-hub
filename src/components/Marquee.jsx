import React from 'react';

// Data from your Premium Combo image
const baseRow1 =[
  { label: 'Soft Doughnuts', emoji: '🍩' },
  { label: 'Creamy Cakes', emoji: '🍰' },
  { label: 'Banana Bread', emoji: '🍌' },
  { label: 'Puff Puff', emoji: '🥯' },
  { label: 'Chocolate Treats', emoji: '🍫' },
];

const baseRow2 =[
  { label: 'Fresh Daily', emoji: '🔥' },
  { label: 'Fast Delivery', emoji: '🚚' },
  { label: 'Quality Ingredients', emoji: '💯' },
  { label: 'Customer Favorite', emoji: '😍' },
  { label: 'Always On Time', emoji: '⏰' },
];

const row1Items =[...baseRow1, ...baseRow1, ...baseRow1, ...baseRow1];
const row2Items =[...baseRow2, ...baseRow2, ...baseRow2, ...baseRow2];

export default function Marquee() {
  return (
    <div className="marquee-section" aria-label="Our categories and features">
      
      {/* Row 1: Scrolls Right to Left (Default) */}
      <div className="marquee-track track-left">
        {row1Items.map((item, i) => (
          <span key={`r1-${i}`} className="marquee-item">
            <span className="marquee-emoji">{item.emoji}</span>
            {item.label}
            <span className="marquee-divider">✦</span>
          </span>
        ))}
      </div>

      {/* Row 2: Scrolls Left to Right */}
      <div className="marquee-track track-right" aria-hidden="true">
        {row2Items.map((item, i) => (
          <span key={`r2-${i}`} className="marquee-item">
            <span className="marquee-emoji">{item.emoji}</span>
            {item.label}
            <span className="marquee-divider">✦</span>
          </span>
        ))}
      </div>

    </div>
  );
}