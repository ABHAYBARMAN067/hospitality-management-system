import Navbar from '../UI/Navbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
