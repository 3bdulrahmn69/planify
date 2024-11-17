import Logo from '../../../components/Logo';
import UserDropdown from '../../../components/UserDropdown';

const BoardHeader = () => {
  return (
    <header className="w-full max-w-4xl mt-4 p-4 flex justify-between items-center rounded-md shadow-md glass fixed">
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      <UserDropdown />
    </header>
  );
};

export default BoardHeader;
