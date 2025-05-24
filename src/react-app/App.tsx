import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Test from './pages/test';
import Home from './pages/innerpage/home';
import Stats from './pages/innerpage/stats';
import Adscontrol from './pages/innerpage/adscontrol';
import Thumbnailcontrol from './pages/innerpage/thumbnail';
import ProtectedRoute from './utils/security';
import "./style/tailwind.css";

// ProtectedRoute component to restrict access to authenticated users

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="welcome" element={<Home />} />
            <Route path="stats" element={<Stats />} />
            <Route path="adscontrol" element={<Adscontrol />} />
            <Route path="thumbnails" element={<Thumbnailcontrol />} />
          </Route>
        </Route>
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}