# Coclip Frontend

Interfaz en React + Vite para subir un video a la API y recibir la versión optimizada.

## Requisitos

- Node.js 18+.
- La API de desarrollo debe estar disponible en `http://localhost:3000/optimize`.

## Configuración

1. Copia el archivo de ejemplo y agrega tu llave.

```
VITE_API_KEY=tu-llave-aqui
```

2. (Opcional) Si necesitas apuntar a otro endpoint:

```
VITE_API_URL=http://localhost:3000/optimize
```

## Uso

- Selecciona un video desde el formulario.
- Presiona **Optimizar video** para enviarlo a la API.
- Al terminar, podrás previsualizar y descargar el archivo optimizado.

> Nota: el frontend envía el archivo en `FormData` con el campo `file` y agrega el header `x-api-key` con el valor de `VITE_API_KEY`.
