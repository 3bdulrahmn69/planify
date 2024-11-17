import { cn } from '../../../lib/utils';

interface PlanProps {
  name: string;
  price: string;
  features: string[];
  buttonStyle?: string;
}

const PricingBox = ({ name, price, features, buttonStyle }: PlanProps) => {
  return (
    <div className="border border-gray-300 rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <h2 className="text-xl font-bold text-blue-600 mb-2">{name}</h2>
      <p className="text-2xl font-semibold text-blue-800 mb-4">{price}</p>
      <ul className="flex-grow mt-4 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="text-gray-700 flex items-center mb-2">
            <span className="mr-2">✓</span> {feature}
          </li>
        ))}
      </ul>
      <button
        className={cn(
          'mt-4 w-full text-white py-2 rounded transition duration-300',
          buttonStyle
        )}
      >
        Choose Plan
      </button>
    </div>
  );
};

export default PricingBox;
