import React, {useState} from 'react'
import './categories.css'
import filterListData from '../data/filterListData.js'
import GameCard from '../components/GameCard';

function Categories({games, reference, sectionActive}) {
    const [data, setData] = useState(games);
    const [filters, setFilters] = useState(filterListData);
    const onFilterGames=(category)=>
    {
        const newFilters = filters.map(filter=>
            {
                filter.active = false;
                if (filter.name === category)
                {
                    filter.active = true;
                }
                return filter;
            });
            setFilters(newFilters);
            if (category === 'All')
            {
                setData(games);
                return;
            }

            setData(games.filter(game=>(game.category === category)));
    };

    const [text, setText] = useState('');
    const gameSearch=(e)=>
    {
        console.log(e.target.value);
        setText(e.target.value);
        setData(games.filter(game=>(game.title.toLowerCase().includes(e.target.value.toLowerCase()))));
    }


  return (
    <section id="categories" className='categories' ref={reference}>
        <div className="container-fluid mt-2">
            <div className="row">
                <div className="col-lg-8 d-flex align-items-center justify-content-start"> {/* update this to be a filters component */}
                    <ul className="filters">
                        {
                            filters.map(filter=>(
                            <li key={filter._id}  
                            className={`${filter.active? 'active' : undefined}`} 
                            onClick={()=>onFilterGames(filter.name)}>{filter.name}</li>))
                        }
                    </ul>
                </div>
                <div className="col-lg-4 d-flex align-items-center justify-content-end"> {/* update this to be a SearchBar component */}
                        <div className="search">
                            <input type="text" name="search" value={text} placeholder="Search" onChange={gameSearch}/>
                            <i class="bi bi-search"></i>
                        </div>
                </div>
            </div>
            <div className="row">  
                {
                    data.map(game=>(
                        <GameCard key={game._id} game={game}/>
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Categories