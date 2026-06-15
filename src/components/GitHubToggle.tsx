import React from 'react';
import { EXTERNAL_LINKS } from '../config';

const GitHubToggle: React.FC = () => {
  const openGitHub = () => {
    window.open(EXTERNAL_LINKS.github, '_blank');
  };

  return (
    <button
      onClick={openGitHub}
      className="text-xs tracking-widest text-gray-500 hover:text-black dark:hover:text-white uppercase transition-colors duration-200"
      aria-label="GitHub"
    >
      GitHub
    </button>
  );
};

export default GitHubToggle;
