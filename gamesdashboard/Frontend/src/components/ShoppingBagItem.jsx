import React, {useContext} from 'react'
import './shoppingbagitem.css';
import noImageIcon from '../images/noimageavailable.jpg'
import { AppContext } from '../App';



function ShoppingBagItem({game, index}) {
    const {bag, setBag} = useContext(AppContext)

    const handleRemove=(game)=>
    {
        setBag(bag.filter(item => item.checksum !== game.checksum))
    }
  return (
    <tr className="shoppingBagItem">
        <th scope='row'>
            {index + 1}
        </th>
        <td>
            <img src={game.coverUrl || noImageIcon} alt="" className="img-fluid"/>
        </td>
        <td>{game.name}</td>
        <td>${game.price.toFixed(2)}</td>
        <td>{(Math.floor(game.discount * 100))}%</td>
        <td>${(game.price * (1 - game.discount)).toFixed(2)}</td>
        <td><a href='#' onClick={() => handleRemove(game)}><i class="bi bi-trash-fill"></i></a></td>
    </tr>
  )
}

export default ShoppingBagItem