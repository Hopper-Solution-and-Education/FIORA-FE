import FaqsList from '../organisms/FaqsList';
import FaqsSectionHeader from '../atoms/FaqsSectionHeader';

interface MostViewedSectionProps {
  faqs: any[];
  isLoading: boolean;
}

const MostViewedSection = ({ faqs, isLoading }: MostViewedSectionProps) => {
  return (
    <section>
      <FaqsSectionHeader
        title="Most Popular FAQs"
        subtitle={faqs.length > 0 ? `Showing ${faqs.length} most viewed FAQs` : undefined}
      />

      <FaqsList faqs={faqs} isLoading={isLoading} error="" />
    </section>
  );
};

export default MostViewedSection;
