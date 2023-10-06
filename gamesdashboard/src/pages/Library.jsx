import React from 'react'
import './library.css'
import GameCard from '../components/GameCard';

function Library({games, reference}) {
  return (
    <section id="library" className="library" ref={reference}>
        <div className="container-fluid">
            <div className="row mb-3">
                <h1>My Library</h1>
            </div>
            <div className="row">
                {
                    games.length === 0 ? (
                        <h2>Your Library is empty <i class="bi bi-emoji-frown"></i> Add some games to get started!</h2>
                    ) : (
                        games.map(game=>(
                            <GameCard key={game._id} game={game}/>
                        ))
                    )
                }
            </div>
        </div>
    </section>
  );
}

export default Library