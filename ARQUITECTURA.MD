# 🏗️ Arquitectura del Proyecto - LUMINA

## 📌 Tipo de Arquitectura

El proyecto **LUMINA** actualmente implementa una arquitectura basada en **frontend desacoplado**, desarrollada como una **Single Page Application (SPA)**.

En su estado actual, puede considerarse como una arquitectura:

### 🧩 Monolítica (Frontend)

- Toda la lógica de la aplicación reside en el cliente (frontend)
- No existe aún un backend integrado
- La autenticación se gestiona mediante un servicio externo (Auth0)

Esto permite simplicidad en el desarrollo inicial, pero está diseñada para evolucionar hacia arquitecturas más robustas.

---

## 🧠 Enfoque Arquitectónico

LUMINA sigue principios modernos de desarrollo:

- 🔹 Arquitectura basada en componentes  
- 🔹 Separación por responsabilidades (pages, components, subcomponents)  
- 🔹 Reutilización de componentes  
- 🔹 Navegación desacoplada mediante rutas  

---

## 🧱 Estructura Arquitectónica

El sistema se divide en tres capas principales dentro del frontend:

### 1. 🧩 Componentes Base (`components/`)
Contiene elementos reutilizables y funcionales como:

- Login
- Registro
- Elementos base de interacción

---

### 2. 🔧 Subcomponentes (`subcomponents/`)
Componentes estructurales globales:

- Navbar (navegación)
- Footer
- SearchBar
- Menu

Estos se reutilizan en toda la aplicación.

---

### 3. 📄 Páginas (`pages/`)
Representan las vistas principales de la aplicación:

- Welcome (inicio)
- LuminaPage (página principal)
- Profile
- Nosotros
- Contacto
- Experiencias

Cada página funciona como una unidad independiente dentro del sistema de rutas.

---

## 🔐 Autenticación

El sistema utiliza un servicio externo:

- Auth0

Esto permite:

- Manejo seguro de autenticación  
- Escalabilidad sin necesidad de implementar backend propio inicialmente  
- Integración sencilla con aplicaciones modernas  

---

## 🔄 Evolución Arquitectónica (Futuro)

El proyecto está diseñado para evolucionar hacia arquitecturas más avanzadas como:

### 🔹 Cliente-Servidor (Client-Server)

- Frontend (React)
- Backend (API REST )

---

### 🔹 Arquitectura por Capas

- Capa de presentación (Frontend)
- Capa lógica (Backend)
- Capa de datos (Base de datos)

---

### 🔹 Microservicios (opcional)

Para escalabilidad futura:

- Servicio de usuarios
- Servicio de experiencias
- Servicio de autenticación
- Servicio de contenido

---

## 🛠️ Stack Tecnológico Actual

### 🎨 Frontend

- React  
- React Router  
- CSS3  
- JavaScript (ES6+)  

---

### 🔐 Autenticación

- Auth0  

---

## 🚀 Posibles Stacks a Futuro

Dependiendo de la evolución del proyecto, se pueden implementar distintos stacks:

---

### 🟢 Opción 1: MERN Stack

- MongoDB (Base de datos)  
- Express.js (Backend)  
- React (Frontend)  
- Node.js (Servidor)  

✔️ Ideal para aplicaciones full JavaScript

---

### 🔵 Opción 2: PERN Stack

- PostgreSQL  
- Express.js  
- React  
- Node.js  

✔️ Mejor manejo de datos relacionales

---



### 🟡 Opción 3: Backend con Firebase

- Firebase Authentication  
- Firestore (Base de datos)  
- Hosting en Firebase  

✔️ Fácil implementación y rápido despliegue

---



## 📈 Escalabilidad

El diseño actual permite:

- Escalar el frontend fácilmente  
- Integrar backend sin reestructurar completamente el proyecto  
- Adaptarse a nuevas funcionalidades  

---

## ⭐ Conclusión

La arquitectura de **LUMINA** está diseñada como una base flexible y escalable. Aunque actualmente funciona como una aplicación frontend monolítica, su estructura permite evolucionar hacia sistemas más complejos como arquitecturas cliente-servidor o incluso microservicios.

Esto lo convierte en un proyecto ideal tanto para aprendizaje como para desarrollo profesional a futuro.