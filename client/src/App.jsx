import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import {HomePage} from './pages/UserPage/homePage'
import MenuPage from './pages/UserPage/menuPage'
import {LandingPage} from './pages/UserPage/landingPage'

import Dashboard from './pages/AdminPage/dashboard'
import DetailPage from './pages/AdminPage/detailPage'
import ItemCRUD from './pages/AdminPage/itemCRUD'
import OrderPage from './pages/AdminPage/orderPage'
import LoginForm from './pages/AdminPage/loginPage'
import SuperAdmin from './pages/AdminPage/superAdmin'

function App(){
   return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:restaurantId" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/new" element={<SuperAdmin />} />


    
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