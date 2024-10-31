import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import ProtectedRoute from './routing/ProtectedRoute';
import NotFound from './routing/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home/>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
