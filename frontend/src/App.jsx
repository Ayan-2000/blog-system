import React from "react"
import { Routes, Route } from "react-router-dom"
import Nav from "./components/Nav.jsx"
import Home from "./pages/Home.jsx"
import SignIn from "./pages/SignIn.jsx"
import SignUp from "./pages/SignUp.jsx"
import PostDetail from "./pages/PostDetail.jsx"
import CreateEditPost from "./pages/CreateEditPost.jsx"
import AdminPanel from "./pages/AdminPanel.jsx"

// Export backend server URL for port 6004
export const serverUrl = "http://localhost:6004"

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff9f6]">
      {/* Navigation Bar */}
      <Nav />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/create-post" element={<CreateEditPost />} />
          <Route path="/edit-post/:id" element={<CreateEditPost />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

    </div>
  )
}

export default App
