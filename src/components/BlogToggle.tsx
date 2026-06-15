import React from 'react';
import { EXTERNAL_LINKS } from '../config';

const BlogToggle: React.FC = () => {
  const openBlog = () => {
    window.open(EXTERNAL_LINKS.blog, '_blank');
  };

  return (
    <button
      onClick={openBlog}
      className="text-xs tracking-widest text-gray-500 hover:text-black dark:hover:text-white uppercase transition-colors duration-200"
      aria-label="Blog"
    >
      Blog
    </button>
  );
};

export default BlogToggle;
