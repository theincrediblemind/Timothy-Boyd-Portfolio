import React from 'react'
import './gameslide.css'
import noImageIcon from '../images/noimageavailable.jpg'

function GameSlide({game, active, toggleVideo}) {
  return (
    <div className="gameSlider">
        <img src={game.coverUrl || noImageIcon} alt={`${game.name}`}></img>
        <div className={`video ${active ? 'active' : undefined}`}>
        <iframe width="1280" height="720" 
        src={`${game.videoUrls}?autoplay=1&mute=1`} 
        title={game.name} 
        frameBorder="0" 
        allow="accelerometer; 
        autoplay; 
        clipboard-write; 
        encrypted-media; 
        gyroscope; 
        picture-in-picture; 
        web-share" allowFullScreen
        ></iframe>
        </div>
        <div className="content">
            <h2 className="title">{game.name}</h2>
            <p className="description">{game.summary.slice(0,game.summary.indexOf("."))}</p>
            <div className="buttons">
                <a href="#" className="orderBtn">Order Now</a>
                <a href="#" className={`playBtn ${active ? 'active' : undefined}`} onClick={toggleVideo}>
                    <span className="pause">
                        <i className="bi bi-pause-fill"></i>
                    </span>
                    <span className="play">
                        <i className="bi bi-play-fill"></i>
                    </span>
                </a>
            </div>
        </div>
    </div>
  )
}

export default GameSlide