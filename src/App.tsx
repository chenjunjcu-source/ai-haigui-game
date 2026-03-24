import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Result from './pages/Result'
import Room from './pages/Room'
import Welcome from './pages/Welcome'
import HallEntry from './pages/HallEntry'
import LeaderboardPage from './pages/LeaderboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-100">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/gate" element={<Navigate to="/" replace />} />
          <Route path="/hall" element={<HallEntry />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/result" element={<Result />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

