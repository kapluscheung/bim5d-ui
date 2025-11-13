import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { BIM5DDetailPage } from './components/BIM5DDetailPage';
import { BIM4DDetailPage } from './components/BIM4DDetailPage';

type View = 
  | { type: 'home' }
  | { type: '5d-detail'; scheduleId: string }
  | { type: '4d-detail'; scheduleId: string };

export default function App() {
  const [currentView, setCurrentView] = useState<View>({ type: 'home' });

  const handleSelectSchedule = (scheduleId: string, type: '5D' | '4D') => {
    if (type === '5D') {
      setCurrentView({ type: '5d-detail', scheduleId });
    } else {
      setCurrentView({ type: '4d-detail', scheduleId });
    }
  };

  const handleBack = () => {
    setCurrentView({ type: 'home' });
  };

  if (currentView.type === '5d-detail') {
    return <BIM5DDetailPage scheduleId={currentView.scheduleId} onBack={handleBack} />;
  }

  if (currentView.type === '4d-detail') {
    return <BIM4DDetailPage scheduleId={currentView.scheduleId} onBack={handleBack} />;
  }

  return <HomePage onSelectSchedule={handleSelectSchedule} />;
}
