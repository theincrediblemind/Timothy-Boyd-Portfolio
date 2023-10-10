import React, {useContext} from 'react'
import './gamecard.css'
import GameRating from './GameRating'
import { AppContext } from '../App'
import noImageIcon from '../images/noimageavailable.jpg'

function GameCard({game}) {
    const {library, setLibrary, bag, setBag} = useContext(AppContext);
    
    const addToLibrary=(game)=>
    {
        setLibrary([...library, game])
    }

    const removeFromLibrary=(game)=>
    {
        setLibrary(library.filter(item=>(item.checksum !== game.checksum)))
    }

    return (
<div className="col-xl-3 col-lg-4 col-md-6">
    <div className="gameCard">
        <img src={game.coverUrl || noImageIcon} alt={game.name || 'Alternative name'} className="img-fluid"/>
        <a href="#" className="like" onClick={
            library && game
                ? (library.includes(game) ? () => removeFromLibrary(game) : () => addToLibrary(game))
                : () => {} // Provide a fallback function or handle the case when library or game is undefined
        }>
            <i className="bi bi-heart-fill"></i>
        </a>
        <div className="gameFeature">
            {/*<span className="gameType">{game?.level || 'Alternative Level'}</span>*/}
            {/*<GameRating rating={game?.aggregated_rating || 0} />*/}
        </div>
        <div className="gameTitle mt-4 mb-3">{game?.name || 'Alternative name'}</div>
        <div className="gamePrice">
            {game?.discount !== 0 && (
                <>
                    <span className="discount">
                        <i>{game.discount * 100 || 0}%</i>
                    </span>
                    <span className="prevPrice">${game.price?.toFixed(2) || '0.00'}</span>
                </>
            )}
            <span className="currentPrice">
                ${((1 - (game?.discount || 0)) * (game?.price || 60.0)).toFixed(2)}
            </span>
        </div>
        <a href="" className="addBag">
            <i className="bi bi-bag-plus-fill"></i>
        </a>
    </div>
</div>
    
  )
}

export default GameCard