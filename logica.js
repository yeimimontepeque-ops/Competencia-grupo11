// ESTADO INICIAL Y PERSISTENCIA (LOCALSTORAGE)
let expedientes = JSON.parse(localStorage.getItem('expedientes_bufete')) || [
  {
    id: "EXP-1001",
    solicitante: "CarlosM",
    responsable: "Lic. Roberto Gómez",
    categoria: "Laboral",
    descripcion: "Despido injustificado sin pago de indemnización.",
    estado: "Abierto",
    historial: [
      { tipo: "estado", descripcion: "Expediente Abierto", fecha: "2026-10-25 09:00" }
    ]
  },
  {
    id: "EXP-1002",
    solicitante: "AnaG",
    responsable: "Licda. Sofía Morales",
    categoria: "Familiar",
    descripcion: "Fijación de pensión alimenticia.",
    estado: "En seguimiento",
    historial: [
      { tipo: "estado", descripcion: "Expediente Abierto", fecha: "2026-10-20 10:30" },
      { tipo: "actividad", descripcion: "Presentación de demanda en juzgado.", fecha: "2026-10-22 14:15" },
      { tipo: "estado", descripcion: "Estado cambiado a En seguimiento", fecha: "2026-10-22 14:20" }
    ]
  }
];

let expedienteSeleccionadoId = null;

function guardarDatos() {
  localStorage.setItem('expedientes_bufete', JSON.stringify(expedientes));
}

function obtenerFechaActual() {
  const hoy = new Date();
  return hoy.toISOString().slice(0, 10) + ' ' + hoy.toTimeString().slice(0, 5);
}

function renderizarTabla(lista = expedientes) {
  const tbody = document.getElementById('expedientes-tbody');
  const noResults = document.getElementById('no-results');
  tbody.innerHTML = '';

  if (lista.length === 0) {
    noResults.style.display = 'block';
    return;
  } else {
    noResults.style.display = 'none';
  }

  lista.forEach(exp => {
    const badgeClass = exp.estado === 'Abierto' ? 'badge-abierto' : 
                      exp.estado === 'En seguimiento' ? 'badge-seguimiento' : 'badge-cerrado';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${exp.id}</strong></td>
      <td>${exp.solicitante}</td>
      <td>${exp.responsable}</td>
      <td><span class="badge ${badgeClass}">${exp.estado}</span></td>
      <td><button class="btn" style="padding: 4px 8px; font-size: 0.8rem;" onclick="abrirModal('${exp.id}')">Ver / Gestionar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// APERTURA DE EXPEDIENTE (REQUISITO 3.1)
document.getElementById('expediente-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const solicitante = document.getElementById('solicitante').value.trim();
  const responsable = document.getElementById('responsable').value.trim();
  const categoria = document.getElementById('categoria').value;
  const descripcion = document.getElementById('descripcion').value.trim();
  const errorDiv = document.getElementById('form-error');

  // Rechazar campos obligatorios vacíos o compuestos solo por espacios
  if (!solicitante || !responsable || !descripcion) {
    errorDiv.style.display = 'block';
    return;
  }

  errorDiv.style.display = 'none';

  const nuevoId = 'EXP-' + Math.floor(1000 + Math.random() * 9000);
  const nuevoExpediente = {
    id: nuevoId,
    solicitante,
    responsable,
    categoria: categoria || 'No especificada',
    descripcion,
    estado: 'Abierto',
    historial: [
      { tipo: 'estado', descripcion: 'Expediente Abierto', fecha: obtenerFechaActual() }
    ]
  };

  expedientes.unshift(nuevoExpediente);
  guardarDatos();
  renderizarTabla();
  this.reset();
  alert(`Expediente ${nuevoId} creado exitosamente.`);
});

// BÚSQUEDA Y FILTRADO (REQUISITO 3.2)
function filtrarExpedientes() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const filtrados = expedientes.filter(exp => 
    exp.id.toLowerCase().includes(query) ||
    exp.solicitante.toLowerCase().includes(query) ||
    exp.responsable.toLowerCase().includes(query)
  );
  renderizarTabla(filtrados);
}

// VISTA DETALLADA Y MODAL
function abrirModal(id) {
  expedienteSeleccionadoId = id;
  const exp = expedientes.find(e => e.id === id);
  if (!exp) return;

  document.getElementById('modal-titulo').innerText = `Expediente #${exp.id}`;
  
  const badgeClass = exp.estado === 'Abierto' ? 'badge-abierto' : 
                        exp.estado === 'En seguimiento' ? 'badge-seguimiento' : 'badge-cerrado';

  document.getElementById('modal-info').innerHTML = `
    <p><strong>Solicitante:</strong> ${exp.solicitante}</p>
    <p><strong>Responsable:</strong> ${exp.responsable}</p>
    <p><strong>Categoría:</strong> ${exp.categoria}</p>
    <p><strong>Estado Actual:</strong> <span class="badge ${badgeClass}">${exp.estado}</span></p>
    <p style="margin-top: 8px;"><strong>Descripción del Asunto:</strong></p>
    <p style="background: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">${exp.descripcion}</p>
  `;

  const accionesContainer = document.getElementById('acciones-container');
  const reaperturaContainer = document.getElementById('reapertura-container');
  const btnSeguimiento = document.getElementById('btn-estado-seguimiento');

  if (exp.estado === 'Cerrado') {
    accionesContainer.style.display = 'none';
    reaperturaContainer.style.display = 'block';
  } else {
    accionesContainer.style.display = 'block';
    reaperturaContainer.style.display = 'none';
    btnSeguimiento.disabled = (exp.estado === 'En seguimiento');
  }

  renderizarTimeline(exp);
  document.getElementById('detalle-modal').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('detalle-modal').style.display = 'none';
  document.getElementById('nueva-actividad').value =  '';
  document.getElementById('motivo-cierre').value = '';
  document.getElementById('motivo-reapertura').value = '';
}

function renderizarTimeline(exp) {
  const container = document.getElementById('timeline-container');
  container.innerHTML = '';

  exp.historial.slice().reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = `timeline-item ${item.tipo}`;
    div.innerHTML = `
      <div class="timeline-type ${item.tipo}">${item.tipo === 'estado' ? 'Cambio de Estado' : 'Actividad'}</div>
      <div>${item.descripcion}</div>
      <div class="timeline-date">${item.fecha}</div>
    `;
    container.appendChild(div);
  });
}

// REGISTRO DE ACTIVIDADES (REQUISITO 3.3)
function agregarActividad() {
  const descInput = document.getElementById('nueva-actividad');
  const descripcion = descInput.value.trim();

  if (!descripcion) {
    alert('Requisito no cumplido: La descripción de la actividad no puede estar vacía ni contener solo espacios.');
    return;
  }

  const exp = expedientes.find(e => e.id === expedienteSeleccionadoId);

  // Prohibición si está cerrado (Requisito 3.4 y C.1)
  if (exp.estado === 'Cerrado') {
    alert('Operación rechazada: No se admiten actividades mientras el expediente permanezca CERRADO.');
    return;
  }

  exp.historial.push({
    tipo: 'actividad',
    descripcion: descripcion,
    fecha: obtenerFechaActual()
  });

  guardarDatos();
  descInput.value = '';
  renderizarTimeline(exp);
  alert('Actividad registrada exitosamente.');
}

// CAMBIO DE ESTADO A EN SEGUIMIENTO (REQUISITO 3.4)
function cambiarAEnSeguimiento() {
  const exp = expedientes.find(e => e.id === expedienteSeleccionadoId);
  if (exp.estado === 'Abierto') {
    exp.estado = 'En seguimiento';
    exp.historial.push({
      tipo: 'estado',
      descripcion: "Estado cambiado a 'En seguimiento'",
      fecha: obtenerFechaActual()
    });
    guardarDatos();
    renderizarTabla();
    abrirModal(exp.id);
  }
}

// CIERRE DE EXPEDIENTE (REQUISITO 3.4)
function cerrarExpediente() {
  const exp = expedientes.find(e => e.id === expedienteSeleccionadoId);
  const motivo = document.getElementById('motivo-cierre').value.trim();

  // Exigir al menos una actividad previa registrada
  const tieneActividades = exp.historial.some(h => h.tipo === 'actividad');
  if (!tieneActividades) {
    alert('Requisito no cumplido: Debe registrar al menos una actividad antes de cerrar el expediente.');
    return;
  }

  // Exigir motivo no vacío ni compuesto solo por espacios
  if (!motivo) {
    alert('Requisito no cumplido: El motivo de cierre no puede estar vacío ni contener únicamente espacios.');
    return;
  }

  exp.estado = 'Cerrado';
  exp.historial.push({
    tipo: 'estado',
    descripcion: `Expediente CERRADO. Motivo: ${motivo}`,
    fecha: obtenerFechaActual()
  });

  guardarDatos();
  renderizarTabla();
  abrirModal(exp.id);
  alert('El expediente ha sido cerrado correctamente.');
}

// REAPERTURA DE EXPEDIENTE (REQUISITO C.1 PARTE 2)
function reabrirExpediente() {
  const exp = expedientes.find(e => e.id === expedienteSeleccionadoId);
  const motivo = document.getElementById('motivo-reapertura').value.trim();

  // Regla C.1.5: Rechazar la reapertura si está Abierto o En seguimiento (aplicado en la lógica)
  if (exp.estado !== 'Cerrado') {
    alert('Operación rechazada: Solo se pueden reabrir expedientes en estado CERRADO.');
    return;
  }

  // Regla C.1.1: Exigir motivo no vacío ni compuesto solo por espacios
  if (!motivo) {
    alert('Requisito no cumplido: El motivo de reapertura no puede estar vacío ni contener únicamente espacios.');
    return;
  }

  // Reglas C.1.2 y C.1.3: Cambiar a 'En seguimiento' agregando evento al historial conservando cierres y datos previos
  exp.estado = 'En seguimiento';
  exp.historial.push({
    tipo: 'estado',
    descripcion: `Expediente REABIERTO -> Estado cambiado a 'En seguimiento'. Motivo: ${motivo}`,
    fecha: obtenerFechaActual()
  });

  guardarDatos();
  renderizarTabla();
  abrirModal(exp.id);
  alert('El expediente ha sido reabierto exitosamente.');
}

renderizarTabla();