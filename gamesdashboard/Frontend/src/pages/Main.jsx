import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../App';
import './main.css';
import SideMenu from '../components/SideMenu';
import Header from '../components/Header';
import Home from './Home';
import Categories from './Categories';
import Library from './Library';
import Bag from './Bag';
import SignIn from './SignIn';
import LoadingSpinner from '../components/LoadingSpinner';

function Main() {
  // Accessing shared application context to get data
  const { library, bag, setuserName } = useContext(AppContext);

  // State variables to manage component behavior
  const [active, setActive] = useState(false); // For toggling the active state
  const [games, setGames] = useState([]); // To store game data
  const [loading, setLoading] = useState(true); // To track the loading state
  const [signedIn, setSignedIn] = useState(false);

  // Refs for component sections
  const homeRef = useRef();
  const categoriesRef = useRef();
  const libraryRef = useRef();
  const bagRef = useRef();
  const signInRef = useRef();

  // Define the sections and their initial state
  const sections = [
    {
      name: 'home',
      ref: homeRef,
      active: true,
    },
    {
      name: 'categories',
      ref: categoriesRef,
      active: false,
    },
    {
      name: 'library',
      ref: libraryRef,
      active: false,
    },
    {
      name: 'bag',
      ref: bagRef,
      active: false,
    },
    {
      name: 'signIn',
      ref: signInRef,
      active: false,
    }
  ];

  // Function to toggle the active state
  const toggleActive = () => {
    setActive(!active);
  };

  // Function to set the active section
  const sectionActive = (target) => {
    sections.forEach((section) => {
      const currentRef = section.ref.current;
      if (currentRef) {
        currentRef.classList.remove('active');
        if (currentRef.id === target) {
          currentRef.classList.add('active');
        }
      }
    });
  };

  const confirmUser = (email, password) => {
    console.log(email, " ", password);
    const url = `http://localhost:8080/api/getUser?email=${email}&password=${password}`;
  
    // Perform the fetch
    return fetch(url)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 429) {
            // Handle 429 error by waiting and retrying
            return Promise.reject('Rate Limited');
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
        return res.text();

      })
      .then((data) => {
        // Data will contain the response JSON if the request was successful
  
        if (data === 'User Not Found') {
          // Handle the case where the user is not found
          return false;
        }
  
        // User is authenticated
        setuserName(data);
        setSignedIn(true);
        return true;
      })
      .catch((error) => {
        console.error('Fetch Error:', error);
        return false;
      });
  };
  

  const handleSignIn = (email, password) => {
    // Pass the email and password to the confirmUser function
    return confirmUser(email, password);
    
    // Set the signedIn state based on the result of authentication
  };

  // Function to fetch game data from the API
  const getGameData = () => {
    fetch('http://localhost:5250/api/IGDB/getGameData')
      .then((res) => {
        console.log(res.status);
        if (!res.ok) {
          if (res.status === 429) {
            // Handle 429 error by waiting and retrying
            const retryAfter = parseInt(res.headers.get('Retry-After')) || 10; // Default to 10 seconds
            setTimeout(getGameData, retryAfter * 1000); // Retry after the specified delay
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
        return res.json();
      })
      .then((data) => {
        setGames(data.value);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Fetch Error:', error);
        setLoading(false); // Set loading to false on error as well
      });
  };

  // Effect to fetch game data when the component loads and loading state is true
  useEffect(() => {
    if (loading) {
      getGameData();
    }
  }, [loading]); // Empty dependency array to run this effect only once



    return (
      <main>
        { !signedIn ? (
            <SignIn onSignIn={handleSignIn}reference={signInRef}/>
        ) : (

          <>
        <SideMenu active={active} sectionActive={sectionActive} />
        <div className={`banner ${active ? 'active' : undefined}`}>
          <Header toggleActive={toggleActive} />
          <div className="container-fluid">
            {games && games.length > 0  && signedIn ? (
              // Condition 1: When games data is available and not empty
              <>
                <Home games={games} reference={homeRef} />
                <Categories games={games} reference={categoriesRef} />
                <Library games={library} reference={libraryRef} />
                <Bag games={bag} reference={bagRef} />
              </>
            ) : (
              // Condition 2: When games data is being loaded
              <div className="loading">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
        </>
    )};
      </main>
    );
}

export default Main;
