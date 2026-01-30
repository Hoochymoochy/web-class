// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './page/home';
import About from './page/about';
import Task from './page/task';
import NotFound from './page/NotFound';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/task/:id" element={<Task />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;