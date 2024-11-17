import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { animateScroll as scroll } from 'react-scroll';

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={() => scroll.scrollTo(0, { smooth: true, duration: 500 })}
        className="fixed bottom-16 right-8 p-3 rounded-full bg-slate-700 text-white shadow-lg hover:bg-slate-600 transition-colors duration-300"
        aria-label="Back to top"
      >
        <FaArrowUp size={20} />
      </button>
    )
  );
};

export default GoToTop;
