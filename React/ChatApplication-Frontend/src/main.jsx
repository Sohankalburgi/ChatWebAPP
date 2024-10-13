import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ChatComponent from "./ChatComponent";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from "./login";
 
const router = createBrowserRouter([
  { path : "/" ,element: <App/>,
    children : [
        { path : '/', element : <Login/>},
        { path : "/chat", element : <ChatComponent/>}
    ]
  },
  
])

createRoot(document.getElementById('root')).render(
    
    <RouterProvider router={router}/>

)
