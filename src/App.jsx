// ============================================================================
//  src/App.jsx  —  the route table: which component shows for which URL
// ============================================================================
//
//  Every page of the site is a component in src/pages/. This file couples
//  each URL `path` to the `element` (component) that should be shown there.
//
//    • `index` marks the default page for a path segment, so <Home /> shows
//      at "/" and <Projects /> shows at "/projects".
//    • ":slug" is a DYNAMIC SEGMENT: "/projects/tinyrenderer" and
//      "/projects/parcel-board" both match "projects/:slug". The page reads
//      the actual value with the useParams hook.
//    • path="*" matches anything not listed above — the "not found" page.
//
//  <Layout> wraps the routes, so the header, footer and animated background
//  stay on screen while only the page in the middle changes.
//
//  HOW TO ADD A TOP-LEVEL PAGE: create a component in src/pages/, add a
//  <Route> for it here and a nav link in components/layout/Header.jsx.
// ============================================================================

import { Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Research from './pages/Research';
import ResearchDetail from './pages/ResearchDetail';
import NotFound from './pages/NotFound';
import MotionProvider from './features/preferences/MotionProvider';

function App() {
  return (
    <MotionProvider>
      <Layout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          <Route path="projects">
            <Route index element={<Projects />} />
            <Route path=":slug" element={<ProjectDetail />} />
          </Route>

          <Route path="problems">
            <Route index element={<Problems />} />
            <Route path=":slug" element={<ProblemDetail />} />
          </Route>

          <Route path="research">
            <Route index element={<Research />} />
            <Route path=":slug" element={<ResearchDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </MotionProvider>
  );
}

export default App;
