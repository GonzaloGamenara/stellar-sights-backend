# 🛸 Stellar Sights – Backend  
**Servidor proxy para conectar con la API de exoplanetas de la NASA sin restricciones CORS.**

Este pequeño servidor fue desarrollado con **Node.js** y **Express**, y actúa como intermediario entre el frontend de Stellar Sights y la API pública del NASA Exoplanet Archive.

## ⚙️ ¿Por qué un proxy?

La API de la NASA tiene restricciones CORS, por lo que para poder acceder a los datos desde el navegador fue necesario crear este servidor intermedio que:

- 🔁 Redirige solicitudes del frontend a la API original  
- 🧼 Limpia y maneja cabeceras para evitar problemas CORS  
- 🚦 Puede ser fácilmente extendido para cacheo, filtrado o autenticación futura

## 🧩 Tecnologías

- **Node.js**
- **Express.js**
- **CORS Middleware**
