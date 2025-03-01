import Image from 'next/image';
import hopperLogo from '@public/images/logo.jpg';

const KPSSection = () => {
  return (
    <section>
      <div className="flex justify-between items-center min-h-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`w-full h-60 m-5 rounded-lg shadow-md border flex items-center justify-center relative 
          ${index % 2 === 0 ? 'mt-32' : 'mt-0'}`}
          >
            <Image
              src={hopperLogo}
              alt={`KPS ${index + 1}`}
              width={150}
              height={150}
              className="rounded-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default KPSSection;
