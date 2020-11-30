import './App.css';
import React from 'react';
import NavBar from './components/layout/Navbar';
import {BrowserRouter} from "react-router-dom";
import Routes from './routes/Routes';


function App() {
    return (
        <div className="Body">
            <BrowserRouter>
                <NavBar />
                <Routes/>
            </BrowserRouter>
        </div>
    );
}

export default App;
