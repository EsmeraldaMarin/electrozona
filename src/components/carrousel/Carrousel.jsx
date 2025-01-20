import React from 'react';
const Carrousel = () => {
    return (
        <div id="carousel" className="carousel slide">
            <div className="carousel-indicators mb-1 ">
                <button type="button" data-bs-target="#carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner" style={{ minHeight: '130px', maxHeight: '130px' }}>
                <div className="carousel-item active" data-bs-interval="10000">
                    <img src="https://images.samsung.com/is/image/samsung/assets/ar/buds3-watch7-launching/BANNER_HOME_GALAXY_BUDS3_PC_1440.jpg?imwidth=1366" className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                    <img src="https://i.blogs.es/ee4554/galaxy-a34-a54-5g_apertura/1366_2000.jpeg" className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                    <img src="https://img.global.news.samsung.com/ar/wp-content/uploads/2022/10/Banner_CyberMonday-1000x563.jpg" className="d-block w-100" alt="..." />
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}
export default Carrousel;