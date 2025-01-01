import { Link } from 'react-router-dom';
import planify from '../../assets/planify.png';
import planify2 from '../../assets/planify2.png';

const HeroSection = () => {
  return (
    <section
      id="home"
      className="w-full h-[calc(100vh-80px)] flex items-center justify-around bg-gradient-to-b from-gray-50 to-gray-200"
    >
      {/* Text and Call to Action */}
      <div className="w-11/12 md:w-3/12 h-3/4 flex flex-col justify-center">
        <h1 className="text-5xl pb-2 font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block leading-tight">
          Planify
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Your personal task manager to help you stay organized and productive.
        </p>
        <Link
          to="/login"
          className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all w-fit text-base shadow-lg"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className="md:w-4/12 h-3/4 hidden md:flex flex-col gap-4">
        {/* Top Feature */}
        <div className="w-full h-1/3 bg-slate-700 rounded-lg flex items-center justify-center text-white border-4 border-black shadow-md">
          <img
            src={planify}
            alt="planify"
            className="w-full h-full rounded-lg object-fit"
          />
        </div>
        {/* Bottom Features */}
        <div className="w-full h-2/3 flex justify-between gap-4">
          <div className="w-5/12 h-full bg-blue-400 rounded-lg flex items-center justify-center text-white shadow-md border-4 border-blue-400 ">
            <img
              src={planify2}
              alt="planify"
              className="w-full h-full rounded-lg object-fit"
            />
          </div>
          <div className="w-5/12 h-full bg-blue-400 rounded-lg flex items-center justify-center text-white p-4 shadow-md">
            <p className="text-center">Visualize progress</p>
          </div>
        </div>
      </div>

      {/* Promo or App Preview */}
      <div className="w-2/12 bg-black h-3/4 rounded-lg hidden md:flex  items-center justify-center text-white p-4 shadow-lg">
        <p className="text-center">Planify App Preview</p>
      </div>
    </section>
  );
};

export default HeroSection;
