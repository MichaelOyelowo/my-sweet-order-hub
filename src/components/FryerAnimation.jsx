import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function FryerAnimation() {
  const containerRef = useRef(null);

  // Tracks the user's scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset:["start start", "end end"]
  });

  // ── Scroll Animations ──
  // The snacks start high up (-80vh) and fall down into the pan (approx 40vh down)
  const snackY1 = useTransform(scrollYProgress, [0, 0.8], ["-80vh", "40vh"]);
  const snackY2 = useTransform(scrollYProgress, [0.1, 0.9],["-100vh", "35vh"]);
  
  // Text fades out quickly as they start scrolling
  const textOpacity = useTransform(scrollYProgress,[0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="fryer-wrapper">
      <div className="fryer-sticky">
        
        {/* ── 1. The Floating Text ── */}
        <motion.div style={{ opacity: textOpacity }} className="fryer-text-wrap">
          <p className="fryer-eyebrow">Fresh & Hot</p>
          <h2 className="fryer-title">Straight into the <em>fryer!</em></h2>
          <p className="fryer-sub">Scroll down to drop the snacks into the hot oil.</p>
        </motion.div>

        {/* ── 2. The Boiling Oil (Fixed Background) ── */}
        <div className="oil-background-container">
          <video 
            src="./boilingOil.mp4" /* PUT YOUR OIL VIDEO URL HERE */
            autoPlay 
            loop 
            muted 
            playsInline 
            className="oil-video"
          />
        </div>

        {/* ── 3. The Magic Mask Zone ── */}
        {/* This cuts off right at the rim of the pan so the snacks disappear! */}
        <div className="snack-magic-mask">
          
          {/* Falling Snack Video 1 */}
          <motion.div className="falling-snack-wrapper snack-left" style={{ y: snackY1 }}>
            <video 
              src="./doughtVid.mp4" /* PUT SNACK VIDEO 1 HERE */
              autoPlay 
              loop 
              muted 
              playsInline 
              className="snack-video blend-screen" /* Use blend-screen if black bg, blend-multiply if white bg */
            />
          </motion.div>

          {/* Falling Snack Video 2 */}
          <motion.div className="falling-snack-wrapper snack-right" style={{ y: snackY2 }}>
            <video 
              src="./splashingOil.mp4" /* PUT SNACK VIDEO 2 HERE */
              autoPlay 
              loop 
              muted 
              playsInline 
              className="snack-video blend-screen"
            />
          </motion.div>

        </div>

        {/* Optional: Add a dark fade at the bottom to blend into your next section smoothly */}
        <div className="fryer-bottom-fade"></div>

      </div>
    </div>
  );
}