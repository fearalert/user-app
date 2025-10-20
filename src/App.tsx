/** @format */

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { UIProvider } from './contexts/UIContext';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
