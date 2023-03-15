import React from 'react'
import { Route, Routes } from "react-router-dom"
import Login from './components/login';
import Meja from './pages/admin/meja';
import Menu from './pages/admin/menu';
import User from './pages/admin/user';
import Pemesanan from './pages/kasir/pemesanan';
import Riwayat from './pages/kasir/riwayat'
import Manajer from './pages/manajer/manajer';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/admin/user" element={<User />} />
      <Route path='/admin/meja' element={<Meja/>} />
      <Route path='/admin/menu' element={<Menu/>} />
      <Route path='/kasir/pemesanan' element={<Pemesanan/>}/>
      <Route path='/kasir/riwayat' element={<Riwayat/>}/>
      <Route path='/manajer' element={<Manajer/>}/>
    </Routes>
  )
}
export default App;
