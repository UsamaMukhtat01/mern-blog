import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Headers from './components/Headers';
import Footer from './components/Footer';
import PrivatRoute from './components/PrivatRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Headers/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='about' element={<About />}></Route>
        <Route element={<PrivatRoute/>}>
          <Route path='dashboard' element={<Dashboard/>}></Route>
        </Route>
        <Route path='projects' element={<Projects/>}></Route>
        <Route path='sign-in' element={<SignIn/>}></Route>
        <Route path='sign-up' element={<SignUp/>}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
