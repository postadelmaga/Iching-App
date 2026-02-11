import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Oracle from './pages/Oracle';
import Journal from './pages/Journal';
import ReadingDetails from './pages/ReadingDetails';
import Book from './pages/Book';
import HexagramDetail from './pages/HexagramDetail';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/oracle" element={<Oracle />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/reading/:id" element={<ReadingDetails />} />
          <Route path="/hexagram/:id" element={<HexagramDetail />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}