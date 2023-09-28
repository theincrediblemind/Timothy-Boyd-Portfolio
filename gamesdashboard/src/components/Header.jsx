import React from 'react';
import './header.css';
import userImage from '../images/testAvi.jpg';

function Header({toggleActive}) {
  return (
    <header>
        <a href="#" className="menu" onClick={toggleActive}><i className="bi bi-sliders"></i></a>
        <div className="userItems">
            <a href="#" className="icon">
                <i className="bi bi-heart-fill"></i>
                <span className="like">0</span>
                </a>
            <a href="#" className="icon">
                <i className="bi bi-bag-fill"></i>
                <span className="bag"></span>
            </a>
            <div className="avatar">
                <a href="#">
                    <img src={userImage} alt="User Image" />
                </a>
                <div className="user">
                    <span> User Name</span> {/* Update this to use dynamic username and user info once database is created and user authentication is set up*/}
                    <a href="">View Profile</a>
                </div>
            </div>
        </div>

    </header>
  )
}

export default Header