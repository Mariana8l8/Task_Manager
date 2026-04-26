import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Admin from './pages/Admin';
import RoleRoute from './components/RoleRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={(
            <RoleRoute>
              <Tasks />
            </RoleRoute>
          )}
        />
        <Route
          path="/admin"
          element={(
            <RoleRoute requiredRole="admin">
              <Admin />
            </RoleRoute>
          )}
        />
        <Route path="/" element={<Navigate to="/tasks" />} />
      </Routes>
    </Router>
  );
}

export default App;
