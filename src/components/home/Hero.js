import React from 'react';
import { motion } from 'framer-motion';
import GridGameAnimation from './GridGameAnimation';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-start pb-10 overflow-hidden bg-background" style={{ paddingTop: '150px' }}>
      {/* Grid Game Animation */}
      <GridGameAnimation />
 {/* Hero Content */}
      <div className="container mx-auto px-6 z-10 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center mb-2">
          <img
            src="/butterfly.gif"
            alt="AtlasMoth butterfly animation"
            className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-28 xl:h-28 object-contain drop-shadow-xl"
            draggable="false"
          />
        </div>
        <motion.div 
          className="flex flex-col items-center space-y-4 text-center"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="block text-white">Elevating UX With The Magic Of</span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-[8px] text-center">Gamification</span>
          </h1>

          <h2 className="font-display text-[#FBF7BA] italic text-center w-full mx-auto" style={{ fontSize: '15px' }}>
            <span className="md:text-[18px]">Duolingo for Design & Engineering</span>
          </h2>



          <div className="flex flex-wrap gap-4 justify-center w-full pt-8">
            <motion.button 
              className="game-button flex items-center gap-2 font-bold shadow-[0_0_12px_2px_#9D1F15] border"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: '#FBF7BA', color: '#9D1F15', borderColor: '#9D1F15', padding: '40px 40px', fontSize: '25px' }}
              onClick={() => {
                window.open('mailto:kbaid@atlasmoth.com', '_blank', 'noopener noreferrer');
              }}
            >
            <span className="font-bold" style={{ fontSize: '25px' }}>Get Free UX Audit</span>
            </motion.button>
            <motion.button 
              className="game-button flex items-center gap-2 font-bold shadow-[0_0_12px_2px_#9D1F15] border"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: '#9D1F15', color: '#FBF7BA', borderColor: '#9D1F15', padding: '40px 40px', fontSize: '25px' }}
              onClick={() => {
                window.open('https://cal.com/kushagrabaid/30-minute-meeting', '_blank', 'noopener noreferrer');
              }}
            >
            <span className="font-bold" style={{ fontSize: '25px' }}>Book Your Quest</span>
            </motion.button>
          </div>


        </motion.div>


      </div>

      {/* Scroll Indicator - hidden on mobile, visible on md screens and above */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="text-text-secondary text-sm font-medium mb-2">Scroll to explore</div>
        <motion.div 
          className="w-6 h-10 border-2 border-text-secondary rounded-full flex justify-center items-start p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
          }}
        >
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
