import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx'
import EmailVerify from './components/EmailVerify/EmailVerify.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/' element={<Layout/>}>
                <Route path='' element={<Home/>}/>
                <Route path='about' element={<About/>}/>
                <Route path='contact' element={<Contact/>}/>
            </Route>
            <Route path='/signIn' element={<Login/>}/>
            <Route path='/signUp' element={<Signup/>}/>
            <Route path='/users/:id/verify/:token' element={<EmailVerify/>}/>
        </>
    )
)

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
