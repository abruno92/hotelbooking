import './App.css';
import React from 'react';
import NavBar from './components/layout/Navbar';
import {BrowserRouter} from "react-router-dom";
import Routes from './routes/Routes';
import {RoomProvider} from './Context';


function App() {
    return (
        <div className="body">
            <RoomProvider>
            <BrowserRouter>
                <NavBar/>
                <Routes/>
            </BrowserRouter>
            </RoomProvider>
        </div>
    );
}

export default App;
