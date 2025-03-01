import BlurredShapeGray from '@public/images/blurred-shape-gray.svg';
import BlurredShape from '@public/images/blurred-shape.svg';
import FeaturesImage from '@public/images/features.png';
import Image from 'next/image';

const features = [
  {
    title: 'Expense Management',
    description:
      'Effectively track and control business expenses with smart automation. Our system provides real-time insights, helping you manage budgets, prevent overspending, and streamline financial workflows.',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path d="M0 0h14v17H0V0Zm2 2v13h10V2H2Z" />
        <path
          fillOpacity=".48"
          d="m16.295 5.393 7.528 2.034-4.436 16.412L5.87 20.185l.522-1.93 11.585 3.132 3.392-12.55-5.597-1.514.522-1.93Z"
        />
      </svg>
    ),
  },
  {
    title: 'Income Tracking',
    description:
      'Gain a clear understanding of your revenue streams. Our solution categorizes income sources, generates detailed reports, and enables businesses to forecast revenue trends with accuracy.',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path fillOpacity=".48" d="M7 8V0H5v8h2Zm12 16v-4h-2v4h2Z" />
        <path d="M19 6H0v2h17v8H7v-6H5v8h19v-2h-5V6Z" />
      </svg>
    ),
  },
  {
    title: 'Reconciliation System',
    description:
      'Ensure financial accuracy by integrating an automated reconciliation system. Identify discrepancies, validate transactions, and maintain a transparent accounting process with ease.',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path d="M23.414 6 18 .586 16.586 2l3 3H7a6 6 0 0 0-6 6h2a4 4 0 0 1 4-4h12.586l-3 3L18 11.414 23.414 6Z" />
        <path
          fillOpacity=".48"
          d="M13.01 12.508a2.5 2.5 0 0 0-3.502.482L1.797 23.16.203 21.952l7.71-10.17a4.5 4.5 0 1 1 7.172 5.437l-4.84 6.386-1.594-1.209 4.841-6.385a2.5 2.5 0 0 0-.482-3.503Z"
        />
      </svg>
    ),
  },
  {
    title: 'Reporting & Analytics',
    description:
      'Make data-driven decisions with powerful reporting tools. Our system provides customizable dashboards, financial performance reports, and predictive analytics to help you drive business growth.',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path
          fillOpacity=".48"
          d="m3.031 9.05-.593-.805 1.609-1.187.594.804a6.966 6.966 0 0 1 0 8.276l-.594.805-1.61-1.188.594-.805a4.966 4.966 0 0 0 0-5.9Z"
        />
        <path d="m7.456 6.676-.535-.845 1.69-1.07.534.844a11.944 11.944 0 0 1 0 12.789l-.535.845-1.69-1.071.536-.845a9.944 9.944 0 0 0 0-10.647Z" />
      </svg>
    ),
  },

  {
    title: 'Payment Integration',
    description:
      'Seamlessly integrate multiple payment gateways, ensuring secure and fast transactions. Our solution supports various payment methods, including online banking, credit/debit cards, and digital wallets',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path
          fillOpacity=".48"
          d="m3.031 9.05-.593-.805 1.609-1.187.594.804a6.966 6.966 0 0 1 0 8.276l-.594.805-1.61-1.188.594-.805a4.966 4.966 0 0 0 0-5.9Z"
        />
        <path d="m7.456 6.676-.535-.845 1.69-1.07.534.844a11.944 11.944 0 0 1 0 12.789l-.535.845-1.69-1.071.536-.845a9.944 9.944 0 0 0 0-10.647Z" />
      </svg>
    ),
  },

  {
    title: 'Finance Margin Optimization',
    description:
      'Maximize financial margins through intelligent analysis. Our system identifies key areas for cost reduction, profit enhancement, and strategic financial planning to increase overall efficiency.',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path
          fillOpacity=".48"
          d="m3.031 9.05-.593-.805 1.609-1.187.594.804a6.966 6.966 0 0 1 0 8.276l-.594.805-1.61-1.188.594-.805a4.966 4.966 0 0 0 0-5.9Z"
        />
        <path d="m7.456 6.676-.535-.845 1.69-1.07.534.844a11.944 11.944 0 0 1 0 12.789l-.535.845-1.69-1.071.536-.845a9.944 9.944 0 0 0 0-10.647Z" />
      </svg>
    ),
  },

  {
    title: 'Investment Management',
    description:
      'Optimize investment portfolios with data-driven insights. Our platform provides risk assessment, portfolio tracking, and growth projections to help businesses make informed investment decisions.',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path
          fillOpacity=".48"
          d="m3.031 9.05-.593-.805 1.609-1.187.594.804a6.966 6.966 0 0 1 0 8.276l-.594.805-1.61-1.188.594-.805a4.966 4.966 0 0 0 0-5.9Z"
        />
        <path d="m7.456 6.676-.535-.845 1.69-1.07.534.844a11.944 11.944 0 0 1 0 12.789l-.535.845-1.69-1.071.536-.845a9.944 9.944 0 0 0 0-10.647Z" />
      </svg>
    ),
  },

  {
    title: 'Marketing & Sales Automation',
    description:
      'Boost revenue and efficiency with automated marketing and sales tools. Our system streamlines customer engagement, campaign management, and lead conversion, driving higher ROI and business growth.',
    icon: (
      <svg
        className="mb-3 fill-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
      >
        <path
          fillOpacity=".48"
          d="m3.031 9.05-.593-.805 1.609-1.187.594.804a6.966 6.966 0 0 1 0 8.276l-.594.805-1.61-1.188.594-.805a4.966 4.966 0 0 0 0-5.9Z"
        />
        <path d="m7.456 6.676-.535-.845 1.69-1.07.534.844a11.944 11.944 0 0 1 0 12.789l-.535.845-1.69-1.071.536-.845a9.944 9.944 0 0 0 0-10.647Z" />
      </svg>
    ),
  },
];

export const FioraSystem = () => {
  return (
    <section className="mx-auto w-[90%] my-20">
      {/* Background Shapes */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShapeGray}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 md:py-20">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
            <div className="inline-flex items-center gap-3 pb-3">
              <span className="inline-flex bg-gradient-to-r from-green-500 via-green-300 to-pink-500 bg-clip-text text-2xl text-transparent">
                Advanced Controls
              </span>
            </div>
            <h2 className="bg-gradient-to-r from-green-500 via-gray-300 to-pink-500 bg-clip-text text-transparent pb-4 text-3xl font-semibold md:text-4xl">
              Built for modern product teams
            </h2>
            <p className="text-lg text-gray-500 dark:text-white-200/65">
              Open AI reads and understands your files, and with nothing more than a single line of
              feedback, so you can go further than the speed of thought.
            </p>
          </div>

          {/* Features Image */}
          <div className="flex justify-center pb-4 md:pb-12" data-aos="fade-up">
            <Image
              className="max-w-none"
              src={FeaturesImage}
              width={1104}
              height={384}
              alt="Features"
            />
          </div>

          {/* Features List */}
          <div className="mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article key={index}>
                {feature.icon}
                <h3 className="mb-1 text-[1rem] font-semibold text-green-700 dark:text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-indigo-200/65">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
