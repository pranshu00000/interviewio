import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentView from './pages/StudentView';
import PollHistory from './pages/PollHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentView />} />
        <Route path="/history" element={<PollHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
