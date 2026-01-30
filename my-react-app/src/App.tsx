// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './page/home';
import About from './page/about';
import Task from './page/task';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/task" element={<Task />} />
      </Routes>
    </div>
  );
}

export default App;