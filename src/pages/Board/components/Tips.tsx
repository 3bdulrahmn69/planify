import { AiOutlineClose } from 'react-icons/ai';

const Tips = ({
  showTips,
  setShowTips,
}: {
  showTips: boolean;
  setShowTips: (show: boolean) => void;
}) => {
  const shortcuts = [
    { shortcut: 'Delete', description: 'Delete selected element' },
    { shortcut: 'T', description: 'toggle tools' },
    { shortcut: 'P', description: 'Select Pen tool' },
    { shortcut: 'E', description: 'Select Eraser tool' },
    { shortcut: 'A', description: 'Select Text tool' },
    { shortcut: 'H', description: 'Select Hand tool' },
    { shortcut: 'Space', description: 'press it to use Hand tool' },
    { shortcut: 'F', description: 'Toggle Setting' },
    { shortcut: '<', description: 'Increase the brush size' },
    { shortcut: '>', description: 'Decrease the brush size' },
    { shortcut: 'F11', description: 'Toggle full screen mode' },
    { shortcut: 'Ctrl + S', description: 'Export as image' },
    { shortcut: 'Ctrl + Z', description: 'Undo the last action' },
    { shortcut: 'Ctrl + X', description: 'Redo the last action' },
    { shortcut: 'Ctrl + C', description: 'Clear the canova' },
    { shortcut: '?', description: 'Open help tips' },
    { shortcut: 'Esc', description: 'Close the current dialog' },
  ];

  return (
    <div
      className={`${
        showTips ? 'block' : 'hidden'
      } fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center cursor-default`}
      onClick={() => setShowTips(false)}
    >
      <div
        className="relative p-6 w-96 bg-blue-600 text-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent the close from triggering when clicking inside the Tips
      >
        <button
          className="absolute top-2 right-2 bg-white text-red-600 h-6 w-6 rounded-full flex items-center justify-center"
          onClick={() => setShowTips(false)}
        >
          <AiOutlineClose />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="max-h-96 overflow-y-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-blue-700">
                <th className="px-4 py-2 border border-gray-300">Shortcut</th>
                <th className="px-4 py-2 border border-gray-300">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut, index) => (
                <tr key={index} className="odd:bg-blue-500">
                  <td className="px-4 py-2 border border-gray-300">
                    {shortcut.shortcut}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {shortcut.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tips;
