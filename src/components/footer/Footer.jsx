import React from 'react';

const Footer = () => {
    return (
        <footer className="text-white mt-5 p-4" style={{ backgroundColor: "#000" }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <h5>Ubicación</h5>
                        <iframe title="electrozona ubicacion"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2140.3628131061755!2d-67.52212933449881!3d-28.924358171021616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x969d83e55d5c6b3b%3A0x24d4eace17eff51e!2sElectro%20Zona!5e0!3m2!1ses-419!2sar!4v1737670185951!5m2!1ses-419!2sar"
                            style={{ border: "0", width: "100%" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        <p>19 de Abril 50, F5365 Famatina, La Rioja</p>
                    </div>
                    <div className="col-md-6 text-center d-flex flex-column justfy-content-center">
                        <h5>Redes Sociales</h5>
                        <p className='p-0'>¡Contactate con nosotros!</p>
                        <div className='d-flex flex-column align-items-center'>
                            <a href="https://wa.me/543571315139" target="_blank" rel="noopener noreferrer" className="text-white d-flex align-items-center" style={{width:"250px", textAlign:"start"}}>
                                <i className="bi bi-whatsapp me-3" style={{ fontSize: '1.7em' }}></i>
                                <p className='m-0'>+54 9 3571-315139</p>
                            </a>
                            <a href="https://www.instagram.com/electrozona_" target="_blank" rel="noopener noreferrer" className="text-white d-flex align-items-center" style={{width:"250px", textAlign:"start"}}>
                                <i className="bi bi-instagram me-3" style={{ fontSize: '1.7em' }}></i>
                                <p className='m-0'>@electrozona_</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <p className='mt-5'>© 2025 Electro Zona. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;