import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

import ProjectsManager from '../../components/admin/ProjectsManager'
import MessagesViewer from '../../components/admin/MessagesViewer'
import AboutManager from '../../components/admin/AboutManager'
import GalleryManager from '../../components/admin/GalleryManager'
import ExperienceManager from '../../components/admin/qualifications/Experience'
import EducationManager from '../../components/admin/qualifications/Education'
import CertificationsManager from '../../components/admin/qualifications/Certifications'
import SkillsManager from '../../components/admin/qualifications/Skills'
import EmailSender from '../../components/admin/EmailSender'

import {
  FaProjectDiagram,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaImages,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaCode,
  FaPaperPlane
} from 'react-icons/fa'

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('projects')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // 🔐 Auth Guard
  useEffect(() => {
    if (loading) return
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
    }
  }, [user, loading, navigate])

  // ⏳ Loading Guard (IMPORTANT)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-white">
        Loading Admin Dashboard...
      </div>
    )
  }

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsManager />
      case 'messages': return <MessagesViewer />
      case 'about': return <AboutManager />
      case 'gallery': return <GalleryManager />
      case 'experience': return <ExperienceManager />
      case 'education': return <EducationManager />
      case 'certifications': return <CertificationsManager />
      case 'skills': return <SkillsManager />
      case 'email': return <EmailSender />
      default: return <ProjectsManager />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Sidebar */}
      <aside className={`w-64 bg-white dark:bg-gray-800 fixed h-full shadow-lg ${isSidebarOpen ? 'block' : 'hidden'} md:block overflow-y-auto z-50`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome, {user.email?.split('@')[0]}
          </p>
        </div>

        <nav className="mt-4 space-y-1">
          <SidebarBtn icon={<FaProjectDiagram />} label="Projects" tab="projects" />
          <SidebarBtn icon={<FaEnvelope />} label="Messages" tab="messages" />
          <SidebarBtn icon={<FaUser />} label="About Me" tab="about" />
          <SidebarBtn icon={<FaImages />} label="Gallery" tab="gallery" />
          <SidebarBtn icon={<FaPaperPlane />} label="Send Email" tab="email" />

          <p className="px-6 pt-4 text-xs uppercase text-gray-500">Qualifications</p>

          <SidebarBtn icon={<FaBriefcase />} label="Experience" tab="experience" />
          <SidebarBtn icon={<FaGraduationCap />} label="Education" tab="education" />
          <SidebarBtn icon={<FaCertificate />} label="Certifications" tab="certifications" />
          <SidebarBtn icon={<FaCode />} label="Skills" tab="skills" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 mt-6 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="fixed top-0 left-0 right-0 md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            className="text-gray-700 dark:text-gray-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
          </button>
          <span className="text-sm font-semibold">Admin Panel</span>
          <div className="w-6" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 sm:p-6 overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  )

  function SidebarBtn({ icon, label, tab }) {
    return (
      <button
        onClick={() => {
          setActiveTab(tab)
          setIsSidebarOpen(false)
        }}
        className={`w-full flex items-center px-6 py-3 ${
          activeTab === tab
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </button>
    )
  }
}

export default Dashboard
