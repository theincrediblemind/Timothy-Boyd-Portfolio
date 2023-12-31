import React, {useContext} from 'react';
import { AppContext } from '../App';
import './header.css';
import userImage from '../images/testAvi.jpg';

function Header({toggleActive}) {
   const {library, bag, userName} = useContext(AppContext)
  return (
    <header>
        <a href="#" className="menu" onClick={toggleActive}><i className="bi bi-sliders"></i></a>
        <div className="userItems">
            <a href="#" className="icon">
                <i className="bi bi-heart-fill"></i>
                <span className="like">{library.length}</span>
                </a>
            <a href="#" className="icon">
                <i className="bi bi-bag-fill"></i>
                <span className="bag">{bag.length}</span>
            </a>
            <div className="avatar">
                <a href="#">
                    <img src={userImage} alt="UserProfileIcon" />
                </a>
                <div className="user">
                    <span>{userName}</span> {/* Update this to use dynamic username and user info once database is created and user authentication is set up*/}
                    <a href="">View Profile</a>
                </div>
            </div>
        </div>

    </header>
  )
}

export default Header