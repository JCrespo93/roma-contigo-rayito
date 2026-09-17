# Roma contigo, Rayito · v3

Web responsive para el viaje a Roma del 10 al 12 de octubre de 2026.

## Novedades v3
- **Comer cerca de aquí**: 4 zonas y 12 opciones de comida/café/gelato con Google Maps.
- **Plan B** para lluvia, retrasos, cansancio y protección de las reservas importantes.
- **Emergencias y transporte**: 112, Consulado de España, taxi oficial, farmacias de guardia y mapas nocturnos ATAC.
- **Italiano de bolsillo**: 15 frases con botón para copiar.
- **Roma, tú y yo**: una nota por día guardada exclusivamente en `localStorage`.
- Botón para copiar todos los recuerdos del viaje.
- El modo **Ahora toca** muestra “Hoy, Roma con mi Rayito” y calcula cuándo conviene salir.
- Service Worker actualizado a `roma-rayito-v3`.

## Privacidad
No se han incluido entradas, QR, PDF ni documentación privada.  
Las notas y checks que se escriben en la web se guardan solo en el navegador del dispositivo mediante `localStorage`; el código no las envía a GitHub ni a ningún servidor.

## Despliegue en GitHub Pages
Sustituye en la raíz del repositorio los archivos por los de esta carpeta y haz un commit. GitHub Pages publicará la actualización automáticamente.

Si el móvil conserva la versión anterior, recarga la página una vez con conexión para que se active el Service Worker v3.

Archivos: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`.
