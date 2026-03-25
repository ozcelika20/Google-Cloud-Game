import { useContext } from 'react';
import { CompetitionContext } from '../context/CompetitionContext';

export function useCompetition() {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
}

export default useCompetition;
