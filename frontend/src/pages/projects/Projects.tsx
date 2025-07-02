import React from 'react';
import ProjectsList from './ProjectsList';

// Ce composant est maintenant juste un wrapper qui redirige vers le nouveau composant ProjectsList
// qui utilise le DataContext
const Projects: React.FC = () => {
  return <ProjectsList />;
};

export default Projects;
