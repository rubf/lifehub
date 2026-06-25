import type { LifeTemplate } from "../types";

// Pre-designed life-management templates. Applying one seeds the
// relevant modules (tasks, habits, budgets, goals) with sensible defaults.
export const TEMPLATES: LifeTemplate[] = [
  {
    id: "estudiante",
    name: "Estudiante",
    emoji: "🎓",
    tagline: "Estudia con foco y sin agobios",
    description:
      "Organiza asignaturas, exámenes y hábitos de estudio. Ideal para mantener el ritmo durante el curso.",
    accent: "indigo",
    highlights: ["Plan de estudio semanal", "Hábito de lectura", "Meta de aprobados"],
    seed: {
      tasks: [
        { title: "Revisar apuntes del día", priority: "media", category: "Estudio" },
        { title: "Preparar próximo examen", priority: "alta", category: "Exámenes", dueInDays: 7 },
        { title: "Entregar trabajo práctico", priority: "alta", category: "Entregas", dueInDays: 3 },
        { title: "Organizar horario semanal", priority: "baja", category: "Planificación" },
      ],
      habits: [
        { name: "Estudiar 1h", icon: "📚", color: "indigo", target: 5 },
        { name: "Leer 20 min", icon: "📖", color: "violet", target: 7 },
        { name: "Dormir 8h", icon: "😴", color: "sky", target: 7 },
      ],
      goals: [
        {
          title: "Aprobar todas las asignaturas",
          description: "Mantener el promedio por encima del objetivo.",
          target: 6,
          current: 0,
          unit: "asignaturas",
          deadlineInDays: 120,
        },
      ],
    },
  },
  {
    id: "freelancer",
    name: "Profesional / Freelancer",
    emoji: "💼",
    tagline: "Gestiona clientes, ingresos y foco",
    description:
      "Equilibra proyectos, facturación y productividad. Pensado para quien trabaja por cuenta propia.",
    accent: "emerald",
    highlights: ["Seguimiento de ingresos", "Tareas por proyecto", "Meta de facturación"],
    seed: {
      tasks: [
        { title: "Enviar factura del mes", priority: "alta", category: "Administración", dueInDays: 2 },
        { title: "Responder correos de clientes", priority: "media", category: "Clientes" },
        { title: "Avanzar proyecto principal", priority: "alta", category: "Proyectos" },
        { title: "Actualizar portafolio", priority: "baja", category: "Marketing", dueInDays: 14 },
      ],
      habits: [
        { name: "Bloque de foco 90 min", icon: "🎯", color: "emerald", target: 5 },
        { name: "Registrar horas", icon: "⏱️", color: "teal", target: 5 },
        { name: "Pausa activa", icon: "🚶", color: "amber", target: 5 },
      ],
      budgets: [
        { name: "Herramientas / software", limit: 80, color: "emerald" },
        { name: "Impuestos (reserva)", limit: 400, color: "rose" },
        { name: "Formación", limit: 60, color: "sky" },
      ],
      goals: [
        {
          title: "Facturación mensual",
          description: "Objetivo de ingresos para este mes.",
          target: 3000,
          current: 0,
          unit: "€",
          deadlineInDays: 30,
        },
      ],
    },
  },
  {
    id: "bienestar",
    name: "Bienestar y Salud",
    emoji: "🧘",
    tagline: "Cuida tu cuerpo y tu mente",
    description:
      "Hábitos saludables, hidratación, ejercicio y descanso. Para sentirte mejor cada día.",
    accent: "rose",
    highlights: ["Rutina de hábitos", "Meta de ejercicio", "Diario de ánimo"],
    seed: {
      tasks: [
        { title: "Preparar comidas saludables", priority: "media", category: "Salud" },
        { title: "Reservar clase / entrenamiento", priority: "baja", category: "Ejercicio", dueInDays: 2 },
        { title: "Cita médica anual", priority: "media", category: "Salud", dueInDays: 30 },
      ],
      habits: [
        { name: "Beber 2L de agua", icon: "💧", color: "sky", target: 7 },
        { name: "Ejercicio 30 min", icon: "🏃", color: "rose", target: 4 },
        { name: "Meditar 10 min", icon: "🧘", color: "violet", target: 5 },
        { name: "8.000 pasos", icon: "👟", color: "amber", target: 6 },
      ],
      goals: [
        {
          title: "Entrenar este mes",
          description: "Sesiones de ejercicio completadas.",
          target: 16,
          current: 0,
          unit: "sesiones",
          deadlineInDays: 30,
        },
      ],
    },
  },
  {
    id: "finanzas",
    name: "Finanzas 50/30/20",
    emoji: "💰",
    tagline: "Controla tu dinero con un método claro",
    description:
      "Presupuesto basado en la regla 50/30/20: necesidades, deseos y ahorro. Toma el control de tus gastos.",
    accent: "amber",
    highlights: ["Presupuesto por categorías", "Meta de ahorro", "Control de gastos"],
    seed: {
      tasks: [
        { title: "Registrar gastos de la semana", priority: "media", category: "Finanzas" },
        { title: "Revisar suscripciones", priority: "baja", category: "Finanzas", dueInDays: 7 },
        { title: "Transferir al ahorro", priority: "alta", category: "Finanzas", dueInDays: 3 },
      ],
      budgets: [
        { name: "Necesidades (vivienda, comida)", limit: 1000, color: "sky" },
        { name: "Deseos (ocio, compras)", limit: 600, color: "violet" },
        { name: "Ahorro / inversión", limit: 400, color: "emerald" },
      ],
      goals: [
        {
          title: "Fondo de emergencia",
          description: "Ahorrar el equivalente a varios meses de gastos.",
          target: 5000,
          current: 0,
          unit: "€",
          deadlineInDays: 365,
        },
      ],
    },
  },
  {
    id: "hogar",
    name: "Hogar y Familia",
    emoji: "🏡",
    tagline: "La casa en orden, la mente tranquila",
    description:
      "Tareas del hogar, compras y planificación familiar. Reparte responsabilidades y no olvides nada.",
    accent: "teal",
    highlights: ["Rutina de limpieza", "Lista de compras", "Gastos del hogar"],
    seed: {
      tasks: [
        { title: "Hacer la compra semanal", priority: "media", category: "Compras", dueInDays: 2 },
        { title: "Limpieza general", priority: "media", category: "Hogar", dueInDays: 6 },
        { title: "Pagar facturas del hogar", priority: "alta", category: "Hogar", dueInDays: 5 },
        { title: "Planificar menú de la semana", priority: "baja", category: "Comidas" },
      ],
      habits: [
        { name: "Ordenar 10 min", icon: "🧹", color: "teal", target: 7 },
        { name: "Cocinar en casa", icon: "🍳", color: "amber", target: 5 },
      ],
      budgets: [
        { name: "Supermercado", limit: 400, color: "teal" },
        { name: "Servicios (luz, agua, internet)", limit: 200, color: "sky" },
        { name: "Mantenimiento", limit: 100, color: "amber" },
      ],
    },
  },
  {
    id: "productividad",
    name: "Productividad diaria",
    emoji: "⚡",
    tagline: "Haz que cada día cuente",
    description:
      "Rutina diaria con prioridades claras y hábitos de alto impacto. Para quien quiere lograr más con menos estrés.",
    accent: "violet",
    highlights: ["Top 3 del día", "Hábitos clave", "Revisión semanal"],
    seed: {
      tasks: [
        { title: "Definir las 3 tareas más importantes", priority: "alta", category: "Planificación" },
        { title: "Revisión semanal", priority: "media", category: "Planificación", dueInDays: 7 },
        { title: "Vaciar la bandeja de entrada", priority: "baja", category: "Admin" },
      ],
      habits: [
        { name: "Planificar el día", icon: "📝", color: "violet", target: 7 },
        { name: "Trabajo profundo", icon: "🧠", color: "indigo", target: 5 },
        { name: "Sin pantallas 1h antes de dormir", icon: "🌙", color: "sky", target: 6 },
      ],
      goals: [
        {
          title: "Semanas con revisión completada",
          target: 12,
          current: 0,
          unit: "semanas",
          deadlineInDays: 90,
        },
      ],
    },
  },
  {
    id: "viaje",
    name: "Viaje / Vacaciones",
    emoji: "✈️",
    tagline: "Planifica tu viaje sin estrés",
    description:
      "Reservas, equipaje, presupuesto y planes. Para que no se te escape ningún detalle antes de salir.",
    accent: "sky",
    highlights: ["Checklist de equipaje", "Presupuesto del viaje", "Ahorro objetivo"],
    seed: {
      tasks: [
        { title: "Reservar vuelos", priority: "alta", category: "Reservas", dueInDays: 5 },
        { title: "Reservar alojamiento", priority: "alta", category: "Reservas", dueInDays: 7 },
        { title: "Hacer la maleta", priority: "media", category: "Equipaje", dueInDays: 20 },
        { title: "Revisar documentación (pasaporte, seguro)", priority: "alta", category: "Documentos", dueInDays: 10 },
        { title: "Planificar itinerario", priority: "baja", category: "Planes" },
      ],
      budgets: [
        { name: "Transporte", limit: 400, color: "sky" },
        { name: "Alojamiento", limit: 500, color: "indigo" },
        { name: "Comida y ocio", limit: 300, color: "amber" },
      ],
      goals: [
        {
          title: "Ahorro para el viaje",
          description: "Reúne el presupuesto antes de la fecha de salida.",
          target: 1500,
          current: 0,
          unit: "€",
          deadlineInDays: 60,
        },
      ],
    },
  },
  {
    id: "emprendimiento",
    name: "Emprendimiento",
    emoji: "🚀",
    tagline: "Lanza tu proyecto paso a paso",
    description:
      "Valida tu idea, construye y lanza. Organiza las tareas clave de un nuevo negocio o proyecto personal.",
    accent: "violet",
    highlights: ["Hoja de ruta de lanzamiento", "Hábito de constancia", "Meta de clientes"],
    seed: {
      tasks: [
        { title: "Definir la propuesta de valor", priority: "alta", category: "Estrategia" },
        { title: "Validar idea con 10 personas", priority: "alta", category: "Validación", dueInDays: 14 },
        { title: "Crear landing page", priority: "media", category: "Producto", dueInDays: 21 },
        { title: "Configurar redes sociales", priority: "baja", category: "Marketing", dueInDays: 10 },
      ],
      habits: [
        { name: "Trabajar en el proyecto", icon: "🧠", color: "violet", target: 6 },
        { name: "Hablar con 1 cliente", icon: "📝", color: "emerald", target: 3 },
      ],
      budgets: [
        { name: "Herramientas / hosting", limit: 50, color: "violet" },
        { name: "Publicidad", limit: 150, color: "rose" },
      ],
      goals: [
        {
          title: "Primeros clientes",
          description: "Conseguir los primeros usuarios o ventas.",
          target: 10,
          current: 0,
          unit: "clientes",
          deadlineInDays: 90,
        },
      ],
    },
  },
  {
    id: "aprendizaje",
    name: "Aprendizaje y Crecimiento",
    emoji: "🌱",
    tagline: "Aprende algo nuevo cada día",
    description:
      "Cursos, lectura y práctica para desarrollar una nueva habilidad de forma constante y medible.",
    accent: "emerald",
    highlights: ["Hábito de práctica diaria", "Meta de horas", "Plan de estudio"],
    seed: {
      tasks: [
        { title: "Elegir curso o recurso principal", priority: "alta", category: "Planificación" },
        { title: "Definir proyecto práctico", priority: "media", category: "Práctica", dueInDays: 7 },
        { title: "Repasar lo aprendido en la semana", priority: "baja", category: "Repaso", dueInDays: 7 },
      ],
      habits: [
        { name: "Practicar 30 min", icon: "🧠", color: "emerald", target: 6 },
        { name: "Leer / curso", icon: "📚", color: "indigo", target: 5 },
        { name: "Tomar notas", icon: "📝", color: "amber", target: 5 },
      ],
      goals: [
        {
          title: "Horas de práctica",
          description: "Acumula horas para dominar la habilidad.",
          target: 50,
          current: 0,
          unit: "horas",
          deadlineInDays: 90,
        },
      ],
    },
  },
];

export function getTemplate(id: string): LifeTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
