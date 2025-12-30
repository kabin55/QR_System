import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import {HomePage} from './pages/UserPage/homePage'
import MenuPage from './pages/UserPage/menuPage'
import {LandingPage} from './pages/UserPage/landingPage'


function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:restaurantId" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />


      </Routes>
    </Router>
  )
}

export default App