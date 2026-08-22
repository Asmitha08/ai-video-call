import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CallProvider } from './context/CallContext.jsx';
import { TranslationProvider } from './context/TranslationContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import CallPage from './pages/CallPage.jsx';
import JoinPage from './pages/JoinPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CallProvider>
        <TranslationProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/join/:roomId?" element={<JoinPage />} />
            <Route path="/call/:roomId" element={<CallPage />} />
          </Routes>
        </TranslationProvider>
      </CallProvider>
    </BrowserRouter>
  );
}
