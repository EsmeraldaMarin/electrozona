import React from 'react';

const BannerInstagram = () => {
    return (
        <div className='my-3' style={{backgroundColor:'#ddd'}}>
            <a href="https://www.instagram.com/electrozona__" target="_blank" rel="noopener noreferrer" className='d-flex p-4 justify-content-center align-items-center'>
                <i className="bi bi-instagram ps-5" style={{fontSize:'3em'}}></i>
                <div className="container text-start fw-bold ">
                    <p className='p-0 m-0'>SEGUINOS EN INSTAGRAM</p>
                    <p className='p-0 m-0'>@electrozona__</p>
                </div>
            </a>
        </div>
    );
};

export default BannerInstagram;