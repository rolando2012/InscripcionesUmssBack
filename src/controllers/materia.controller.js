import prisma from '../base/db.js';
import config from '../config.js';

async function obtenerOfertaAcademica(estudianteId) {
  const GESTION_ANTERIOR = "I-2025";
  
  // ==========================================
  // PASO 1: Calcular Promedio Gestión Anterior
  // ==========================================
  const kardex = await prisma.kardex.findFirst({
    where: { estudianteId: estudianteId },
    include: {
      historicos: {
        where: { gestionNota: GESTION_ANTERIOR }
      }
    }
  });

  if (!kardex) throw new Error("Estudiante sin kardex");

  const notas = kardex.historicos.map(h => h.nota || 0);
  const promedioGestion = notas.length > 0 
    ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) 
    : 0;

  console.log(`\n=== ESTADO DEL ESTUDIANTE ===`);
  console.log(`Promedio Gestión ${GESTION_ANTERIOR}: ${promedioGestion}`);

  // ==========================================
  // PASO 2: Identificar Materias Aprobadas
  // ==========================================
  // Obtenemos todo el historial histórico aprobado (>50)
  const historialCompleto = await prisma.historicoNotas.findMany({
    where: {
      kardexId: kardex.id,
      nota: { gt: 50 } // Mayor a 50
    },
    include: { grupo: true }
  });

  const idsMateriasAprobadas = historialCompleto.map(h => h.grupo.materiaId);

  // ==========================================
  // PASO 3: Algoritmo de Sugerencia (Regulares)
  // ==========================================
  
  // Traemos todas las materias regulares que NO ha aprobado aún
  // Ordenadas por nivel (A, B, C...) para priorizar las siguientes inmediatas
  const materiasPendientes = await prisma.materia.findMany({
    where: {
      tipo: "REGULAR",
      id: { notIn: idsMateriasAprobadas }
    },
    orderBy: { nivel: 'asc' }, 
    include: {
      // Necesitamos saber el prerequisito para validar
      prerequisito: true 
    }
  });

  // Filtramos en JS: Solo materias cuyo prerequisito sea null O esté en la lista de aprobadas
  const materiasHabilitadas = materiasPendientes.filter(m => {
    if (!m.matIdMateria) return true; // No tiene prerequisito
    return idsMateriasAprobadas.includes(m.matIdMateria); // Prerequisito aprobado
  });

  // Tomamos las primeras 6 (La carga académica estándar)
  const sugerenciaRegulares = materiasHabilitadas.slice(0, 6);

  // ==========================================
  // PASO 4: Buscar Electivas
  // ==========================================
  const electivas = await prisma.materia.findMany({
    where: {
      tipo: "ELECTIVA",
      id: { notIn: idsMateriasAprobadas }
    },
    take: 2 // Traer 2 electivas
  });

  // Combinamos listas
  const materiasAInscribir = [...sugerenciaRegulares, ...electivas];

  // ==========================================
  // PASO 5: Recuperar Grupos y Formatear Respuesta
  // ==========================================
  
  const respuesta = {
    estudiante: {
        id: estudianteId,
        promedioAnterior: promedioGestion
    },
    ofertaSugerida: []
  };

  for (const materia of materiasAInscribir) {
    // Buscar grupos disponibles para esta materia
    const grupos = await prisma.grupo.findMany({
      where: { materiaId: materia.id },
      include: {
        docente: {
            include: { persona: true } // Para sacar el nombre del docente
        },
        horarios: {
            include: {
                dia: true,
                hora: true,
                aula: true
            }
        }
      }
    });

    respuesta.ofertaSugerida.push({
        materia: materia.nombreMateria,
        codigo: materia.codigoMateria,
        nivel: materia.nivel,
        tipo: materia.tipo,
        gruposDisponibles: grupos.map(g => ({
            codigoGrupo: g.codigoGrupo,
            docente: `${g.docente.persona.apellidos} ${g.docente.persona.nombres || ''}`,
            horarios: g.horarios.map(h => 
                `${h.dia.nombreDia} ${h.hora.inicio.toISOString().substr(11,5)} - ${h.hora.fin.toISOString().substr(11,5)} (${h.aula.nombreAula})`
            )
        }))
    });
  }

  return respuesta;
}

// --- EJECUCIÓN DE PRUEBA ---
async function main() {
  try {
    const resultado = await obtenerOfertaAcademica(1); // ID Estudiante 1
    console.log(JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();