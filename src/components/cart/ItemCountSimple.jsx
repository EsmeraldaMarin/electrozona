import React, { useState, useEffect } from 'react';

const ItemCountSimple = ({ stock, initial, onAdd, item }) => {

    const [count, setCount] = useState(initial);

    useEffect(() => onAdd(item.id, count), [count])

    const substrCount = () => {
        if (count > 1) { setCount((prevCount) => prevCount - 1) }
    }
    const increaseCount = () => {
        //if (count < stock) { setCount((prevCount) => prevCount + 1) }
         setCount((prevCount) => prevCount + 1) 
    }
    return (
        <div className="itemCountCtnSimple d-flex align-items-center">
            <button style={{width:"25px", height:"25px", backgroundColor:"#000", color:"#fff"}} onClick={substrCount}>-</button>
            <p className='m-0 mx-2'>{count}</p>
            <button style={{width:"25px", height:"25px", backgroundColor:"#000", color:"#fff"}} onClick={increaseCount}>+</button>
        </div>
    )
}

export default ItemCountSimple

