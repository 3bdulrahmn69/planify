import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import DrawToolsBox from './DrawToolsBox';
import { Modal, ModalButton } from '../../../components/Modal';

import {
  FaTrash,
  FaUndo,
  FaRedo,
  FaSearchPlus,
  FaSearchMinus,
} from 'react-icons/fa';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import DrawToolsSettings from './DrawToolsSettings';

const DrawBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tool, setTool] = useState('');
  const [lineSize, setLineSize] = useState(15);
  const [color, setColor] = useState('#000000');
  const [lines, setLines] = useState<
    { tool: string; color: string; strokeWidth: number; points: number[] }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { tool: string; color: string; strokeWidth: number; points: number[] }[]
  >([]);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scale, setScale] = useState(1); // Zoom level

  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage>(null);

  const ZOOM_STEP = 0.1;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;

  /* Modal Functions */
  const handleCLoseModal = () => {
    setIsModalOpen(false);
  };

  // Undo last action
  const handleUndo = () => {
    setLines((prevLines) => {
      if (prevLines.length === 0) return prevLines;
      const lastLine = prevLines[prevLines.length - 1];
      setRedoStack((prevRedoStack) => [lastLine, ...prevRedoStack]);
      return prevLines.slice(0, -1);
    });
  };

  // Redo last undone action
  const handleRedo = () => {
    setRedoStack((prevRedoStack) => {
      if (prevRedoStack.length === 0) return prevRedoStack;
      const lastUndone = prevRedoStack[0];
      setLines((prevLines) => [...prevLines, lastUndone]);
      return prevRedoStack.slice(1);
    });
  };

  // Clear all lines with confirmation
  const handleClear = () => {
    setLines([]);
    setRedoStack([]);
    setIsModalOpen(false);
  };

  // Dynamic Cursor
  const getCursor = () => {
    if (tool === 'eraser') {
      return `url(https://github.com/jhuckaby/Effect-Games/raw/refs/heads/master/htdocs/images/cursors/eraser.cur), auto`;
    }
    if (tool === 'pen') {
      return `url(https://github.com/jhuckaby/Effect-Games/raw/refs/heads/master/htdocs/images/cursors/pencil.cur), auto`;
    }
    if (tool === 'hand') {
      return 'grab';
    }
    return 'default';
  };

  // Update stage size on window resize
  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current as Konva.Stage | null;
    if (!stage) return;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    // Adjust scale
    const newScale = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, oldScale - e.evt.deltaY * ZOOM_STEP * 0.01)
    );
    setScale(newScale);

    // Adjust stage position to zoom at the pointer
    const mousePointTo = {
      x: (pointer!.x - stage.x()) / oldScale,
      y: (pointer!.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer!.x - mousePointTo.x * newScale,
      y: pointer!.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  }, []);

  // Buttons for zooming
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + ZOOM_STEP, MAX_ZOOM));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - ZOOM_STEP, MIN_ZOOM));
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.scale({ x: scale, y: scale });
    stage.batchDraw();
  }, [scale]);

  // Start drawing
  const handleMouseDown = useCallback(() => {
    if (tool === 'pen' || tool === 'eraser') {
      isDrawing.current = true;
      const stage = stageRef.current;
      const point = stage?.getPointerPosition();
      if (!point) return;
      if (!stage) return;
      const scale = stage.scaleX(); // Assume uniform scaling
      const offsetX = stage.x();
      const offsetY = stage.y();

      // Translate pointer position to canvas coordinates
      const translatedPoint = {
        x: (point.x - (offsetX ?? 0)) / (scale ?? 1),
        y: (point.y - (offsetY ?? 0)) / (scale ?? 1),
      };

      setRedoStack([]); // Clear redo stack on new action
      setLines((prevLines) => [
        ...prevLines,
        {
          tool,
          color,
          strokeWidth: lineSize,
          points: [translatedPoint.x, translatedPoint.y],
        },
      ]);
    }
  }, [tool, color, lineSize]);

  // Continue drawing
  const handleMouseMove = useCallback(() => {
    if (!isDrawing.current) return;

    const stage = stageRef.current;
    const point = stage?.getPointerPosition();
    if (!point) return;

    const scale = stage?.scaleX(); // Assume uniform scaling
    const offsetX = stage?.x();
    const offsetY = stage?.y();

    // Translate pointer position to canvas coordinates
    const translatedPoint = {
      x: (point.x - (offsetX ?? 0)) / (scale ?? 1),
      y: (point.y - (offsetY ?? 0)) / (scale ?? 1),
    };

    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, translatedPoint.x, translatedPoint.y],
      };
      return [...prevLines.slice(0, -1), updatedLine];
    });
  }, []);

  // End drawing
  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(e.target.value));
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full relative overflow-hidden"
      style={{ cursor: getCursor() }}
    >
      <DrawToolsBox tool={tool} setTool={setTool} />

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable={tool === 'hand'} // Enable dragging only in "hand" mode
        onWheel={handleWheel} // Attach wheel event for zoom
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>

      <DrawToolsSettings
        setLineSize={setLineSize}
        lineSize={lineSize}
        setColor={setColor}
        color={color}
      />

      {/* Zoom Buttons */}
      <div className="fixed bottom-16 right-4 flex flex-col items-center gap-2 z-10">
        {/* Zoom In Button */}
        <button
          className="bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 transition-all"
          onClick={zoomIn}
          disabled={scale >= MAX_ZOOM}
          aria-label="Zoom In"
          title="Zoom In"
        >
          <FaSearchPlus size={16} />
        </button>

        {/* Custom Zoom Slider */}
        <div className="relative h-32 w-3">
          {/* Background shape for tapering effect */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-white to-yellow-500 rounded-full border-2 pointer-events-none"
            aria-hidden="true"
          ></div>

          {/* Hidden range input */}
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step="0.1"
            value={scale}
            onChange={handleSliderChange}
            className="absolute inset-0 h-32 w-3 opacity-0 cursor-pointer rotate-90"
            aria-label="Zoom"
          />

          {/* Visible dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full shadow-md"
            style={{
              bottom: `${((scale - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 87}%`,
            }}
            aria-hidden="true"
          ></div>
        </div>

        {/* Zoom Out Button */}
        <button
          className="bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 transition-all"
          onClick={zoomOut}
          disabled={scale <= MIN_ZOOM}
          aria-label="Zoom Out"
          title="Zoom Out"
        >
          <FaSearchMinus size={16} />
        </button>
      </div>

      {/* Undo, Redo, Clear Buttons */}
      <div className="fixed bottom-4 right-4 flex gap-4 z-10">
        <button
          className={`bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-all ${
            redoStack.length === 0 ? 'bg-gray-400 hover:bg-gray-400' : ''
          }`}
          onClick={handleRedo}
          disabled={redoStack.length === 0}
          aria-label="Redo"
          title="Redo"
        >
          <FaRedo size={18} />
        </button>

        <button
          className={`bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-all ${
            lines.length === 0 ? 'bg-gray-400 hover:bg-gray-400' : ''
          }`}
          onClick={handleUndo}
          disabled={lines.length === 0}
          aria-label="Undo"
          title="Undo"
        >
          <FaUndo size={18} />
        </button>

        {/* Clear Button */}
        <button
          className={`bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all ${
            lines.length === 0 ? 'bg-gray-400 hover:bg-gray-400' : ''
          }`}
          onClick={() => setIsModalOpen(true)}
          disabled={lines.length === 0}
          aria-label="Clear Canvas"
          title="Clear Canvas"
        >
          <FaTrash size={18} />
        </button>
      </div>

      {/* Modal for Clear Confirmation */}
      <Modal
        title="Clear Canvas"
        isOpen={isModalOpen}
        onClose={handleCLoseModal}
        titleClassName="text-red-500"
      >
        <p
          className="text-gray-700"
          style={{ textAlign: 'center', margin: '1rem 0' }}
        >
          Are you sure you want to clear the canvas?
        </p>
        <div className="flex gap-2">
          <ModalButton onClick={handleCLoseModal}>Cancel</ModalButton>
          <ModalButton
            className="bg-red-500 hover:bg-red-600"
            onClick={handleClear}
          >
            Clear
          </ModalButton>
        </div>
      </Modal>
    </div>
  );
};

export default DrawBoard;
