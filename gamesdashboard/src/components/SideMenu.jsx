import React, {useState} from 'react';
import './sidemenu.css';
import navListData from '../data/navListData';
import NavListItem from './NavListItem';
import socialListData from '../data/socialListData';

function SideMenu({active}) {
    const [navData, setNavData] = useState(navListData)
    const [socialData, setSocialData] = useState(socialListData)

  return (
    <div className={`sideMenu ${active ? 'active': undefined}`}>
        <a href="#" className="logo">
            <i className="bi bi-controller"></i>
            <span className="brand">Play</span>
        </a>
        <ul className="nav">
            {
                navData.map(item=>(<NavListItem key={item._id} item={item}/> ))
            }
        </ul>
        <ul className="social">
            {
                socialData.map(label=>(<NavListItem key={label._id} item={label}/>))
            }
        </ul>
    </div>
  )
}

export default SideMenu