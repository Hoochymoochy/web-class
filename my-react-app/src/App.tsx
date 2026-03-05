// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import About from './page/About';
import Task from './page/Task';
import NotFound from './page/NotFound';
import Grainient from './Components/Grainient';
import Login from './page/Login';
import Register from './page/Register';
import Team from './page/Team';
import Members from './page/Members';
import Tasks from './page/Tasks';

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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="team/task/:id" element={<Task />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/team" element={<Team />} />
        <Route path="team/members" element={<Members />} />
        <Route path="team/tasks" element={<Tasks />} />
      </Routes>

    </div>
  );
}

export default App;