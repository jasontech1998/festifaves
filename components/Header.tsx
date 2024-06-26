import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="p-8">
      <nav>
        <Link href="/" className="text-3xl font-bold text-white hover:text-gray-300 transition-colors">
          FestiFaves
        </Link>
      </nav>
    </header>
  );
};

export default Header;