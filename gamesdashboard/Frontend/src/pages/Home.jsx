import React from 'react'
import './home.css'
import GameSwiper from '../components/GameSwiper'
import GameCard from '../components/GameCard'

function Home({games, reference}) {
  return (
    <section id="home" className="home active" ref={reference}>
        <div className="container-fluid">
            <div className="row">
                <GameSwiper games={games}/>
            </div>
            <div className="row mb-4 mt-4">
                <div className="col-lg-6">
                    <h2 className="sectionTitle">Games on Promotion</h2>
                </div>
                <div className="col-lg-6 d-flex justify-content-end align-items-center">
                   <a href="#" className="viewMore"> View More Games <i className="bi bi-arrow-right"></i></a>
                </div>
            </div>
            <div className="row">
                {    games ?(
                        games.slice(0,4).map(game=>(
                            <GameCard key={game.checksum} game={game}/>
                        ) //get items 0, 1, 2, 3 
                )) : (<h1>Waiting for games</h1>)
                }
            </div>
        </div>
    </section>
    )
}

export default Home