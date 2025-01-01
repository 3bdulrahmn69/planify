import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import {
  Stage,
  Layer,
  Line,
  Text as KonvaText,
  Rect,
  Arrow,
} from 'react-konva';

/* Import Components */
import DrawToolsBox from './DrawToolsBox';
import { Modal, ModalButton, ModalInput } from '../../../components/Modal';
import DrawToolsSettings from './DrawToolsSettings';
import Tips from './Tips';
import { Share, ShareButton } from '../../../components/ShareTools';

/* Import Icons */
import {
  FaTrash,
  FaUndo,
  FaRedo,
  FaSearchPlus,
  FaSearchMinus,
} from 'react-icons/fa';
import { AiFillFileImage } from 'react-icons/ai';

const DOUBLE_CLICK_DELAY = 300;

const DrawBoard = () => {
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage>(null);
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get('id') || '';
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [tool, setTool] = useState('default');
  const [redoStack, setRedoStack] = useState<
    { tool: string; color: string; strokeWidth: number; points: number[] }[]
  >([]);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scale, setScale] = useState(1); // Zoom level
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const [allSize, setAllSize] = useState(15);
  const [color, setColor] = useState('#000000');
  const [lines, setLines] = useState(() => {
    if (!boardId) return []; // If no board ID, return an empty array
    const savedData = localStorage.getItem(boardId);
    return savedData ? JSON.parse(savedData).lines || [] : [];
  });

  // New state for text elements
  const [texts, setTexts] = useState(() => {
    if (!boardId) return []; // If no board ID, return an empty array
    const savedData = localStorage.getItem(boardId);
    return savedData ? JSON.parse(savedData).texts || [] : [];
  });
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // New state for arrow elements
  const [arrows, setArrows] = useState(() => {
    if (!boardId) return []; // If no board ID, return an empty array
    const savedData = localStorage.getItem(boardId);
    return savedData ? JSON.parse(savedData).arrows || [] : [];
  });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Load data on initial render
    const loadData = () => {
      const savedData = localStorage.getItem(boardId);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setLines(parsedData.lines || []);
        setTexts(parsedData.texts || []);
        setArrows(parsedData.arrows || []);
      }
    };

    // Prevent overwriting on initial render
    if (boardId) {
      loadData();
    }
  }, [boardId]); // Run only when the boardId changes

  useEffect(() => {
    const saveData = () => {
      if (!boardId) return; // Avoid saving if boardId is not available
      const boardData = {
        lines,
        texts,
        arrows,
      };
      localStorage.setItem(boardId, JSON.stringify(boardData));
    };

    saveData();
  }, [lines, texts, arrows, boardId]);

  /* Modal Functions */
  const handleCLoseClearModal = () => {
    setIsClearModalOpen(false);
  };

  const handleCLoseEditTextModal = () => {
    setIsEditingText(false);
  };

  // Undo last action
  const handleUndo = () => {
    setLines(
      (
        prevLines: {
          tool: string;
          color: string;
          strokeWidth: number;
          points: number[];
        }[]
      ) => {
        if (prevLines.length === 0) return prevLines;
        const lastLine = prevLines[prevLines.length - 1];
        setRedoStack((prevRedoStack) => [lastLine, ...prevRedoStack]);
        return prevLines.slice(0, -1);
      }
    );
  };

  // Redo last undone action
  const handleRedo = () => {
    setRedoStack((prevRedoStack) => {
      if (prevRedoStack.length === 0) return prevRedoStack;
      const lastUndone = prevRedoStack[0];
      setLines(
        (
          prevLines: {
            tool: string;
            color: string;
            strokeWidth: number;
            points: number[];
          }[]
        ) => [...prevLines, lastUndone]
      );
      return prevRedoStack.slice(1);
    });
  };

  // Clear all elements from the canvas
  const handleClear = () => {
    setLines([]);
    setTexts([]);
    setArrows([]);
    setRedoStack([]);
    setIsClearModalOpen(false);
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
  const ZOOM_STEP = 0.1;
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 3;

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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(e.target.value));
  };

  // Start drawing
  const handleMouseDown = useCallback(() => {
    handleRest();
    const stage = stageRef.current;
    const point = stage?.getPointerPosition();
    if (!point || !stage) return;

    const scale = stage.scaleX(); // Assume uniform scaling
    const offsetX = stage.x();
    const offsetY = stage.y();

    // Translate pointer position to canvas coordinates
    const translatedPoint = {
      x: (point.x - (offsetX ?? 0)) / (scale ?? 1),
      y: (point.y - (offsetY ?? 0)) / (scale ?? 1),
    };

    setRedoStack([]); // Clear redo stack on new action

    if (tool === 'pen' || tool === 'eraser') {
      isDrawing.current = true;
      setLines(
        (
          prevLines: {
            tool: string;
            id: string;
            type: string;
            color: string;
            strokeWidth: number;
            points: number[];
          }[]
        ) => [
          ...prevLines,
          {
            tool,
            id: `${Date.now()}`,
            type: 'pen',
            color,
            strokeWidth: allSize,
            points: [translatedPoint.x, translatedPoint.y],
          },
        ]
      );
    }

    if (tool === 'line') {
      isDrawing.current = true;
      setArrows(
        (
          prevArrows: {
            id: string;
            type: string;
            color: string;
            strokeWidth: number;
            points: number[];
          }[]
        ) => [
          ...prevArrows,
          {
            id: `${Date.now()}`,
            type: 'arrow',
            color,
            strokeWidth: allSize,
            points: [
              translatedPoint.x,
              translatedPoint.y,
              translatedPoint.x,
              translatedPoint.y,
            ], // Start and end at the same point initially
          },
        ]
      );
    }

    if (tool === 'text') {
      // Text logic remains the same
      const newText = {
        id: `${Date.now()}`,
        type: 'text',
        text: 'Double click to edit',
        x: translatedPoint.x,
        y: translatedPoint.y,
        fontSize: allSize,
        color: color,
      };

      setTexts(
        (
          prevTexts: {
            id: string;
            type: string;
            text: string;
            x: number;
            y: number;
            fontSize: number;
            color: string;
          }[]
        ) => [...prevTexts, newText]
      );
      setTool('default'); // Switch tool after adding text
    }
  }, [tool, color, allSize]);

  // Continue drawing
  const handleMouseMove = useCallback(() => {
    if (!isDrawing.current) return;

    const stage = stageRef.current;
    const point = stage?.getPointerPosition();
    if (!point || !stage) return;

    const scale = stage.scaleX(); // Assume uniform scaling
    const offsetX = stage.x();
    const offsetY = stage.y();

    const translatedPoint = {
      x: (point.x - (offsetX ?? 0)) / (scale ?? 1),
      y: (point.y - (offsetY ?? 0)) / (scale ?? 1),
    };

    if (tool === 'pen' || tool === 'eraser') {
      setLines(
        (
          prevLines: {
            tool: string;
            color: string;
            strokeWidth: number;
            points: number[];
          }[]
        ) => {
          const lastLine = prevLines[prevLines.length - 1];
          const updatedLine = {
            ...lastLine,
            points: [...lastLine.points, translatedPoint.x, translatedPoint.y],
          };
          return [...prevLines.slice(0, -1), updatedLine];
        }
      );
    }

    if (tool === 'line') {
      setArrows(
        (
          prevArrows: {
            id: string;
            color: string;
            strokeWidth: number;
            points: number[];
          }[]
        ) => {
          const lastArrow = prevArrows[prevArrows.length - 1];
          if (!lastArrow) return prevArrows;

          const updatedArrow = {
            ...lastArrow,
            points: [
              lastArrow.points[0],
              lastArrow.points[1],
              translatedPoint.x,
              translatedPoint.y,
            ],
          };

          return [...prevArrows.slice(0, -1), updatedArrow];
        }
      );
    }
  }, [tool]);

  // End drawing
  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
    if (tool === 'line') {
      setTool('default');
    }
  }, [tool]);

  const handleRest = () => {
    setSelectedTextId(null);
    setSelectedElementId(null);
  };

  const clickTimeout = useRef<number | null>(null);

  const handleTextClick = useCallback(
    (id: string) => {
      if (tool !== 'default') return;
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }

      clickTimeout.current = window.setTimeout(() => {
        setSelectedTextId(id);
        clickTimeout.current = null;
      }, DOUBLE_CLICK_DELAY);
    },
    [tool]
  );

  const handleDblTextClick = useCallback(
    (id: string, currentText: string) => {
      if (tool !== 'default') return;
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }

      setSelectedTextId(id);
      setTempText(currentText);
      setIsEditingText(true);
    },
    [tool]
  );

  const handleTextEdit = () => {
    if (selectedTextId) {
      setTexts(
        (
          prevTexts: {
            id: string;
            text: string;
            x: number;
            y: number;
            fontSize: number;
            color: string;
          }[]
        ) =>
          prevTexts.map((text) =>
            text.id === selectedTextId ? { ...text, text: tempText } : text
          )
      );
      setIsEditingText(false);
    }
  };

  const handleElementClick = useCallback(
    (id: string, elementType: string) => {
      if (tool !== 'default') return;
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }

      console.log(id);
      setSelectedElementId(id);
      setSelectedElementType(elementType);
    },
    [tool]
  );

  useEffect(() => {
    const handelItemDelete = () => {
      if (selectedTextId) {
        setTexts(
          (
            prevTexts: {
              id: string;
              text: string;
              x: number;
              y: number;
              fontSize: number;
              color: string;
            }[]
          ) => prevTexts.filter((text) => text.id !== selectedTextId)
        );
        setSelectedTextId(null);
      }

      if (selectedElementId) {
        switch (selectedElementType) {
          case 'arrow':
            setArrows(
              (
                prevArrows: {
                  id: string;
                  color: string;
                  strokeWidth: number;
                  points: number[];
                }[]
              ) => prevArrows.filter((arrow) => arrow.id !== selectedElementId)
            );
            break;

          case 'pen':
            setLines(
              (
                prevLines: {
                  id: string;
                  color: string;
                  strokeWidth: number;
                  points: number[];
                }[]
              ) => prevLines.filter((line) => line.id !== selectedElementId)
            );
            break;

          default:
            console.warn('Unknown element type:', selectedElementType);
        }

        setSelectedElementId(null); // Clear the selected element ID after handling
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      switch (!isEditingText) {
        case e.ctrlKey && e.key.toLowerCase() === 'z':
          handleUndo(); // Call the undo function
          break;
        case e.ctrlKey && e.key.toLowerCase() === 'x':
          handleRedo(); // Call the redo function
          break;
        case e.ctrlKey && e.key.toLowerCase() === 's':
          e.preventDefault(); // Prevent the default save action
          handleDownload(); // Call the download function
          break;
        case e.key.toLowerCase() === 'c':
          if (lines.length > 0 || texts.length > 0 || arrows.length > 0) {
            setIsClearModalOpen(true); // Open the clear modal
          }
          break;
        case e.key.toLowerCase() === 'escape':
          setShowTips(false); // Close the tips modal
          break;
        case e.key.toLowerCase() === '?':
          setShowTips(true); // Open the tips modal
          break;
        case e.key.toLowerCase() === 'delete':
          handelItemDelete(); // Delete the selected text
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [
    isEditingText,
    selectedTextId,
    arrows.length,
    lines.length,
    texts.length,
    selectedElementType,
    selectedElementId,
  ]);

  const handleDownload = () => {
    if (stageRef.current) {
      const stage = stageRef.current;
      const scale = stage.scaleX(); // Assuming uniform scaling for both X and Y
      const position = stage.position();
      const stageWidth = stage.width();
      const stageHeight = stage.height();

      // Create a temporary layer for the white background
      const whiteBgLayer = new Konva.Layer();

      // Adjust the rectangle to cover the scaled and panned canvas
      const whiteBgRect = new Konva.Rect({
        x: -position.x / scale, // Adjust for panning and scaling
        y: -position.y / scale,
        width: stageWidth / scale, // Scale the width and height
        height: stageHeight / scale,
        fill: 'white',
      });

      whiteBgLayer.add(whiteBgRect);

      // Temporarily add the white background to the stage
      stage.add(whiteBgLayer);
      whiteBgLayer.moveToBottom(); // Ensure it's at the bottom

      // Generate the data URL with the white background
      const dataURL = stage.toDataURL({ pixelRatio: 2 }); // Higher pixelRatio for better quality

      // Remove the temporary white background layer
      whiteBgLayer.destroy();

      // Trigger the download
      const link = document.createElement('a');
      link.download = 'canvas-image.png';
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full relative overflow-hidden"
      style={{ cursor: getCursor() }}
    >
      <DrawToolsBox
        tool={tool}
        setTool={setTool}
        isKeyboardShortcutsDisable={isEditingText}
      />

      <Share
        isOpen={isShareOpen}
        onClick={() => setIsShareOpen(!isShareOpen)}
        className="fixed top-10 right-12"
      >
        <ShareButton
          onClick={handleDownload}
          className="flex gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md"
        >
          <AiFillFileImage
            className="text-blue-500 text-2xl"
            title="Export as Image"
          />
        </ShareButton>
      </Share>

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        color="white"
        draggable={tool === 'hand'}
        onWheel={handleWheel} // Attach wheel event for zoom
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onClick={handleRest}
        onContextMenu={(e) => e.evt.preventDefault()} // Prevent context menu
      >
        <Layer>
          {lines.map(
            (line: {
              tool: string;
              id: string;
              color: string;
              strokeWidth: number;
              points: number[];
              type: string;
            }) => (
              <Line
                key={line.id}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
                onClick={(e) => {
                  e.cancelBubble = true; // Prevent stage click event
                  handleElementClick(line.id, line.type);
                }}
              />
            )
          )}

          {/* Render Arrows */}
          {arrows.map(
            (arrow: {
              id: string;
              color: string;
              strokeWidth: number;
              points: number[];
              type: string;
            }) => (
              <Arrow
                type={arrow.type}
                key={arrow.id}
                points={arrow.points}
                stroke={arrow.color}
                strokeWidth={arrow.strokeWidth}
                pointerLength={200} // Length of the arrowhead
                pointerWidth={120} // Width of the arrowhead
                lineCap="round"
                lineJoin="round"
                onClick={(e) => {
                  e.cancelBubble = true; // Prevent stage click event
                  handleElementClick(arrow.id, arrow.type);
                }}
              />
            )
          )}

          {texts.map(
            (text: {
              id: string;
              type: string;
              text: string;
              x: number;
              y: number;
              fontSize: number;
              color: string;
            }) => (
              <React.Fragment key={text.id}>
                {/* Conditional dashed border */}
                {selectedTextId === text.id && (
                  <Rect
                    x={text.x - 5} // Slight padding around the text
                    y={text.y - 5}
                    width={text.text.length * text.fontSize * 0.6} // Estimate text width
                    height={text.fontSize + 8} // Adjust to fit the text height
                    stroke="blue"
                    strokeWidth={1}
                    dash={[4, 4]} // Dashed border
                    listening={false} // Make it non-interactive
                  />
                )}
                {/* Actual text */}
                <KonvaText
                  key={text.id}
                  type={text.type}
                  text={text.text}
                  fontSize={text.fontSize}
                  x={text.x}
                  y={text.y}
                  draggable
                  fill={text.color}
                  onClick={() => handleTextClick(text.id)}
                  onDblClick={() => handleDblTextClick(text.id, text.text)}
                  onDragEnd={(e) => {
                    const newX = e.target.x();
                    const newY = e.target.y();
                    setTexts(
                      (
                        prevTexts: {
                          id: string;
                          text: string;
                          x: number;
                          y: number;
                          fontSize: number;
                          color: string;
                        }[]
                      ) =>
                        prevTexts.map((t) =>
                          t.id === text.id ? { ...t, x: newX, y: newY } : t
                        )
                    );
                  }}
                />
              </React.Fragment>
            )
          )}
        </Layer>
      </Stage>

      <DrawToolsSettings
        setAllSize={setAllSize}
        allSize={allSize}
        setColor={setColor}
        color={color}
        isKeyboardShortcutsDisable={isEditingText}
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
          className={` text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all ${
            lines.length === 0 && texts.length === 0 && arrows.length === 0
              ? 'bg-gray-400 hover:bg-gray-400'
              : 'bg-red-500'
          }`}
          onClick={() => setIsClearModalOpen(true)}
          disabled={
            lines.length === 0 && texts.length === 0 && arrows.length === 0
          }
          aria-label="Clear Canvas"
          title="Clear Canvas"
        >
          <FaTrash size={18} />
        </button>
      </div>

      <div className="fixed bottom-4 left-4">
        <button
          className=" bg-blue-500 text-white w-12 h-8 rounded-sm  shadow-md hover:bg-blue-600 transition-all"
          onClick={() => setShowTips(true)}
          aria-label="Show Keyboard Shortcuts"
          title="Show Keyboard Shortcuts"
        >
          ?
        </button>
      </div>

      <Tips showTips={showTips} setShowTips={setShowTips} />

      {/* Modal for Clear Confirmation */}
      <Modal
        title="Clear Canvas"
        isOpen={isClearModalOpen}
        onClose={handleCLoseClearModal}
        titleClassName="text-red-500"
      >
        <p
          className="text-gray-700"
          style={{ textAlign: 'center', margin: '1rem 0' }}
        >
          Are you sure you want to clear the canvas?
        </p>
        <div className="flex gap-2">
          <ModalButton onClick={handleCLoseClearModal}>Cancel</ModalButton>
          <ModalButton
            className="bg-red-500 hover:bg-red-600"
            onClick={handleClear}
          >
            Clear
          </ModalButton>
        </div>
      </Modal>

      {/* Modal for Text Editing */}
      <Modal title="" isOpen={isEditingText} onClose={handleCLoseEditTextModal}>
        <ModalInput
          placeholder="Enter text here"
          value={tempText || ''}
          onChange={(e) => setTempText(e.target.value)}
          onEnter={handleTextEdit}
        />
        <div className="flex gap-2">
          <ModalButton
            className="bg-red-500 hover:bg-red-600"
            onClick={handleCLoseEditTextModal}
          >
            Cancel
          </ModalButton>
          <ModalButton onClick={handleTextEdit}>Update</ModalButton>
        </div>
      </Modal>
    </div>
  );
};

export default DrawBoard;
