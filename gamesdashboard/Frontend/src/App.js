//bootstrap import
import 'bootstrap/dist/css/bootstrap.min.css';
//import bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css';

import React, {useState}  from 'react';
import './App.css';
import Main from './pages/Main';

export const AppContext = React.createContext();

function App() {

  const [library, setLibrary] = useState([]);
  const [bag, setBag] = useState([])
  return (
    <>
      <AppContext.Provider value={{library, setLibrary, bag, setBag}}>
        <Main/>
      </AppContext.Provider>
    </>
  );
}

export default App;
