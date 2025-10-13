import imageCompression from 'browser-image-compression';

// Opciones de compresión: buscamos un buen balance
const options = {
  maxSizeMB: 5,          // Tamaño máximo del archivo en MB
  maxWidthOrHeight: 1920,  // Redimensionar si es más grande que 1920px
  useWebWorker: true,    // Usar un web worker para no bloquear el navegador
  initialQuality: 0.7,   // Calidad inicial (0.7 es un buen punto de partida)
};

/**
 * Comprime un archivo de imagen en el navegador.
 * @param {File} imageFile El archivo de imagen a comprimir.
 * @returns {Promise<File>} El archivo de imagen comprimido.
 */
export async function compressImage(imageFile: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
    // Si la compresión falla, devolvemos el archivo original para no interrumpir el flujo
    return imageFile;
  }
}
