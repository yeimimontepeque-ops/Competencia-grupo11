# Bufete Popular App - AI Code Wars 2026

Prototipo de aplicación web para la gestión, seguimiento, cierre y reapertura de expedientes legales en el Bufete Popular. Desarrollado durante la competencia **AI Code Wars** de la Universidad Mariano Gálvez.

---

## Ficha de Análisis

- **Problema:** Gestión ineficiente de expedientes y falta de trazabilidad en los procesos legales atendidos en el Bufete Popular, dificultando el seguimiento cuando se recibe nueva información tras un cierre.
- **Usuario:** Asesores jurídicos y estudiantes practicantes del Bufete Popular.
- **Prioridades:**
  1. Registro y actualización rápida de estados de expedientes sin permitir datos vacíos.
  2. Búsqueda y consulta fluida de historial de casos.
  3. Validación estricta de cambios de estado (Apertura, Seguimiento, Cierre y Reapertura) manteniendo trazabilidad acumulativa sin sobrescribir información histórica.

---

## Organización del Equipo

| Integrante | Rol Principal | Responsabilidades Clave |
|---|---|---|
| **Emily Pérez** | CSS Developer | Diseños, estilos visuales, tematización responsiva y maquetación CSS de la interfaz. |
| **Yeltsin Hurtado** | HTML Developer | Estructura semántica HTML5, marcado de formularios, vistas y componentes del modal. |
| **Álvaro González** | JavaScript Developer | Lógica de negocio, manipulaciones del DOM, validaciones de estado, trazabilidad y `localStorage`. |
| **Yeimi Guerra** | Repository & Data Admin | Creación y administración del repositorio en GitHub, gestión de commits y control de entregables. |

---

## Uso Razonado de IA (Gemini)

| Decisión / Necesidad | Aporte de la IA (Gemini) | Decisión del equipo y razón | Método de comprobación |
|---|---|---|---|
| **Diseño de la app** | Propuso un layout con formulario y panel principal para listado de expedientes. | Se adoptó la estructura para optimizar el flujo de trabajo en una sola vista (*Single Page Application*). | Inspección visual en pantalla y verificación de usabilidad sin recargas. |
| **Persistencia de datos con `localStorage`** | Generó la estructura de datos inicial y funciones de serialización JSON. | Se implementó el almacenamiento local para preservar expedientes e historial al recargar el navegador sin requerir backend. | Recarga manual de la página (`F5`) verificando que los registros persistan. |
| **Flujo de Reapertura y Trazabilidad (Parte 2)** | Sugirió validar la condición de reapertura (solo en estado *Cerrado*), exigir motivo no vacío y preservar el historial previo acumulativo. | Se integró la regla en el código de JS para asegurar la validez legal del proceso de reapertura sin sobrescribir cierres ni actividades anteriores. | Intentar reabrir con motivo vacío o espacio en blanco (debe rechazar). Reabrir con motivo válido, agregar actividad, cerrar de nuevo y recargar (`F5`) confirmando la conservación de ambos cierres y sus actividades. |

---

## Lista de Comprobación de Recorridos

| Recorrido | Comprobación esperada | Resultado |
|---|---|---|
| **1. Apertura** | Crear dos expedientes con identificadores distintos; rechazar campos obligatorios incompletos. | Cumple |
| **2. Consulta** | Localizar por identificador y persona, abrir detalle e historial e informar una búsqueda sin resultados. | Cumple |
| **3. Seguimiento y cierre** | Agregar actividades, pasar a En seguimiento y cerrar con actividad previa y motivo. Rechazar cierres inválidos y bloquear actividades mientras esté cerrado. | Cumple |
| **4. Reapertura y trazabilidad** | Rechazar motivos vacíos y reaperturas en estados incorrectos. Reabrir válidamente, agregar una actividad y cerrar de nuevo. Conservar actividades y ambos cierres con sus fechas y motivos, incluso después de recargar la aplicación. | Cumple |

---

## Expedientes Ficticios de Prueba

### Expediente 1: `EXP-1001`
- **Solicitante:** CarlosM
- **Responsable:** Lic. Roberto Gómez
- **Categoría:** Laboral
- **Estado:** Abierto
- **Historial:**
  * `2026-10-25 09:00`: Expediente Abierto.
- **Actividades:** Ninguna registrada.

### Expediente 2: `EXP-1002`
- **Solicitante:** AnaG
- **Responsable:** Licda. Sofía Morales
- **Categoría:** Familiar
- **Estado:** En seguimiento
- **Historial:**
  * `2026-10-20 10:30`: Expediente Abierto.
  * `2026-10-22 14:15`: Presentación de demanda en juzgado (Actividad).
  * `2026-10-22 14:20`: Estado cambiado a En seguimiento.
- **Actividades:**
  * Presentación de demanda en juzgado.

---

## Instrucciones de Ejecución

### Requisitos Mínimos
- Navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
- Git para clonar el repositorio.

### Pasos para Ejecutar
1. Clonar este repositorio localmente:
   ```bash
   git clone [https://github.com/yeimimontepeque-ops/Competencia-grupo11.git](https://github.com/yeimimontepeque-ops/Competencia-grupo11.git)