import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 40, color = '#3B82F6' }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default LoadingSpinner;
