// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import About from './page/About';
import Task from './page/Task';
import NotFound from './page/NotFound';
import Header from './Components/Header';
function App() {
  return (
    <div className="App">
      <Header />
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