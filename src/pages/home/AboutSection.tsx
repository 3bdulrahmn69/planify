import { Section, Title, Description } from '../../components/Section';

const AboutSection = () => {
  return (
    <Section
      id="about"
      className="bg-gray-100 h-screen flex flex-col justify-center items-center text-center"
    >
      <Title className="text-blue-600 text-4xl mb-4">About Us</Title>
      <Description className="text-center text-blue-500 mb-6">
        Learn more about our mission and values.
      </Description>
      <p className="text-gray-700 mb-4 max-w-2xl">
        At Planify, we are committed to helping individuals manage their tasks
        efficiently and effectively. Our mission is to provide a simple,
        user-friendly platform that empowers you to take control of your
        personal and professional life. We believe that organization is key to
        success, and our tools are designed to help you achieve your goals.
      </p>
      <p className="text-gray-700 mb-4 max-w-2xl">Our core values include:</p>
      <ul className="text-left text-gray-600 mb-6 max-w-2xl mx-auto">
        <li>✅ User-Centric Design</li>
        <li>✅ Continuous Improvement</li>
        <li>✅ Community Engagement</li>
        <li>✅ Transparency and Integrity</li>
      </ul>
      <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition duration-300">
        Join Us Today
      </button>
    </Section>
  );
};

export default AboutSection;
