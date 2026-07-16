import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import ScrollToTop from "./components/ScrollToTop";

import Home from './pages/Home'
import Blog from './pages/Blog'
import SubmitFind from './pages/SubmitFind'
import About from './pages/About'
import PortugalUCH from './pages/PortugalUCH'
import Shipbuilding from './pages/Shipbuilding'
import Post from './pages/Post'
import NewPost from './pages/NewPost'
import VerifyFind from './pages/VerifyFind'
import Outreach from './pages/Outreach'
import Contacts from './pages/Contacts'
import WebDevelopmentTeam from './pages/WebDevelopmentTeam'
import ReturnToHome from './pages/ReturnToHome'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/auth/Profile'
import MyPublications from './pages/auth/MyPublications'
import SubmittedFinds from './pages/auth/SubmittedFinds'
import SubmittedPosts from './pages/auth/SubmittedPosts'

// Sites pages imports
import Artifact from './pages/sites/Artifact'
import Shipwreck from './pages/sites/Shipwreck'
import SiteDetails from './pages/sites/SiteDetails'
import ExploreCollection from './pages/sites/ExploreCollection'
import ExploreByRegion from './pages/sites/ExploreByRegion'
import Anchor from './pages/sites/Anchor'
import ArtilleryGuns from './pages/sites/ArtilleryGuns'
import Astrolabe from './pages/sites/Astrolabe'
import Iconography from './pages/sites/Iconography'
import Fort from './pages/sites/Fort'
import Pattern from './pages/sites/Pattern'
import HarborStructure from './pages/sites/HarborStructure'
import ShipyardStructure from './pages/sites/ShipyardStructure'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/submitfind" element={<SubmitFind />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/webdevelopmentteam" element={<WebDevelopmentTeam />} />
          <Route path="/portugal-uch" element={<PortugalUCH />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/shipbuilding" element={<Shipbuilding />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/newpost/:id" element={<NewPost />} />
          <Route path="/verifyfind" element={<VerifyFind />} />
          <Route path="/verifyfind/:id" element={<VerifyFind />} />
          <Route path="/submitted-finds/:id" element={<VerifyFind />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-publications" element={<MyPublications />} />
          <Route path="/submitted-finds" element={<SubmittedFinds />} />
          <Route path="/submitted-posts" element={<SubmittedPosts />} />

          {/* Sites Routes */}
          <Route path="/artifact" element={<Artifact />} />
          <Route path="/shipwreck" element={<Shipwreck />} />
          <Route path="/site/:id" element={<SiteDetails />} />
          <Route path="/explore/:type" element={<ExploreCollection />} />
          <Route path="/explore/:type/:region" element={<ExploreByRegion />} />

          {/* Replicated routes */}
          <Route path="/anchor" element={<Anchor />} />
          <Route path="/artillery-guns" element={<ArtilleryGuns />} />
          <Route path="/astrolabe" element={<Astrolabe />} />
          <Route path="/iconography" element={<Iconography />} />
          <Route path="/fort" element={<Fort />} />
          <Route path="/pattern" element={<Pattern />} />
          <Route path="/harbor-structure" element={<HarborStructure />} />
          <Route path="/shipyard-structure" element={<ShipyardStructure />} />
          <Route path="*" element={<ReturnToHome />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
