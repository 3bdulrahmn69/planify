const SpinnerFullPage = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
};

export default SpinnerFullPage;
