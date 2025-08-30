export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} HotelBooking. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-red-500">Privacy</a>
            <a href="#" className="hover:text-red-500">Terms</a>
            <a href="#" className="hover:text-red-500">Contact</a>
          </div>
        </div>
      </footer>
    );
  }

  