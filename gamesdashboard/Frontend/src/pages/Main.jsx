import React, {useState, useEffect, useRef, useContext} from 'react';
import { AppContext } from '../App';
import './main.css';
import SideMenu from '../components/SideMenu';
import Header from '../components/Header';
import Home from './Home';
import Categories from './Categories';
import Library from './Library';
import Bag from './Bag';

function Main() {
    const {library, bag} = useContext(AppContext);
    const [active, setActive] = useState(false);
    const [games, setGames] = useState([]);

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

    const sectionActive=(target)=>
    {
        sections.map(section=>
            {
                section.ref.current.classList.remove('active');
                if (section.ref.current.id === target)
                {
                    section.ref.current.classList.add('active')
                }
                return section;
            })
    }

    const getGameData=()=>
    {
        fetch('http://localhost:3000/api/gamesData.json')
        .then(res=>res.json())
        .then(data=>{
            setGames(data)
        })
        .catch(e=> console.log(e.message))
    }

    useEffect(()=>{
        getGameData();
    }, [])

  return (
    <main>
        <SideMenu active={active} sectionActive={sectionActive}/>
        <div className={`banner ${active ? 'active' : undefined}`}>
            <Header toggleActive={toggleActive}/>
            <div className="container-fluid">
            {games && games.length > 0 && (
                <>
                    <Home games={games} reference={homeRef}/>
                    <Categories games = {games} reference={categoriesRef}/>
                    <Library games={library} reference={libraryRef}/>
                    <Bag games={bag} reference={bagRef}/>
                </>
                )}
            </div>
        </div>
    </main>
  )
}

export default Main