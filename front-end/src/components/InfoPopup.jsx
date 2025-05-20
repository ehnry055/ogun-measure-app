import React, { useState, useRef, useEffect } from 'react';
import '../styles/InfoPopup.css';

const InfoPopup = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const togglePopup = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="info-container">
      <div className="info-icon" onClick={togglePopup}>?</div>

      {isOpen && (
        <div className="info-overlay" onClick={() => setIsOpen(false)}>
          <div className="info-popup" ref={popupRef} onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </div>

  );
};

export default InfoPopup;
