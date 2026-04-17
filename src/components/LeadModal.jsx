import React, { useState, useEffect } from 'react';

function LeadModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); 

    return () => clearTimeout(timer);
  }, []);

  // Function to manually close the modal
  const closeModal = () => setIsOpen(false);

  // If the modal isn't open, we render nothing
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      {/* stopPropagation prevents closing when clicking the box itself */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close" onClick={closeModal} aria-label="Close modal">
          ✕
        </button>
        
        <div className="modal-header">
          <span className="modal-emoji">🎁</span>
          <h2 className="modal-title">Wait! Get 10% Off</h2>
          <p className="modal-sub">
            Join the SweetHUB family and get an instant 10% discount on your first order of fresh, delicious treats.
          </p>
        </div>

        <form 
          className="modal-form" 
          action="https://formspree.io/f/maqaegqy" 
          method="POST"
        >
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email address..." 
            required 
            className="modal-input"
          />
          <button type="submit" className="modal-btn">
            Claim My Discount
          </button>
        </form>
        
        <p className="modal-spam-notice">We hate spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}

export default LeadModal;