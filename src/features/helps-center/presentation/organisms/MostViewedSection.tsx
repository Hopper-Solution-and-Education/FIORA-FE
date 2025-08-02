import FaqsList from '../molecules/FaqsList';

interface MostViewedSectionProps {
  faqs: any[];
  isLoading: boolean;
}

const MostViewedSection = ({ faqs, isLoading }: MostViewedSectionProps) => {
  return (
    <section className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-2">Most Popular FAQs</h3>

      <FaqsList faqs={faqs} isLoading={isLoading} error="" showCategory={true} />
    </section>
  );
};

export default MostViewedSection;
