import React from 'react';

const Footer = () => {
    return (
        <footer className="text-white mt-5 p-4" style={{ backgroundColor: "#000"}}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5>Ubicación</h5>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.9007642155074!2d-122.08424948425238!3d37.42206597982552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5d6e5a28c71%3A0xa1a2b9e83f0f52a1!2sGoogleplex!5e0!3m2!1sen!2sus!4v1618336395683!5m2!1sen!2sus"
                            width="100%"
                            height="150"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Ubicación"
                        ></iframe>
                    </div>
                    <div className="col-md-6 text-center">
                        <h5>Redes Sociales</h5>
                        <a href="https://wa.me/54XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                            <i className="bi bi-whatsapp" style={{ fontSize: '1.7em' }}></i>
                        </a>
                        <a href="https://www.instagram.com/electrozona_" target="_blank" rel="noopener noreferrer" className="text-white">
                            <i className="bi bi-instagram" style={{ fontSize: '1.7em' }}></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;