import { FC } from 'react';

type Props = { title: string };

export const SectionHeader: FC<Props> = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-orange-500" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="bg-yellow-100 p-2 rounded-full" aria-hidden>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 8a3 3 0 110-6 3 3 0 010 6z" />
        </svg>
      </div>
    </div>
  );
};

export default SectionHeader;
