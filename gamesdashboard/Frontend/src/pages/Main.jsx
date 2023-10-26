import React, {useState, useEffect, useRef, useContext} from 'react';
import { AppContext } from '../App';
import './main.css';
import SideMenu from '../components/SideMenu';
import Header from '../components/Header';
import Home from './Home';
import Categories from './Categories';
import Library from './Library';
import Bag from './Bag';
import LoadingSpinner from '../components/LoadingSpinner';

function Main() {
    const {library, bag} = useContext(AppContext);
    const [active, setActive] = useState(false);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const homeRef = useRef();
    const categoriesRef = useRef();
    const libraryRef = useRef();
    const bagRef = useRef();

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
        }
    ]

    const toggleActive=()=>
    {
        setActive(!active);
    };

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

      const getGameData = () => {
        fetch('http://localhost:5250/api/IGDB/getGameData')
          .then((res) => {
            console.log(res.status)
            if (!res.ok) {
                if (res.status === 429) {
                    // Handle 429 error by waiting and retrying
                    const retryAfter = parseInt(res.headers.get('Retry-After')) || 10; // Default to 10 seconds
                    setTimeout(getGameData, retryAfter * 1000); // Retry after the specified delay
                }
                else{
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
            }
            return res.json();
          })
          .then((data) => {
            console.log('Response Data:', data);
            setGames(data.value);
            setLoading(false); // Set loading to false after data is fetched
          })
          .catch((error) => {
            console.error('Fetch Error:', error);
            setLoading(false); // Set loading to false on error as well
          });
      };
    
      useEffect(() => {
        if (loading) {
          getGameData();
        }
      }, [loading]); // Empty dependency array to run this effect only once
    

  return (
    <main>
        <SideMenu active={active} sectionActive={sectionActive}/>
        <div className={`banner ${active ? 'active' : undefined}`}>
            <Header toggleActive={toggleActive}/>
            <div className="container-fluid">
            {games && games.length > 0 ? (
                <>
                    <Home games={games} reference={homeRef}/>
                    <Categories games={games} reference={categoriesRef}/>
                    <Library games={library} reference={libraryRef}/>
                    <Bag games={bag} reference={bagRef}/>
                </>
            ) : (
                // What to render when games.length is not greater than 0
                <div className="loading">
                    <LoadingSpinner/>
                </div>
            )}
            </div>
        </div>
    </main>
  )
}

export default Main