import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { Toast } from './components/Toast.jsx'

import LandingPage from './pages/UserPage/LandingPage.jsx'
import Dashboard from './pages/AdminPage/dashboard'
import DetailPage from './pages/AdminPage/detailPage'
import ItemCRUD from './pages/AdminPage/itemCRUD'
import OrderPage from './pages/AdminPage/orderPage'
import LoginForm from './pages/AdminPage/loginPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/details" element={<DetailPage />} />
        <Route path="/item" element={<ItemCRUD />} />
        <Route path="/orders" element={<OrderPage />} />
      </Routes>
    </Router>
  )
}

export default App
