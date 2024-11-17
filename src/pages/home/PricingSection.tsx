import { Section, Title, Description } from '../../components/Section';
import PricingBox from './components/PricingBox';

const PricingSection = () => {
  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        'Basic Features',
        'Email Support',
        'Limited Storage',
        'Access to Community Forums',
      ],
      buttonStyle:
        'bg-gradient-to-r from-gray-300 to-gray-600 hover:bg-gradient-to-l',
    },
    {
      name: 'Pro',
      price: '$20/month',
      features: [
        'Advanced Features',
        'Priority Support',
        '500 GB Storage',
        'Collaborative Tools',
        'Custom Integrations',
      ],
      buttonStyle: 'gradient-move',
    },
    {
      name: 'Enterprise',
      price: '$50/month',
      features: [
        'All Features',
        'Dedicated Support',
        'Unlimited Storage',
        'Advanced Security',
        'Customizable Workflows',
      ],
      buttonStyle:
        'bg-gradient-to-r from-red-300 to-red-700 hover:bg-gradient-to-l',
    },
  ];

  return (
    <Section id="pricing" className="bg-gray-100 py-8">
      <Title className="text-blue-600 text-4xl">Pricing</Title>
      <Description className="text-center text-blue-500 mb-8">
        Choose a plan that works best for you.
      </Description>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <PricingBox
            key={index}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            buttonStyle={plan.buttonStyle}
          />
        ))}
      </div>
    </Section>
  );
};

export default PricingSection;
