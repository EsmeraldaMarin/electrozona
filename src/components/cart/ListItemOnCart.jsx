import React from 'react';
import ItemOnCart from './ItemOnCart'

const ListItemOnCart = ({ cart, removeItem }) => (

    <div className="listItemOnCart d-flex flex-column">
        {cart?.map((item) => {
            return (
                <ItemOnCart key={item.id} item={item} removeItem={removeItem} />
            );
        })}
    </div>
)

export default ListItemOnCart
