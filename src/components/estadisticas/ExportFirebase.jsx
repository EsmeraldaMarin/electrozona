import React from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const ExportFirestore = () => {
    const colecciones = ['Categorias', 'Banner', 'Productos', 'Usuarios']; // Agregá todas las colecciones que tengas

    const exportarDatos = async () => {
        const exportData = {};

        for (const col of colecciones) {
            const colRef = collection(db, col);
            const snapshot = await getDocs(colRef);
            exportData[col] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }

        // Convertir a JSON
        const jsonString = JSON.stringify(exportData, null, 2);

        // Crear un archivo Blob y descargarlo
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'backup-firestore.json';
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <button className="btn btn-primary" onClick={exportarDatos}>
            Descargar Backup JSON
        </button>
    );
};

export default ExportFirestore;
