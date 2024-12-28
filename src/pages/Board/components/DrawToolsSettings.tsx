import React, { useState, useCallback, useEffect } from 'react';
import RangeSlider from './RangeSlider';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

interface DrawToolsSettingsProps {
  setAllSize: (size: number) => void;
  allSize: number;
  setColor: (color: string) => void;
  color: string;
  isKeyboardShortcutsDisable?: boolean;
}

const primaryColors = [
  { name: 'Red', color: '#FF0000' },
  { name: 'Green', color: '#008000' },
  { name: 'Blue', color: '#0000FF' },
  { name: 'Yellow', color: '#FFFF00' },
  { name: 'Black', color: '#000000' },
  { name: 'White', color: '#FFFFFF' },
];

const DrawToolsSettings = ({
  setAllSize,
  allSize,
  setColor,
  color,
  isKeyboardShortcutsDisable,
}: DrawToolsSettingsProps) => {
  const [isExpanded, setExpanded] = useState(false);

  // Memoize the setExpanded function to prevent unnecessary re-renders
  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isKeyboardShortcutsDisable) return;
      if (e.key.toLowerCase() === 'f') {
        toggleExpanded();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [toggleExpanded, isKeyboardShortcutsDisable]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-200 p-4 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-96' : 'max-h-0'
      }`}
      role="complementary"
      aria-expanded={isExpanded}
      aria-labelledby="settings-header"
    >
      {/* Expand Button */}
      <button
        onClick={toggleExpanded}
        className="absolute top-2 right-4 flex justify-center items-center gap-2 text-gray-700"
        aria-label={isExpanded ? 'Collapse settings' : 'Expand settings'}
      >
        {isExpanded ? <IoIosArrowDown /> : <IoIosArrowUp />}
      </button>

      {/* Range Slider for Line Size */}
      <RangeSlider
        label="global size"
        value={allSize}
        setValue={setAllSize}
        isKeyboardShortcutsDisable={isKeyboardShortcutsDisable}
      />

      {/* Color Picker Section */}
      <section aria-labelledby="color-section">
        <div className="flex justify-between py-2 items-center">
          <span id="color-section" className="text-lg font-medium">
            Color
          </span>
          <label htmlFor="color-picker" className="flex items-center gap-2">
            Pick:
            <input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded-lg border-none flex-shrink-0"
              aria-label="Color picker"
            />
          </label>
        </div>

        <div className="flex space-x-2">
          {/* Primary Color Buttons */}
          {primaryColors.map(({ name, color: buttonColor }) => (
            <button
              key={name}
              onClick={() => setColor(buttonColor)}
              title={name}
              style={{ backgroundColor: buttonColor }}
              className="w-10 h-10 rounded-lg border-2 border-transparent transition-all transform hover:scale-110"
              aria-label={`Select ${name} color`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default React.memo(DrawToolsSettings); // Prevent unnecessary re-renders
