import React from 'react';
import Carrousel from '../carrousel/Carrousel';
import ProductContainer from '../product/ProductsContainer';
import BannerInstagram from '../contact/BannerInstagram';
import Categories from '../filter/Categories';

const Home = () => {
    return (
        <div className="home-ctn p-0">
            <Carrousel></Carrousel>
            <Categories></Categories>
            <ProductContainer></ProductContainer>
            <BannerInstagram></BannerInstagram>
        </div>
    );
};

export default Home;