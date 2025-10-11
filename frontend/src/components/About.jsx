import React from 'react';
import Navbar from './UI/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-900 mb-8 text-center">About Us</h1>
          <div className="bg-primary-100 shadow-lg rounded-lg p-8">
            <p className="text-lg text-primary-700 mb-6">
              Welcome to Foodie, your ultimate destination for discovering and booking the best restaurants in town.
              We are passionate about connecting food lovers with exceptional dining experiences.
            </p>
            <p className="text-lg text-primary-700 mb-6">
              Our platform allows you to explore a wide variety of cuisines, read reviews from fellow diners,
              and make reservations with ease. Whether you're planning a romantic dinner, a family gathering,
              or a quick bite, we've got you covered.
            </p>
            <p className="text-lg text-primary-700">
              At Foodie, we believe that great food brings people together. Join our community and embark on
              a culinary journey like no other.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

      export default About;
