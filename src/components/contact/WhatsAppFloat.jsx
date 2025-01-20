import React from 'react';
import './WhatsAppFloat.css'; // CSS para el posicionamiento flotante

const WhatsAppFloat = () => {
    return (
        <a 
            href="https://wa.me/543571315193?text=Hola,%20tengo%20una%20consulta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-float"
        >
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                alt="WhatsApp" 
                style={{ width: '50px', height: '50px' }}
            />
        </a>
    );
};

export default WhatsAppFloat;
