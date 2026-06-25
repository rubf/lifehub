# LifeHub

LifeHub es una aplicación web pensada para organizar distintos aspectos de la vida diaria desde un único lugar. La idea nació de querer dejar de saltar entre varias apps —una para tareas, otra para gastos, otra para hábitos— y reunir todo eso en un panel sencillo y agradable de usar.

Incluye plantillas listas para empezar, de modo que no hay que configurar nada desde cero: eliges un perfil (por ejemplo "Estudiante" o "Finanzas") y la app se rellena con tareas, hábitos, presupuestos y metas razonables que luego puedes ajustar a tu gusto.

## Demo

Versión en vivo: https://rubf.github.io/lifehub/

(La demo se actualiza automáticamente con cada cambio publicado en la rama `main`.)

## Qué puedes hacer

- **Inicio**: un resumen del día con saludo según la hora y accesos rápidos.
- **Tareas**: con prioridades, categorías, fechas límite y aviso de tareas vencidas.
- **Hábitos**: seguimiento semanal con rachas y un objetivo de días por semana.
- **Finanzas**: ingresos, gastos, balance mensual y presupuestos por categoría.
- **Metas**: objetivos medibles con progreso paso a paso.
- **Diario**: un registro diario del estado de ánimo y notas personales.
- **Calendario**: una vista mensual que reúne todo lo que tiene fecha (tareas, movimientos, entradas del diario y fechas límite de metas), con selectores rápidos de mes y año.
- **Plantillas**: Estudiante, Profesional/Freelancer, Bienestar, Finanzas 50/30/20, Hogar, Productividad, Viaje, Emprendimiento y Aprendizaje. Cada sección explica qué añade una plantilla al aplicarla.
- **Copia de seguridad**: exporta todos tus datos a un archivo CSV y vuelve a importarlos cuando quieras, para conservarlos o llevarlos a otro equipo.

Tiene modo claro y oscuro, un diseño cuidado con detalles interactivos y efectos 3D sutiles, funciona bien en móvil y escritorio, y toda la información se guarda en el propio navegador (no se envía a ningún servidor). Por cierto, esconde algún pequeño guiño para sacarte una sonrisa mientras lo usas.

## Cómo ejecutarlo en tu computadora

Necesitas tener instalado Node.js 18 o una versión más reciente.

```bash
# 1. Instalar las dependencias
npm install

# 2. Arrancar el entorno de desarrollo
npm run dev
```

Después abre en el navegador la dirección que aparece en la consola (por defecto http://localhost:5173).

Para generar la versión optimizada de producción:

```bash
npm run build      # crea la carpeta dist/
npm run preview    # sirve esa versión para revisarla
```

## Cómo se publica la demo

El repositorio incluye un flujo de GitHub Actions que compila el proyecto y lo publica en GitHub Pages cada vez que se actualiza la rama `main`. Para activarlo la primera vez hay que entrar en la configuración del repositorio, ir a la sección Pages y elegir "GitHub Actions" como origen.

## Tecnologías

- React 18 con TypeScript en modo estricto
- Vite como empaquetador y servidor de desarrollo
- Tailwind CSS para los estilos
- Estado global con React Context y persistencia en el navegador mediante localStorage

## Estructura del proyecto

```
src/
  App.tsx            Distribución general, navegación y cambio de vistas
  PremiumGate.tsx    Detalle interactivo opcional que aparece durante el uso
  store.tsx          Estado global y guardado en localStorage
  types.ts           Tipos de datos del proyecto
  icons.tsx          Iconos en formato SVG
  ui.tsx             Componentes de interfaz reutilizables (incluye el efecto 3D)
  lib/               Utilidades, colores, plantillas y exportación/importación CSV
  views/             Inicio, Tareas, Hábitos, Finanzas, Metas,
                     Diario, Calendario, Plantillas y Ajustes
```

## Agradecimientos

La estructura inicial y buena parte de la implementación se desarrollaron con la ayuda de Kiro, un asistente de desarrollo basado en inteligencia artificial. Fue de gran ayuda para arrancar el proyecto con una base ordenada.

## Licencia

Este proyecto NO es de código abierto. Se publica únicamente para que se pueda ver y usar.

Está permitido:

- Ver y consultar el código fuente.
- Usar la aplicación (en la demo oficial o ejecutándola en local para uso personal).

No está permitido (sin autorización por escrito del autor):

- Usarlo con fines comerciales.
- Modificarlo o crear trabajos derivados.
- Redistribuirlo, publicarlo o desplegarlo en otros servidores, dominios o cuentas.

Consulta el archivo [LICENSE](./LICENSE) para ver los términos completos. Todos los derechos reservados.
