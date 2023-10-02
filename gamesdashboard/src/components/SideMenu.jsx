import React, {useState} from 'react';
import './sidemenu.css';
import navListData from '../data/navListData';
import NavListItem from './NavListItem';
import socialListData from '../data/socialListData';

function SideMenu({active, sectionActive}) {
    const [navData, setNavData] = useState(navListData)
    const [socialData, setSocialData] = useState(socialListData)

    const navOnClick=(id, target)=>
    {
        const newNavData = navData.map(nav=>{
            nav.active = nav._id === id ? true : false;
            return nav;
        })
        setNavData(newNavData);
        sectionActive(target)
    }

  return (
    <div className={`sideMenu ${active ? 'active': undefined}`}>
        <a href="#" className="logo">
            <i className="bi bi-controller"></i>
            <span className="brand">Oros</span>
        </a>
        <ul className="nav">
            {
                navData.map(item=>(<NavListItem key={item._id} item={item} navOnClick={navOnClick}/> ))
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