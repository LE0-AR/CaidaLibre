const g = 9.81; // Aceleración gravitacional en m/s²

function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Mantener sección activa tras recargar
document.addEventListener('DOMContentLoaded', () => {
    const ultima = localStorage.getItem('seccionActiva') || 'inicio';
    mostrarSeccion(ultima);
});

// Cálculos directos
async function calcularVelocidad() {
    const { value: formValues } = await Swal.fire({
        title: 'Calcular Velocidad',
        html: `
            <div class="form-group">
                <label for="altura">Altura (metros)</label>
                <input type="number" id="altura" class="swal2-input" required>
            </div>
            <div class="form-group">
                <label for="tiempo">Tiempo (segundos)</label>
                <input type="number" id="tiempo" class="swal2-input" required>
            </div>
            <div class="form-group">
                <label for="velocidadInicial">Velocidad Inicial (m/s)</label>
                <input type="number" id="velocidadInicial" class="swal2-input" value="0">
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Calcular',
        showCancelButton: true,
        preConfirm: () => {
            const valores = {
                altura: parseFloat(document.getElementById('altura').value),
                tiempo: parseFloat(document.getElementById('tiempo').value),
                velocidadInicial: parseFloat(document.getElementById('velocidadInicial').value) || 0
            };
            if (!valores.altura || !valores.tiempo || valores.altura < 0 || valores.tiempo <= 0) {
                Swal.showValidationMessage('Por favor ingrese valores válidos');
                return false;
            }
            return valores;
        }
    });

    if (formValues) {
        const { altura, tiempo, velocidadInicial } = formValues;
        const velocidadFinal = velocidadInicial + g * tiempo;

        await Swal.fire({
            title: 'Resultados',
            html: `
                <div class="alert alert-info">
                    <h4>Resultados del cálculo:</h4>
                    <p>🚀 Velocidad final: ${velocidadFinal.toFixed(2)} m/s</p>
                    <p>📊 Velocidad inicial: ${velocidadInicial} m/s</p>
                    <p>📏 Altura: ${altura} metros</p>
                    <p>⏱️ Tiempo: ${tiempo} segundos</p>
                </div>
            `,
            icon: 'success'
        });
    }
}

async function calcularAltura() {
    const { value: formValues } = await Swal.fire({
        title: 'Calcular Altura',
        html: `
            <input id="velocidad" class="swal2-input" placeholder="Velocidad inicial (m/s)">
            <input id="tiempo" class="swal2-input" placeholder="Tiempo (s)">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                velocidad: document.getElementById('velocidad').value,
                tiempo: document.getElementById('tiempo').value
            }
        }
    });

    if (formValues) {
        const v0 = parseFloat(formValues.velocidad);
        const t = parseFloat(formValues.tiempo);
        const h = v0 * t - (0.5 * g * t * t);
        
        Swal.fire({
            title: 'Resultado',
            html: `
                <p>Altura: ${h.toFixed(2)} m</p>
                <p>Velocidad inicial: ${v0} m/s</p>
                <p>Tiempo: ${t} s</p>
            `,
            icon: 'success'
        });
    }
}

// Simulación visual
async function iniciarSimulacion() {
    const { value: altura } = await Swal.fire({
        title: 'Altura inicial',
        input: 'number',
        inputLabel: 'Ingrese la altura inicial (m)',
        inputPlaceholder: 'Altura en metros'
    });

    if (altura) {
        const container = document.getElementById('simulacion-container');
        const ball = document.createElement('div');
        ball.style.width = '20px';
        ball.style.height = '20px';
        ball.style.backgroundColor = 'red';
        ball.style.borderRadius = '50%';
        ball.style.position = 'relative';
        ball.style.top = '0';
        
        container.innerHTML = '';
        container.appendChild(ball);

        const tiempoCaida = Math.sqrt((2 * altura) / g);
        const duracion = tiempoCaida * 1000; // Convertir a milisegundos

        ball.animate([
            { top: '0px' },
            { top: (container.offsetHeight - 20) + 'px' }
        ], {
            duration: duracion,
            easing: 'linear'
        });

        setTimeout(() => {
            Swal.fire({
                title: 'Simulación completada',
                html: `
                    <p>Tiempo de caída: ${tiempoCaida.toFixed(2)} segundos</p>
                    <p>Velocidad final: ${(g * tiempoCaida).toFixed(2)} m/s</p>
                `,
                icon: 'success'
            });
        }, duracion);
    }
}

// Cálculos inversos
async function calcularInversoVelocidad() {
    const { value: velocidadFinal } = await Swal.fire({
        title: 'Cálculo Inverso - Velocidad Final',
        input: 'number',
        inputLabel: 'Ingrese la velocidad final (m/s)',
        inputPlaceholder: 'Ejemplo: 20',
        confirmButtonText: 'Calcular',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value || value <= 0) {
                return 'Por favor ingrese un valor válido mayor que 0';
            }
        }
    });

    if (velocidadFinal) {
        const tiempo = velocidadFinal / g;
        const altura = (velocidadFinal * velocidadFinal) / (2 * g);

        await Swal.fire({
            title: 'Resultados del Cálculo',
            html: `
                <div class="alert alert-success">
                    <h4>Para alcanzar ${velocidadFinal} m/s:</h4>
                    <p>⏱️ Tiempo necesario: ${tiempo.toFixed(2)} segundos</p>
                    <p>📏 Altura inicial requerida: ${altura.toFixed(2)} metros</p>
                    <p>🌍 Gravedad utilizada: ${g} m/s²</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    }
}

async function calcularInversoAltura() {
    const { value: formValues } = await Swal.fire({
        title: 'Cálculo Inverso - Desde Altura',
        html: `
            <div class="form-group">
                <label for="altura">Altura de caída (metros)</label>
                <input type="number" id="altura" class="swal2-input" placeholder="Ejemplo: 100">
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Calcular',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const altura = document.getElementById('altura').value;
            if (!altura || altura <= 0) {
                Swal.showValidationMessage('Por favor ingrese una altura válida mayor que 0');
                return false;
            }
            return {
                altura: parseFloat(altura)
            };
        }
    });

    if (formValues) {
        const altura = formValues.altura;
        const tiempo = Math.sqrt((2 * altura) / g);
        const velocidadFinal = g * tiempo;

        await Swal.fire({
            title: 'Resultados del Cálculo',
            html: `
                <div class="alert alert-info">
                    <h4>Para una caída desde ${altura} metros:</h4>
                    <p>⏱️ Tiempo total de caída: ${tiempo.toFixed(2)} segundos</p>
                    <p>🚀 Velocidad final: ${velocidadFinal.toFixed(2)} m/s</p>
                    <p>🌍 Gravedad utilizada: ${g} m/s²</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    }
}

async function calcularTiempo() {
    const { value: formValues } = await Swal.fire({
        title: 'Calcular Tiempo',
        html: `
            <div class="form-group">
                <label for="altura">Altura (metros)</label>
                <input type="number" id="altura" class="swal2-input" placeholder="Ejemplo: 100">
            </div>
            <div class="form-group">
                <label for="velocidadInicial">Velocidad Inicial (m/s)</label>
                <input type="number" id="velocidadInicial" class="swal2-input" placeholder="Ejemplo: 0">
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Calcular',
        showCancelButton: true,
        preConfirm: () => {
            const h = document.getElementById('altura').value;
            const v0 = document.getElementById('velocidadInicial').value;
            if (!h || h < 0) {
                Swal.showValidationMessage('Ingrese una altura válida');
                return false;
            }
            return {
                altura: parseFloat(h),
                velocidadInicial: parseFloat(v0) || 0
            };
        }
    });

    if (formValues) {
        const { altura, velocidadInicial } = formValues;
        // Fórmula: t = (-v0 ± √(v0² + 2gh))/g
        const tiempo = (-velocidadInicial + Math.sqrt(Math.pow(velocidadInicial, 2) + 2 * g * altura)) / g;

        await Swal.fire({
            title: 'Resultados',
            html: `
                <div class="alert alert-success">
                    <h4>Resultados del cálculo:</h4>
                    <p>⏱️ Tiempo de caída: ${tiempo.toFixed(2)} segundos</p>
                    <p>📏 Altura inicial: ${altura} metros</p>
                    <p>🚀 Velocidad inicial: ${velocidadInicial} m/s</p>
                    <p>🎯 Velocidad final: ${(velocidadInicial + g * tiempo).toFixed(2)} m/s</p>
                </div>
            `,
            icon: 'success'
        });
    }
}

async function simularEnPlaneta(nombrePlaneta, gravedadPlaneta) {
    const { value: altura } = await Swal.fire({
        title: `Simulación en ${nombrePlaneta}`,
        input: 'number',
        inputLabel: 'Altura inicial (metros)',
        inputPlaceholder: 'Ingrese la altura',
        confirmButtonText: 'Simular',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value || value <= 0) {
                return 'Por favor ingrese una altura válida';
            }
        }
    });

    if (altura) {
        const tiempoCaida = Math.sqrt((2 * altura) / gravedadPlaneta);
        const velocidadFinal = gravedadPlaneta * tiempoCaida;

        await Swal.fire({
            title: `Resultados en ${nombrePlaneta}`,
            html: `
                <div class="alert alert-info">
                    <h4>Con gravedad de ${gravedadPlaneta} m/s²:</h4>
                    <p>⏱️ Tiempo de caída: ${tiempoCaida.toFixed(2)} segundos</p>
                    <p>🚀 Velocidad final: ${velocidadFinal.toFixed(2)} m/s</p>
                    <p>📏 Altura inicial: ${altura} metros</p>
                    <p>🌍 Comparación con la Tierra:</p>
                    <p>➡️ ${(tiempoCaida/Math.sqrt((2 * altura) / 9.81)).toFixed(2)} veces más lento</p>
                </div>
            `,
            icon: 'info'
        });
    }
}

async function mostrarPlaneta(nombrePlaneta, gravedad, imagen) {
    const result = await Swal.fire({
        title: `Caída Libre en ${nombrePlaneta}`,
        html: `
            <div class="row">
                <div class="col-md-6">
                    <img src="assets/img/${imagen}" class="img-fluid rounded" alt="${nombrePlaneta}">
                    <p class="mt-2">Gravedad: ${gravedad} m/s²</p>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Altura inicial (metros)</label>
                        <input type="number" id="altura" class="form-control" min="0">
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Calcular',
        cancelButtonText: 'Volver',
        showCloseButton: true,
        width: '800px',
        preConfirm: () => {
            const altura = document.getElementById('altura').value;
            if (!altura || altura <= 0) {
                Swal.showValidationMessage('Ingrese una altura válida');
                return false;
            }
            return {
                altura: parseFloat(altura)
            };
        }
    });

    if (result.isConfirmed) {
        const altura = result.value.altura;
        const tiempoCaida = Math.sqrt((2 * altura) / gravedad);
        const velocidadFinal = gravedad * tiempoCaida;

        const resultadoCalculo = await Swal.fire({
            title: `Resultados en ${nombrePlaneta}`,
            html: `
                <div class="alert alert-info">
                    <h4>Resultados con g = ${gravedad} m/s²:</h4>
                    <p>⏱️ Tiempo de caída: ${tiempoCaida.toFixed(2)} segundos</p>
                    <p>🚀 Velocidad final: ${velocidadFinal.toFixed(2)} m/s</p>
                    <p>📏 Altura inicial: ${altura} metros</p>
                    <p>🌍 Comparación con la Tierra:</p>
                    <p>➡️ ${(tiempoCaida/Math.sqrt((2 * altura) / 9.81)).toFixed(2)} veces más ${gravedad < 9.81 ? 'lento' : 'rápido'}</p>
                </div>
            `,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Nuevo cálculo',
            denyButtonText: 'Ver otros planetas',
            cancelButtonText: 'Cerrar'
        });

        if (resultadoCalculo.isConfirmed) {
            mostrarPlaneta(nombrePlaneta, gravedad, imagen);
        } else if (resultadoCalculo.isDenied) {
            mostrarSeccion('planetas');
        }
    }
}
