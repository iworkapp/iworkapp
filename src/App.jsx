import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Admin from './pages/Admin.jsx'
import Board from './pages/Board.jsx'
import CapitalFlow from './pages/CapitalFlow.jsx'
import Docs from './pages/Docs.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Payouts from './pages/Payouts.jsx'
import Tweet from './pages/Tweet.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="board" element={<Board />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="capital-flow" element={<CapitalFlow />} />
          <Route path="docs" element={<Docs />} />
          <Route path="tweet" element={<Tweet />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
