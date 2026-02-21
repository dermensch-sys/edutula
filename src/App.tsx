import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Theory from './pages/Theory';
import TaskAnalysis from './pages/TaskAnalysis';
import TaskBase from './pages/TaskBase';
import HomeworkCheck from './pages/HomeworkCheck';
import NeuroExaminer from './pages/NeuroExaminer';
import Consultant from './pages/Consultant';
import AIFundamentals from './pages/AIFundamentals';
import FileSystemCourse from './pages/FileSystemCourse';
import RationalExpressionsCourse from './pages/RationalExpressionsCourse';
import ProbabilityTheoryCourse from './pages/ProbabilityTheoryCourse';
import RepetitionPage from './pages/RepetitionPage';
import GamificationPage from './pages/GamificationPage';
import { authService } from './utils/auth';
import { gamificationSystem } from './utils/gamification';
import { repetitionSystem } from './utils/intervalRepetition';

function App() {
  useEffect(() => {
    // Initialize systems with current user
    const unsubscribe = authService.onAuthStateChange((user) => {
      const userId = user?.id || null;
      gamificationSystem.setCurrentUser(userId);
      repetitionSystem.setCurrentUser(userId);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/theory" element={<Theory />} />
            <Route path="/analysis" element={<TaskAnalysis />} />
            <Route path="/tasks" element={<TaskBase />} />
            <Route path="/homework" element={<HomeworkCheck />} />
            <Route path="/examiner" element={<NeuroExaminer />} />
            <Route path="/consultant" element={<Consultant />} />
            <Route path="/ai-fundamentals" element={<AIFundamentals />} />
            <Route path="/file-system-course" element={<FileSystemCourse />} />
            <Route path="/rational-expressions-course" element={<RationalExpressionsCourse />} />
            <Route path="/probability-theory-course" element={<ProbabilityTheoryCourse />} />
            <Route path="/repetition" element={<RepetitionPage />} />
            <Route path="/gamification" element={<GamificationPage />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;