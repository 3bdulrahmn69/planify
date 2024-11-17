import { useState } from 'react';
import { Section, Title, Description } from '../../components/Section';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="border-b border-gray-300 mb-4">
      <button
        onClick={toggleAnswer}
        className="flex justify-between w-full py-4 text-left text-blue-600 font-semibold focus:outline-none"
      >
        <span>{question}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-40' : 'max-h-0'
        }`}
      >
        <div
          className={`text-gray-700 pb-4 ${
            isOpen ? 'opacity-100' : 'opacity-0 transition-opacity duration-300'
          }`}
        >
          {answer}
        </div>
      </div>
    </div>
  );
};

const FrequentlySection = () => {
  const faqs = [
    {
      question: 'What is Planify?',
      answer:
        'Planify is a personal task manager designed to help you organize your tasks efficiently.',
    },
    {
      question: 'How do I create a new task?',
      answer:
        'Click on the "Add Task" button, enter your task details, and hit "Save".',
    },
    {
      question: 'Can I collaborate with others?',
      answer: 'No, Planify is designed for personal use only.',
    },
    {
      question: 'Is there a mobile app available?',
      answer:
        'No, at this time Planify is only available as a web application.',
    },
    {
      question: 'How do I reset my password?',
      answer:
        'Go to the login page, click on "Forgot Password", and follow the instructions.',
    },
    {
      question: 'Can I delete my account?',
      answer:
        'Yes, you can delete your account by going to the settings page and selecting "Delete Account".',
    },
  ];

  return (
    <Section id="faq" className="bg-gray-100 py-8">
      <Title className="text-blue-600">FAQs</Title>
      <Description className="text-center text-blue-500 mb-6">
        Find answers to common questions.
      </Description>
      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </Section>
  );
};

export default FrequentlySection;
