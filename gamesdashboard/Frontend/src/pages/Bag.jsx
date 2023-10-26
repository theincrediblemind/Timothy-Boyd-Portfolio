import React from 'react'
import './bag.css'
import GameCard from '../components/GameCard';


function Bag({games, reference}) {
  return (
    <section id="bag" className="bag" ref={reference}>
                <div className="container-fluid">
            <div className="row mb-3">
                <h1>My Bag</h1>
            </div>
            <div className="row">
                {
                    games.length === 0 ? (
                        <h2>Your Bag is empty <i class="bi bi-emoji-frown"></i> Add some games to get started!</h2>
                    ) : (
                        games.map(game=>(
                            <GameCard key={game._id} game={game}/>
                        ))
                    )
                }
            </div>
        </div>
    </section>
  )
}

export default Bag