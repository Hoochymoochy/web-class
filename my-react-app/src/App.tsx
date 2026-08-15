import { Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import About from './page/About';
import NotFound from './page/NotFound';
import Grainient from './Components/Grainient';
import Login from './page/Login';
import Register from './page/Register';
import AuthCallback from './page/AuthCallback';
import Team from './page/Team';
import Members from './page/Members';
import Tasks from './page/Tasks';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Grainient
          color1="#140F1F"
          color2="#2A145A"
          color3="#4B2A84"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/team/:teamId/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
        <Route path="/team/:teamId/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
