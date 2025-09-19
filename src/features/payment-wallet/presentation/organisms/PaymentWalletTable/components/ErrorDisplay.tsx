interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-md">
      <p className="text-red-600">Error: {error}</p>
    </div>
  );
};

export default ErrorDisplay;
