interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'No payment wallet transactions found' }: EmptyStateProps) => {
  return (
    <div className="w-[70vw] flex items-center justify-center h-10 text-gray-500">
      <p className="w-full text-center">{message}</p>
    </div>
  );
};

export default EmptyState;
