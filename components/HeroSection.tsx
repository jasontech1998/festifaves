"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedFeatureList from './AnimatedFeatureList';
import Login from './Login';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: custom * 0.5,
    }
  })
};

const HeroSection: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-6 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl"
        variants={itemVariants}
        custom={0}
      >
        Discover Your Festival Playlist
      </motion.h1>
      <motion.h2 
        className="scroll-m-20 pb-2 text-center text-lg tracking-tight first:mt-0 mx-8"
        variants={itemVariants}
        custom={1}
      >
        FestiFaves analyzes your festival lineup and creates a personalized
        playlist featuring your favorite artists. Get ready to groove to the
        beats you love!
      </motion.h2>
      <motion.div
        variants={itemVariants}
        custom={2}
      >
        <AnimatedFeatureList />
      </motion.div>
      <motion.div 
        variants={itemVariants}
        custom={3}
      >
        <Login />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;