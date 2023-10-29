import React, {useEffect, useState} from 'react'
import './bag.css'
import GameCard from '../components/GameCard';
import ShoppingBagItem from '../components/ShoppingBagItem';


function Bag({games, reference}) {

  const [total, setTotal] = useState(0);

  function calcTotal()
  {

    return (games.reduce((n, {price, discount}) => n + (price * (1 - discount)), 0)).toFixed(2);
}

useEffect(()=>{
    setTotal(calcTotal())
},[games])

  return (
    <section id="bag" className="bag" ref={reference}>
        <div className="container-fluid">
            <div className="row mb-3">
                <h1>MY Bag</h1>
            </div>
        </div>
        {
                    games.length === 0 ? (
                        <h2>Your Bag is empty <i class="bi bi-emoji-frown"></i> Add some games to get started!</h2>
                    ) : (
                        <>
                        <div className="table-responsive">
                            <table className="shoppingBagTable table table-borderless align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">No.</th>
                                        <th scope="col">Preview</th>
                                        <th scope="col">Game</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Discount</th>
                                        <th scope="col">Payment</th>
                                        <th scope="col">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        games.map((game, index) =>(
                                            <ShoppingBagItem game={game} index={index} key={game._id}/>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="row d-flex justify-content-between mt-5">
                            <div className="col-lg-2 d-flex align-items-center">
                                <p className="itemCount">Total Items: {games.length}</p>
                            </div>
                            <div className="col-lg-10 d-flex justify-content-end">
                                <div className="payment">
                                    Total: {total}
                                    <a href='#'>
                                        CheckOut<i class="bi bi-wallet-fill"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        </>
                        )
                }
    </section>
  )
}

export default Bag