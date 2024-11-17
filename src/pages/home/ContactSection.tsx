import { Section, Title, Description } from '../../components/Section';

const ContactSection = () => {
  return (
    <Section id="contact" className="bg-gray-100 h-screen flex flex-col">
      <div className="text-center py-8">
        <Title className="text-blue-600 text-4xl mb-4">Contact Us</Title>
        <Description className="text-center text-blue-500 mb-6">
          Get in touch with us for any queries or feedback.
        </Description>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center max-w-6xl mx-auto space-y-8 md:space-y-0 md:space-x-8">
        {/* Left Side: Contact Info */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-mdl">
          <h3 className="text-xl font-bold text-blue-600 mb-4">
            Contact Information
          </h3>
          <p className="text-gray-700 mb-2">
            Email:{' '}
            <a
              href="mailto:suppoort@planify.com"
              className="text-blue-500 hover:underline"
            >
              suppoort@planify.com
            </a>
          </p>
          <p className="text-gray-700 mb-2">
            Phone: <span className="text-blue-500">(123) 456-7890</span>
          </p>
          <p className="text-gray-700 mb-2">
            Address: <span className="text-blue-500">Some place, Egypt</span>
          </p>
        </div>

        {/* Right Side: Contact Form */}
        <div className="flex-1 flex justify-center items-center p-6">
          <form className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              Send Us a Message
            </h3>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-6 rounded hover:bg-gradient-to-l transition duration-300 w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default ContactSection;
