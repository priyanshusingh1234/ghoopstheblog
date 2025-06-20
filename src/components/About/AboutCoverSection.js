import Image from 'next/image';
import React from 'react';
import profileCharacter from '../../../public/character.png';
import person1 from '../../../public/1000013352.jpg'; // Replace with actual images
import person2 from '../../../public/1000013190.jpg';
import person3 from '../../../public/169.jpg';

const AboutCoverSection = () => {
  return (
    <>
      <section className='w-full md:h-[75vh] border-b-2 border-solid border-dark dark:border-light flex flex-col md:flex-row items-center justify-center text-dark dark:text-light'>
        <div className='w-full md:w-1/2 h-full border-r-2 border-solid border-dark dark:border-light flex justify-center'>
          <Image
            src={profileCharacter}
            alt="Indian Monkey Blog Character"
            className='w-4/5 xs:w-3/4 md:w-full h-full object-contain object-center'
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1180px) 50vw, 50vw"
          />
        </div>

        <div className='w-full md:w-1/2 flex flex-col text-left items-start justify-center px-5 xs:p-10 pb-10 lg:px-16'>
          <h2 className='font-bold capitalize text-4xl xs:text-5xl sxl:text-6xl text-center lg:text-left'>
            Welcome to Ghoops! The Blog
          </h2>
          <p className='font-medium mt-4 text-base leading-relaxed'>
            Dive into a world where curiosity meets creativity. <strong>Ghoops! The Blog</strong> is your go-to blog for insightful articles on lifestyle, technology, culture, food, and everything in between. Whether you're here to learn, explore, or simply be inspired, we bring fresh perspectives and engaging stories straight to your screen.
          </p>
        </div>
      </section>

      {/* 👇 New Section with Square Image Boxes */}
      <section className="w-full py-10 px-5 md:px-20 bg-white dark:bg-black text-dark dark:text-light">
        <h3 className="text-3xl font-semibold mb-8 text-center">Meet the Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {[
            { image: person1, name: "Harsh Kr." },
            { image: person2, name: "Nitish Sahu" },
            { image: person3, name: "Priyanshu Singh" },
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-40 h-40 md:w-48 md:h-48 border-2 border-dark dark:border-light rounded overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 font-medium text-lg">{member.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutCoverSection;
