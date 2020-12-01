import './App.css';
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import Profile from "./pages/Profile";
import Error from "./pages/Error"; 
import Login from "./pages/Login";
import Register from "./pages/Register";


import {Route, Switch} from 'react-router-dom';


function App() {
  return <>      
      <Switch>
         <Route exact path="/" component={Home}/>
         <Route exact path="/rooms/" component={Rooms}/>
         <Route exact path="/rooms/:slug" component={SingleRoom}/>
         <Route exact path="/login" component={Login}/>
         <Route exact path="/register" component={Register}/>
         <Route exact path="/profile" component={Profile}/>
         <Route exact path="/error" component={Error}/>
         <Route component={Error}/>
      </Switch>
    </>  
}

export default App;
