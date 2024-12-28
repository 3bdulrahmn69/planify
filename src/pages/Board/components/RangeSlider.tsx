import { useState, useEffect } from 'react';

interface RangeSliderProps {
  value: number;
  setValue: (value: number) => void;
  label?: string;
  isKeyboardShortcutsDisable?: boolean;
}

const RangeSlider = ({
  value,
  setValue,
  label,
  isKeyboardShortcutsDisable,
}: RangeSliderProps) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const calculateLeftPosition = () => {
    return `${((value - 1) / (53 - 1)) * 100}%`;
  };

  const handleMouseEnter = () => setTooltipVisible(true);
  const handleMouseLeave = () => setTooltipVisible(false);
  const handleMouseDown = () => setTooltipVisible(true);
  const handleMouseUp = () => setTooltipVisible(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isKeyboardShortcutsDisable) return;
      if (event.key === '<') {
        setValue(Math.max(1, value - 1)); // Decrease value by 1, minimum 1
      } else if (event.key === '>') {
        setValue(Math.min(53, value + 1)); // Increase value by 1, maximum 53
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [value, setValue, isKeyboardShortcutsDisable]);

  return (
    <div className="flex flex-col mt-4 w-full">
      {label && <span className="text-gray-700 text-sm mb-2">{label}</span>}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Tooltip */}
        {isTooltipVisible && (
          <div
            className="absolute -top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md transform -translate-x-1/2"
            style={{ left: calculateLeftPosition() }}
          >
            {value}px
          </div>
        )}

        {/* Slider */}
        <input
          type="range"
          min="1"
          max="53"
          step="2"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="w-full h-1 appearance-none bg-gradient-to-r from-gray-300 via-gray-500/50 to-indigo-500 rounded-lg outline-none focus:ring-2 focus:bg-transparent"
        />
      </div>
    </div>
  );
};

export default RangeSlider;
