import React from 'react';

const ReviewForm = () => (
    <form className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow flex flex-col gap-4">
        <h3 className="text-xl font-bold mb-2 text-indigo-700">Leave a Review</h3>
        {/* Add rating stars, comment box, submit button */}
        <textarea placeholder="Your review..." required className="px-4 py-2 border rounded focus:outline-none focus:ring min-h-[80px]" />
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Submit</button>
    </form>
);

export default ReviewForm;
