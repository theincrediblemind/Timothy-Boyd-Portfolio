import React, {useState, useEffect} from 'react';
import './main.css';
import SideMenu from '../components/SideMenu';
import Header from '../components/Header';
import Home from './Home';

function Main() {
    const [active, setActive] = useState(false);
    const [games, setGames] = useState([]);

    const toggleActive=()=>
    {
        setActive(!active);
    };

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
        <SideMenu active={active}/>
        <div className={`banner ${active ? 'active' : undefined}`}>
            <Header toggleActive={toggleActive}/>
            <div className="container-fluid">
                <Home games={games}/>
            </div>
        </div>
    </main>
  )
}

export default Main