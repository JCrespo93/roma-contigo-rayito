# Roma contigo, Rayito · v3.1

Actualización conservadora de la V3. Mantiene su diseño, estructura y filosofía, y añade únicamente las dos funciones elegidas.

## Modo día / noche
- Automático por defecto:
  - Día: 07:00–17:59.
  - Noche: 18:00–06:59.
- Selector manual en el menú: **Auto → Día → Noche**.
- La elección queda guardada en el navegador.
- El tema oscuro mantiene tonos cálidos y apagados, sin negro puro.

## “Momento Rayito” dentro del itinerario
Cada jornada termina con un discreto **♡ Momento Rayito** de una sola frase.

Se abre automáticamente si está vacío al terminar aproximadamente la jornada:
- Sábado 10: 20:00.
- Domingo 11: 21:00.
- Lunes 12: 14:15.

También se puede abrir manualmente en cualquier momento.

El texto está sincronizado con el diario **“Roma, tú y yo”** de la parte final de la web. Si escribes en uno, aparece en el otro.

## Privacidad
Tema, checks y recuerdos se guardan únicamente en `localStorage` del navegador. No se suben a GitHub ni a ningún servidor.

## Actualizar GitHub Pages
Sustituye los archivos de la raíz del repositorio por estos y haz un commit.  
El Service Worker usa la caché `roma-rayito-v31`, así que después de publicar conviene abrir la web con conexión y recargarla una vez.
