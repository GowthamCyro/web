import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

function Layout({user,setUser}) {
  return (
    <>
        <Header user={user} setUser={setUser} />
        <Outlet />
        <Footer />
    </>
  )
}

export default Layout