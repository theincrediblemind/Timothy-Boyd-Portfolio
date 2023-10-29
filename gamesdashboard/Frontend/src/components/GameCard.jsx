import React, { useContext } from 'react';
import './gamecard.css';
import GameRating from './GameRating';
import { AppContext } from '../App';
import noImageIcon from '../images/noimageavailable.jpg';

function GameCard({ game }) {
    // Accessing shared application context to manage library and bag
    const { library, setLibrary, bag, setBag } = useContext(AppContext);

    // Add the specified game to the library
    const addToLibrary = (game) => {
        setLibrary([...library, game]);
    };

    // Remove the specified game from the library
    const removeFromLibrary = (game) => {
        setLibrary(library.filter(item => item.checksum !== game.checksum));
    };

    // Add the specified game to the bag
    const addToBag = (game) => {
        if (bag.includes(game)) return; // Avoid duplicates in the bag
        setBag([...bag, game]);
    };


    return (
        <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="gameCard">
                <img src={game.coverUrl || noImageIcon} alt={game.name || 'No Image Found'} className="img-fluid" />
                <a href="#" className={`like ${library.includes(game) ? 'active' : undefined}`} onClick={
                    library && game
                        ? (library.includes(game) ? () => removeFromLibrary(game) : () => addToLibrary(game))
                        : () => {} // Provide a fallback function or handle the case when library or game is undefined
                }>
                    <i className="bi bi-heart-fill"></i>
                </a>
                <div className="gameFeature">
                    <span className="gameType">{game.difficulty}</span>
                    {<GameRating rating={game?.aggregated_rating || 0} />}
                </div>
                <div className="gameTitle mt-4 mb-3">{game?.name || 'Game not found'}</div>
                <div className="gamePrice">
                    {Math.floor(game?.discount * 100) !== 0 && (
                        <>
                            <span className="discount">
                                <i>{Math.floor(game.discount * 100) || 0}%</i>
                            </span>
                            <span className="prevPrice">${game.price?.toFixed(2) || '0.00'}</span>
                        </>
                    )}
                    <span className="currentPrice">
                        ${((1 - (game?.discount || 0)) * (game?.price || 60.0)).toFixed(2)}
                    </span>
                </div>
                <a href="#" className='addBag' onClick={() => addToBag(game)}>
                    <i className="bi bi-bag-plus-fill"></i>
                </a>
            </div>
        </div>
    );
}

export default GameCard;
