import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChangeCredentials from '../AdminComponent/ChangePassword'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChangeCredentialsOpen, setIsChangeCredentialsOpen] = useState(false)
  const restaurantData = JSON.parse(localStorage.getItem('restaurantDetails'))
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Item', path: '/item', icon: '📦' },
    { name: 'Orders', path: '/orders', icon: '📋' },
    { name: 'Settings', path: '/details', icon: '⚙️' },
  ]

  const isActiveLink = (path) => location.pathname === path
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const handleLogout = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      await fetch(`${backendUrl}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      localStorage.removeItem('restaurantDetails')
      document.cookie = 'token=; Max-Age=0; path=/;'
      alert('Logged out successfully')
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed', err)
      alert('Logout failed')
    }
  }

  const handleOpenChangeCredentials = () => {
    setIsChangeCredentialsOpen(true)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Cafe Hub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors duration-200 ${
                  isActiveLink(item.path)
                    ? 'bg-cyan-100 text-cyan-700 border-b-2 border-cyan-500'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/50 hover:scale-105 transition-transform duration-300"
            >
              Logout
            </button>
            <button
              onClick={handleOpenChangeCredentials}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors duration-200 ${
                  isActiveLink(item.path)
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">A</span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    Admin {restaurantData?.restaurantName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">admin@example.com</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleOpenChangeCredentials}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Credentials Modal */}
      {isChangeCredentialsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setIsChangeCredentialsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <ChangeCredentials
              backendUrl={import.meta.env.VITE_BACKEND_URL}
              restaurantId={restaurantData?.restaurantId}
              onClose={() => setIsChangeCredentialsOpen(false)}
            />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
