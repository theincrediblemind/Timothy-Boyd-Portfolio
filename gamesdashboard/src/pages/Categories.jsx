import React from 'react'
import './categories.css'

function Categories({games, reference}) {
  return (
    <section id="categories" className='categories' ref={reference}>
        <h1>Category</h1>
    </section>
  )
}

export default Categories