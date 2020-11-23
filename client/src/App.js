import './App.css';
import NavBar from './components/layout/Navbar';
import { Router } from "react-router-dom";
import history from "./services/history";
import Routes from './routes/Routes';


function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Routes />
      </Router>
    </div>
  );
}

export default App;
