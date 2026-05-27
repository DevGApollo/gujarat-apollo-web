import React from 'react';
import Hero from '../components/Hero';
import HomeSections from '../components/HomeSections'; // <-- Yeh line upar add karein

const Home = () => {
  return (
    <div>
      <Hero />
      <HomeSections /> {/* <-- Hero ke thik niche naye saare sections chalenge */}
    </div>
  );
};

export default Home;