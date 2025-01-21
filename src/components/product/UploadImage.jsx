import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";

/*
1. Sube la imagen a Firebase Storage
Usa uploadBytes o uploadBytesResumable para subir la imagen al bucket de almacenamiento.
2. Obtén la URL pública de la imagen
Una vez que la imagen se sube correctamente, utiliza getDownloadURL para obtener una URL pública que apunte al archivo.
3. Guarda la URL en tu base de datos
Usa Firebase Realtime Database, Firestore, o cualquier base de datos que estés utilizando para almacenar esta URL junto con otros datos relacionados (como el nombre del producto, precio, etc.). 
*/

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image) return alert("Por favor, selecciona una imagen.");

        // Crea una referencia en el Storage
        const storageRef = ref(storage, `images/${image.name}`);

        try {
            // Sube la imagen
            await uploadBytes(storageRef, image);
            alert("Imagen subida con éxito!");

            // Obtén la URL de descarga
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
            console.log("URL de la imagen:", url);
        } catch (error) {
            console.error("Error al subir la imagen:", error);
        }
    };

    return (
        <div className="container">
            <h2>Subir Imagen</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Subir</button>

            {imageURL && (
                <div>
                    <h3>Imagen subida:</h3>
                    <img src={imageURL} alt="Subida" style={{ width: "300px" }} />
                </div>
            )}
        </div>
    );
};

export default UploadImage;
