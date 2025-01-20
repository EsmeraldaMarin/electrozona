import React from 'react';
import Carrousel from '../carrousel/Carrousel';
import ProductContainer from '../product/ProductsContainer';
import BannerInstagram from '../contact/BannerInstagram';
import Categories from '../filter/Categories';

const Home = () => {
    return (
        <div className="container p-0" style={{ marginTop: "80px" }}>
            <Carrousel></Carrousel>
            <Categories></Categories>
            <ProductContainer></ProductContainer>
            <BannerInstagram></BannerInstagram>
        </div>
    );
};

export default Home;