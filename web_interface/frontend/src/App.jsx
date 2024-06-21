import React from "react"
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ManualPage from './components/manual';
import AutomaticPage from './components/automatic';


function App() {

  return (<>
  <Router>
  <div>
  <header className="min-h-screen">
    <div className="flex justify-center items-center h-full p-5">
      <div className="bg-gray-100 border-2 border-black inline-block p-5 rounded-[15px] hover:shadow-2xl hover:shadow-black-1000">
      <h className="font-bold text-5xl font-serif">CPU Scheduler</h>
      </div>
      </div>
      <nav className="">
        <div className="p-2 flex justify-around">
        <Link to="/manual" className="p-2 inline-block  bg-gray-100 border-2 border-black rounded-full hover:shadow-2xl hover:shadow-black-1000 hover:cursor-pointer">
          <p  className="font-serif text-lg px-3">Manual</p>
          </Link>
        <Link to="/automatic" className="p-2 inline-block  bg-gray-50 border-2 border-black rounded-full hover:shadow-2xl hover:shadow-black-1000 hover:cursor-pointer">
          <p className="font-serif text-lg">Automatic</p>
          </Link>
        </div>
      </nav>
      <hr className="border-2 border-black"></hr>
      <Routes>
          <Route path="/" element={<Navigate to="/manual" replace />} />
          <Route path="/manual" element={<ManualPage />} />
          <Route path="/automatic" element={<AutomaticPage/>} />
      </Routes>
  </header>
  </div>
  </Router>
  </>
  )
}

export default App
