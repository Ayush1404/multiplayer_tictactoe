import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from './components/Root';

function App() {
  
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
