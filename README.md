# ✦ LifeHub — Organiza tu vida en un solo lugar

LifeHub es una aplicación web para gestionar distintos aspectos de tu vida desde un único panel: tareas, hábitos, finanzas, metas, diario y un calendario que reúne todo lo que tiene fecha. Incluye **plantillas prediseñadas** para empezar en segundos.

![Tech](https://img.shields.io/badge/React-18-61dafb) ![Tech](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tech](https://img.shields.io/badge/Vite-6-646cff) ![Tech](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)

## ✨ Características

- **Inicio (Dashboard):** saludo según la hora, tarjetas-resumen y vista del día.
- **Tareas:** prioridades, categorías, fechas límite, filtros y aviso de vencidas.
- **Hábitos:** seguimiento semanal con cálculo de rachas y objetivo por semana.
- **Finanzas:** ingresos/gastos, balance mensual y presupuestos por categoría.
- **Metas:** objetivos medibles con progreso incremental.
- **Diario:** registro de estado de ánimo y notas.
- **Calendario:** vista mensual que agrega tareas, movimientos, diario y fechas límite de metas.
- **Plantillas prediseñadas:** Estudiante, Freelancer, Bienestar, Finanzas 50/30/20, Hogar, Productividad, Viaje, Emprendimiento y Aprendizaje.
- **Modo claro/oscuro**, diseño **responsive** y **persistencia local** (los datos se guardan en tu navegador, sin servidor).

## 🚀 Puesta en marcha

Requisitos: [Node.js](https://nodejs.org/) 18 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar el entorno de desarrollo
npm run dev
# Abre la URL que aparece en consola (por defecto http://localhost:5173)
```

### Build de producción

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve el build para previsualizarlo
```

## 🧱 Tecnologías

- **React 18** + **TypeScript** (modo estricto)
- **Vite 6** como bundler y servidor de desarrollo
- **Tailwind CSS 4** para los estilos
- Estado global con React Context y persistencia en `localStorage`

## 📁 Estructura del proyecto

```
src/
├─ App.tsx            # Layout, navegación y enrutado de vistas
├─ store.tsx          # Estado global + persistencia en localStorage
├─ types.ts           # Tipos del dominio
├─ icons.tsx          # Iconos SVG
├─ ui.tsx             # Componentes de interfaz reutilizables
├─ lib/               # utilidades, colores y plantillas
└─ views/             # Dashboard, Tasks, Habits, Finance, Goals,
                      # Journal, Calendar, Templates, Settings
```

## 🙏 Agradecimientos

El andamiaje y la implementación inicial de este proyecto se desarrollaron con la ayuda de **Kiro**, un asistente de desarrollo con IA. ¡Gracias por el apoyo en la construcción de LifeHub!

## 📄 Licencia

Publicado bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.
