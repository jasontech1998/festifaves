"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const features = [
  "Seamlessly integrates with your Spotify account",
  "Customized playlists based on festival lineups",
  "Discover new tracks from your favorite artists"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

const AnimatedFeatureList: React.FC = () => {
  return (
    <motion.ul 
      className="text-left list-none space-y-4 mb-8 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.li 
          key={index} 
          className="flex items-start"
          variants={itemVariants}
        >
          <Check className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0 text-[#1DB954]" />
          <span className="mt-0.5">
            {feature}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default AnimatedFeatureList;