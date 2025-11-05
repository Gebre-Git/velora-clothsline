import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  const cursorSize = isHovering ? 40 : 20;
  const dotSize = 8;

  return (
    <>
      <div
        className="fixed pointer-events-none rounded-full transition-all duration-300 ease-out z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          transform: `translate(-50%, -50%)`,
          border: `2px solid ${isHovering ? 'rgba(0, 93, 90, 0.5)' : 'rgba(4, 47, 46, 0.7)'}`,
          backgroundColor: isHovering ? 'rgba(0, 93, 90, 0.1)' : 'transparent',
        }}
      />
       <div
        className="fixed pointer-events-none rounded-full bg-velora-green z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};

export default CustomCursor;