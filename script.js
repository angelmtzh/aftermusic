const s=document.getElementById('sidebar'),o=document.getElementById('overlay'),l=document.getElementById('appLayout'),p=document.getElementById('playerPanel'),au=document.getElementById('audio');let gen="",ai=0,si=0;

const D={
  electronica:[
    {n:'Alan Walker',s:['Fade','Faded','Alone','Sing Me To Sleep','On My Way']},
    {n:'The Chainsmokers',s:['Paris','Dont Let Me Down','Closer','All we know','Something Just Like This']},
    {n:'Martin Garrix',s:['Animals','Tremor','In the name of love']},

  ],
  rock:[
    {n:'Nirvana',s:['The man who sold the world','Lithium','Sliver','Come As You Are','Dumb']},
    {n:'Radiohead',s:['Creep','Karma Police','High and Dry']},
    {n:'Queen',s:['Cool Cat','Bohemian Rhapsody','A Kind of Magic','Radio Ga Ga']},
    {n:'Arctic Monkeys',s:['Do I Wanna Know','Knee Socks','Fluorescent Adolescent']}
  ],
  rock_alt:[
    {n:'León Larregui',s:['Locos','Brillas']},
    {n:'Zoé',s:['Labios rotos','Azul','Luna','Poli','Corazón atómico']},
    {n:'Imagine Dragons',s:['Follow You','Zero','Believer','Bad Liar','Bones']},
    {n:'Coldplay',s:['Clocks','Yellow','Paradise','Adventure of a Lifetime','In My Place','Viva la vida']},
    {n:'Twenty one pilots',s:['Ride','Stressed Out','Heathens','Chlorine',]}
  ],
  rock_esp:[
    {n:'Caifanes',s:['La Célula Que Explota','Aquí no es así','Afuera','Los dioses ocultos','Ayer me dijó un ave','Nubes']},
    {n:'Mago de Oz',s:['Astaroth','Kelpie','Satania','Cadaveria','Hasta que el cuerpo aguante']},
    {n:'Rata Blanca',s:['La leyenda del Hada y el Mago','Ella','Mujer Amante','Aun estas en mis sueños']}
  ],
  recomendaciones:[
    {
      n:'AFTER MUSIC',
      s:['Locos','Take on me','Freaks','Sign Of The Times','Feel','The Reason','This Love','Freaking Out The Neighborhood']
    }
  ]
};

function toggleMenu(){s.classList.toggle('open');o.classList.toggle('open')}
function toggleSub(id){document.getElementById(id).classList.toggle('open')}
function mostrar(v){const b=document.querySelector('.buscador-contenedor');if(b)b.style.display=v==='inicio'?'flex':'none';['inicio','playlists','biblioteca','en-vivo','artistas','canciones'].forEach(x=>{let e=document.getElementById('vista-'+x);if(e)e.classList.toggle('vista-oculta',v!==x)});if(typeof toggleMenu==='function'&&s.classList.contains('open'))toggleMenu();}
function verArtistas(g){gen=g;document.getElementById('titulo-artistas').innerText=g.toUpperCase();document.getElementById('lista-artistas').innerHTML=D[g].map((a,i)=>`<div class="artist-card" onclick="verCanciones('${g}',${i})"><h3>${a.n}</h3><p>${a.s.length} canciones</p></div></div>`).join('');mostrar('artistas')}
function verCanciones(g,i){ai=i;const a=D[g][i];document.getElementById('titulo-canciones').innerHTML=`<span>${a.n}</span><button class="btn-info-artista-grande" onclick="abrirBio('${g}',${i})"></button>`;document.getElementById('lista-canciones').innerHTML=a.s.map((c,j)=>`<div class="song-row" onclick="tocarCancion('${g}',${i},${j})"><div class="song-cover"></div><div><b>${c}</b><span>${a.n}</span></div><em>${g}</em></div>`).join('');mostrar('canciones')}

function volverArtistas(){mostrar('artistas')}

function tocarCancion(g,i,j){
    let a=D[g][i];
    let nombreArchivoBase = a.s[j].toLowerCase().replace(/ /g,'-');

    if (gen === g && ai === i && si === j && (au.src.includes(nombreArchivoBase))) {
        p.style.display = 'flex';
        l.classList.remove('sin-player');
        if (au.paused) {
            au.play().catch(e => console.log("Error al reproducir:", e));
            document.querySelector('.play-big').innerText = '⏸';
        }
        return; 
    }

    gen=g;ai=i;si=j;
    document.getElementById('pTitulo').innerText=a.s[j];
    document.getElementById('pArtista').innerText=a.n;
    
    // 📸 ASIGNA UNA SOLA IMAGEN PARA TODAS LAS CANCIONES DE ESTE ARTISTA
    const portadaImg = document.querySelector('.p-img');
    if (portadaImg) {
        let nombreArtistaFormateado = a.n.toLowerCase().replace(/ /g, '-');
        portadaImg.src = `portadas/${nombreArtistaFormateado}.jpg`; // Busca la foto del artista
        portadaImg.style.display = 'block';
    }
    
    au.src=`canciones/${nombreArchivoBase}.mp3`;
    p.style.display='flex';
    l.classList.remove('sin-player');
    
    au.onerror = function() {
        if (au.src.endsWith('.mp3')) {
            console.log(`No se encontró .mp3 para "${a.s[j]}", intentando con .m4a...`);
            au.src = `canciones/${nombreArchivoBase}.m4a`;
            au.play().catch(e => console.log("Ambos formatos de audio fallaron al reproducir."));
        } else {
            console.error("No se pudo encontrar el archivo de audio en ninguno de los formatos.");
        }
    };

    au.play().catch(e => {});
    
    document.querySelector('.play-big').innerText='⏸';
    au.onended = function() { next(); };

    au.ontimeupdate = function() {
        const tiempoActual = document.querySelector('.time span:first-of-type');
        const tiempoTotal = document.querySelector('.time span:last-of-type');
        const barraProgreso = document.querySelector('.time .progress-bar');
        if (au.duration) {
            const porcentaje = (au.currentTime / au.duration) * 100;
            if(barraProgreso) barraProgreso.style.width = porcentaje + '%';
            let minActual = Math.floor(au.currentTime / 60);
            let segActual = Math.floor(au.currentTime % 60);
            if (segActual < 10) segActual = '0' + segActual;
            if(tiempoActual) tiempoActual.innerText = minActual + ':' + segActual;
            let minTotal = Math.floor(au.duration / 60);
            let segTotal = Math.floor(au.duration % 60);
            if (segTotal < 10) segTotal = '0' + segTotal;
            if(tiempoTotal) tiempoTotal.innerText = minTotal + ':' + segTotal;
        }
    };
}

function playPause() {
    const btn = document.querySelector('.play-big');
    if (au.paused) { au.play(); if(btn) btn.innerText = '⏸'; } 
    else { au.pause(); if(btn) btn.innerText = '▶'; }
}

function next() {
    si++;
    if (si >= D[gen][ai].s.length) si = 0;
    tocarCancion(gen, ai, si);
}

function prev() {
    si--;
    if (si < 0) si = D[gen][ai].s.length - 1;
    tocarCancion(gen, ai, si);
}


function filtrarContenido() {
    const input = document.getElementById('input-busqueda');
    const titulo = document.getElementById('titulo-seccion-busqueda');
    const contenedorLista = document.getElementById('contenedor-lista-busqueda');
    const mensajeSinResultados = document.getElementById('sin-resultados');
    if(!input || !contenedorLista) return;
    const textoBusqueda = input.value.toLowerCase().trim();
    const filasCanciones = contenedorLista.querySelectorAll('.song-row');
    let coincidencias = 0;
    if (titulo) titulo.innerText = textoBusqueda === "" ? "Recomendaciones" : "Resultados de búsqueda";
    filasCanciones.forEach(fila => {
        const txtTitulo = fila.querySelector('b') ? fila.querySelector('b').innerText.toLowerCase() : '';
        const txtArtista = fila.querySelector('span') ? fila.querySelector('span').innerText.toLowerCase() : '';
        const txtGenero = fila.querySelector('em') ? fila.querySelector('em').innerText.toLowerCase() : '';
        if (txtTitulo.includes(textoBusqueda) || txtArtista.includes(textoBusqueda) || txtGenero.includes(textoBusqueda)) {
            fila.style.display = 'flex';
            coincidencias++;
        } else {
            fila.style.display = 'none';
        }
    });
    if (mensajeSinResultados) mensajeSinResultados.style.display = (coincidencias === 0 && textoBusqueda !== "") ? 'block' : 'none';
}

function cerrarPlayer() {
    if(p) p.style.display = 'none';
    if(l) l.classList.add('sin-player');
}

// PEGA ESTO HASTA EL FINAL DE TU SCRIPT.JS (EL HTML SE QUEDA EXACTAMENTE IGUAL)
document.addEventListener("DOMContentLoaded", () => {
    const tarjetasVideo = document.querySelectorAll('.tarjeta-video-envivo');
    
    tarjetasVideo.forEach((tarjeta) => {
        const video = tarjeta.querySelector('video');
        const btnPlay = tarjeta.querySelector('.btn-control-video');
        const btnFullscreen = tarjeta.querySelector('.btn-pantalla-completa');

        if (video && btnPlay) {
            // Aseguramos que al cargar la página el botón tenga el estado inicial correcto
            btnPlay.innerText = video.paused ? '▶' : '⏸';

            btnPlay.onclick = (evento) => {
                evento.preventDefault();
                evento.stopPropagation();

                // Pausamos el reproductor de música general de la app
                if (typeof au !== 'undefined' && !au.paused) {
                    au.pause();
                    const btnPlayBig = document.querySelector('.play-big');
                    if (btnPlayBig) btnPlayBig.innerText = '▶';
                }

                // Pausamos los otros videos y reseteamos sus botones a '▶'
                tarjetasVideo.forEach(otraTarjeta => {
                    const otroVideo = otraTarjeta.querySelector('video');
                    const otroBtn = otraTarjeta.querySelector('.btn-control-video');
                    if (otroVideo && otroVideo !== video) {
                        otroVideo.pause();
                        if (otroBtn) otroBtn.innerText = '▶';
                    }
                });

                // Controlamos la reproducción y cambiamos el texto del botón del video actual
                if (video.paused) {
                    video.play()
                        .then(() => { btnPlay.innerText = '⏸'; })
                        .catch(e => console.error("Error al reproducir el video:", e));
                } else {
                    video.pause();
                    btnPlay.innerText = '▶';
                }
            };

            // Control visual extra: si el video se pausa por fuera (o termina), el botón vuelve a '▶'
            video.onpause = () => { btnPlay.innerText = '▶'; };
            video.onplay = () => { btnPlay.innerText = '⏸'; };
        }

        // Control del botón de Pantalla Completa
        if (video && btnFullscreen) {
            btnFullscreen.onclick = (evento) => {
                evento.preventDefault();
                evento.stopPropagation();
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                }
            };
        }
    });
});

// Detener todos los vídeos al cambiar de sección o página
function detenerVideos() {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });

    // También detener vídeos de YouTube u otros iframes
    const iframes = document.querySelectorAll('iframe');

    iframes.forEach(iframe => {
        const src = iframe.src;
        iframe.src = src;
    });
}

// Detectar clics en los enlaces del menú
document.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', function() {
        detenerVideos();
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    const mensajeExito = document.getElementById('mensaje-exito');

    // Expresiones regulares de validación
    const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$/;
    const regexEdad = /^[0-9]{1,3}$/; // 1 a 3 números, sin espacios
    const regexTelefono = /^[0-9]{16}$/; // Exactamente 10 números, sin espacios
    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    function mostrarError(campoId, mensaje) {
        const input = document.getElementById(campoId);
        const errorSpan = document.getElementById('error-' + campoId);
        errorSpan.textContent = mensaje;
        input.classList.remove('valido');
        if (mensaje) {
            input.classList.add('invalido');
            return false;
        } else {
            input.classList.remove('invalido');
            if (input.value.trim() !== '') {
                input.classList.add('valido');
            }
            return true;
        }
    }

   

function soloPermitirLetras(input) {
    // Borra en automático todo lo que no sea letra, acento, ñ o espacio
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]/g, '');
}

    function validarSoloLetras(campoId, nombreCampo) {
        const valor = document.getElementById(campoId).value;
        if (valor.trim() === '') return mostrarError(campoId, `${nombreCampo} es obligatorio.`);
        if (valor.startsWith(' ') || valor.endsWith(' ')) return mostrarError(campoId, 'No debe iniciar ni terminar con espacios.');
        if (!regexSoloLetras.test(valor)) return mostrarError(campoId, 'Solo se permiten letras y espacios.');
        return mostrarError(campoId, '');
    }

    function soloPermitirNumeros(input) {
    // Borra en automático todo lo que no sea número
    input.value = input.value.replace(/[^0-9]/g, '');
}

        // Función auxiliar para calcular la edad exacta según la fecha seleccionada
    function calcularEdadReal() {
        const dia = Number(document.getElementById('diaNacimiento').value);
        const mes = Number(document.getElementById('mesNacimiento').value);
        const anio = Number(document.getElementById('anioNacimiento').value);

        if (!dia || !mes || !anio) return null;

        const fechaNac = new Date(anio, mes - 1, dia);
        // Verificar que la fecha exista (ej. evitar 31 de febrero)
        if (fechaNac.getFullYear() !== anio || fechaNac.getMonth() !== mes - 1 || fechaNac.getDate() !== dia) {
            return null;
        }

        const hoy = new Date();
        let edadCalculada = hoy.getFullYear() - anio;
        const difMes = hoy.getMonth() - (mes - 1);

        // Si aún no ha llegado su mes o día de cumpleaños este año, se resta 1
        if (difMes < 0 || (difMes === 0 && hoy.getDate() < dia)) {
            edadCalculada--;
        }

        return edadCalculada >= 0 ? edadCalculada : null;
    }

    function validarEdad() {
        const valor = document.getElementById('edad').value;
        if (valor.trim() === '') return mostrarError('edad', 'La edad es obligatoria.');
        if (valor.includes(' ')) return mostrarError('edad', 'No se permiten espacios.');

        // Si son solo números pero más de 3 dígitos -> mensaje diferente
        if (/^[0-9]+$/.test(valor) && valor.length > 3) {
            return mostrarError('edad', 'La edad no puede tener más de 3 dígitos.');
        }

        // Si tiene letras o símbolos -> mensaje de solo números
        if (!regexEdad.test(valor)) return mostrarError('edad', 'Solo se permiten números.');
        if (Number(valor) < 18) return mostrarError('edad', 'Debes tener al menos 18 años para suscribirte.');

        // Validación lógica contra la fecha de nacimiento
        const edadReal = calcularEdadReal();
        if (edadReal !== null && Number(valor) !== edadReal) {
            return mostrarError('edad', `La edad no concuerda con tu fecha de nacimiento (debería ser ${edadReal} años).`);
        }

        return mostrarError('edad', '');
    }

    function validarFechaNacimiento() {
        const dia = Number(document.getElementById('diaNacimiento').value);
        const mes = Number(document.getElementById('mesNacimiento').value);
        const anio = Number(document.getElementById('anioNacimiento').value);
        const errorSpan = document.getElementById('error-fechaNacimiento');
        const selectores = ['diaNacimiento', 'mesNacimiento', 'anioNacimiento'].map(id => document.getElementById(id));

        if (!dia || !mes || !anio) {
            errorSpan.textContent = 'Selecciona el día, mes y año de nacimiento.';
            selectores.forEach(select => { select.classList.remove('valido'); select.classList.add('invalido'); });
            return false;
        }

        const fechaSeleccionada = new Date(anio, mes - 1, dia);
        if (fechaSeleccionada.getFullYear() !== anio || fechaSeleccionada.getMonth() !== mes - 1 || fechaSeleccionada.getDate() !== dia) {
            errorSpan.textContent = 'Selecciona una fecha válida.';
            selectores.forEach(select => { select.classList.remove('valido'); select.classList.add('invalido'); });
            return false;
        }

        const hoy = new Date();
        const fechaActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        if (fechaSeleccionada > fechaActual) {
            errorSpan.textContent = 'La fecha no puede ser futura.';
            selectores.forEach(select => { select.classList.remove('valido'); select.classList.add('invalido'); });
            return false;
        }

        const edadCalculada = calcularEdadReal();
        if (edadCalculada !== null && edadCalculada < 18) {
            errorSpan.textContent = 'Debes tener al menos 18 años para suscribirte.';
            selectores.forEach(select => { select.classList.remove('valido'); select.classList.add('invalido'); });
            return false;
        }

        errorSpan.textContent = '';
        selectores.forEach(select => { select.classList.remove('invalido'); select.classList.add('valido'); });

        // Si el usuario ya había escrito algo en el campo edad, lo vuelve a validar al cambiar la fecha
        if (document.getElementById('edad').value.trim() !== '') {
            validarEdad();
        }

        return true;
    }


   

    function validarTelefono() {
        const valor = document.getElementById('telefono').value;
        if (valor.trim() === '') return mostrarError('telefono', 'La cuenta bancaria es obligatoria.');
        if (valor.includes(' ')) return mostrarError('telefono', 'No se permiten espacios.');
        if (!regexTelefono.test(valor)) return mostrarError('telefono', 'Ingresa un número de tarjeta bancaria valido.');
        return mostrarError('telefono', '');
    }

    function validarEmail() {
        const valor = document.getElementById('email').value;
        if (valor.trim() === '') return mostrarError('email', 'El email es obligatorio.');
        if (valor.includes(' ')) return mostrarError('email', 'No se permiten espacios en blanco.');
        if (!regexEmail.test(valor)) return mostrarError('email', 'Ingresa un correo válido. Ej. correo@ejemplo.com');
        return mostrarError('email', '');
    }

    // Validación en tiempo real mientras escribe
 // NOMBRE
document.getElementById('nombre').addEventListener('input', (e) => {
    soloPermitirLetras(e.target);
    e.target.value = e.target.value.toUpperCase();
    validarSoloLetras('nombre', 'El nombre');
});

// APELLIDO PATERNO
document.getElementById('apellidoPaterno').addEventListener('input', (e) => {
    soloPermitirLetras(e.target);
    e.target.value = e.target.value.toUpperCase();
    validarSoloLetras('apellidoPaterno', 'El apellido paterno');
});

// APELLIDO MATERNO
document.getElementById('apellidoMaterno').addEventListener('input', (e) => {
    soloPermitirLetras(e.target);
    e.target.value = e.target.value.toUpperCase();
    validarSoloLetras('apellidoMaterno', 'El apellido materno');
});
    // Opciones de día y año para los tres selectores de nacimiento
    const diaNacimiento = document.getElementById('diaNacimiento');
    const anioNacimiento = document.getElementById('anioNacimiento');
    for (let dia = 1; dia <= 31; dia++) {
        const opcion = document.createElement('option');
        opcion.value = dia;
        opcion.textContent = String(dia).padStart(2, '0');
        diaNacimiento.appendChild(opcion);
    }
    const anioActual = new Date().getFullYear();
    const anioMaximoPermitido = anioActual - 18;
    for (let anio = anioMaximoPermitido; anio >= 1900; anio--) {
        const opcion = document.createElement('option');
        opcion.value = anio;
        opcion.textContent = anio;
        anioNacimiento.appendChild(opcion);
    }
    ['diaNacimiento', 'mesNacimiento', 'anioNacimiento'].forEach(id => {
        document.getElementById(id).addEventListener('change', validarFechaNacimiento);
    });
    document.getElementById('edad').addEventListener('input', (e) => {
    soloPermitirNumeros(e.target);
    validarEdad();
});
document.getElementById('telefono').addEventListener('input', (e) => {
    soloPermitirNumeros(e.target);
    validarTelefono();
});
document.getElementById('email').addEventListener('input', (e) => {
    // Borra espacios y todo lo que no sea válido para un email
    e.target.value = e.target.value.replace(/[^A-Za-z0-9._%+@-]/g, '');
    validarEmail();
});
       // Validación al enviar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        mensajeExito.textContent = '';

        const v1 = validarSoloLetras('nombre', 'El nombre');
        const v2 = validarSoloLetras('apellidoPaterno', 'El apellido paterno');
        const v3 = validarSoloLetras('apellidoMaterno', 'El apellido materno');
        const v4 = validarFechaNacimiento();
        const v5 = validarEdad();
        const v6 = validarTelefono();
        const v7 = validarEmail();

        if (v1 && v2 && v3 && v4 && v5 && v6 && v7) {
            // Aquí puedes enviar los datos con fetch() o form.submit()
            // form.reset(); // Descomenta si quieres limpiar el formulario
       form.reset();

form.querySelectorAll('input').forEach(input => {
    input.classList.remove('valido', 'invalido');
});
document.getElementById('alerta-exito').style.display = 'flex';
        } else {
            mensajeExito.textContent = '';
        }
    });
});

// Permite que los enlaces del menú del formulario abran la sección correcta del index.
document.addEventListener('DOMContentLoaded', () => {
    const parametros = new URLSearchParams(window.location.search);
    const seccionSolicitada = parametros.get('seccion');

    if (seccionSolicitada && document.getElementById('vista-' + seccionSolicitada)) {
        mostrar(seccionSolicitada);
    }
});
function cerrarAlerta() {
    document.getElementById('alerta-exito').style.display = 'none';
}
