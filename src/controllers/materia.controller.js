import prisma from '../base/db.js';

export const obtenerOfertaAcademica = async (req, res) =>{
    const { idestudiante } = req.params;
    const idEstudianteNumerico = parseInt(idestudiante, 10);
    try {
        
        if (isNaN(idEstudianteNumerico)) {
            throw new Error("ID de estudiante inválido o no numérico.");
        }

        const GESTION_ANTERIOR = "I-2025";

        const kardex = await prisma.kardex.findFirst({
            where: { estudianteId: idEstudianteNumerico },
            include: {
                historicos: {
                    where: { gestionNota: GESTION_ANTERIOR }
                }
            }
        });

        // Cambiado para lanzar un error con un mensaje específico si el estudiante no tiene kardex
        if (!kardex) {
            throw new Error(`Estudiante con ID ${idEstudianteNumerico} no tiene kardex asociado.`);
        }

        const notas = kardex.historicos.map(h => h.nota || 0);
        const promedioGestion = notas.length > 0 
            ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) 
            : 0;

        // console.log(`\n=== ESTADO DEL ESTUDIANTE ===`);
        // console.log(`Promedio Gestión ${GESTION_ANTERIOR}: ${promedioGestion}`);
        // Obtenemos todo el historial histórico aprobado (>50)
        const historialCompleto = await prisma.historicoNotas.findMany({
            where: {
                kardexId: kardex.id,
                nota: { gt: 50 } // Mayor a 50
            },
            include: { grupo: true }
        });

        const idsMateriasAprobadas = historialCompleto.map(h => h.grupo.materiaId);

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

        const electivas = await prisma.materia.findMany({
            where: {
                tipo: "ELECTIVA",
                id: { notIn: idsMateriasAprobadas }
            },
        });

        // Combinamos listas
        const materiasAInscribir = [...sugerenciaRegulares, ...electivas];
        
        const ofertaSugeridaDetalle = [];

        for (const materia of materiasAInscribir) {
            // Buscar grupos disponibles para esta materia
            const grupos = await prisma.grupo.findMany({
                where: { materiaId: materia.id },
                include: {
                    docente: {
                        include: { persona: true } // Para sacar el nombre del docente
                    },
                    // Asumiendo que también se necesita la información del horario
                    horarios: true 
                }
            });

            // Formato para los grupos (Docente, Horarios)
            const gruposDetalle = grupos.map(g => ({
                id: g.id,
                nombreGrupo: g.nombreGrupo,
                cupo: g.cupo,
                docente: g.docente ? g.docente.persona.nombreCompleto : 'TBD',
                horarios: g.horarios.map(h => ({
                    dia: h.dia,
                    horaInicio: h.horaInicio,
                    horaFin: h.horaFin,
                    aula: h.aula
                }))
            }));


            ofertaSugeridaDetalle.push({
                materia: materia.nombreMateria,
                codigo: materia.codigoMateria,
                nivel: materia.nivel,
                tipo: materia.tipo,
                grupos: gruposDetalle
            });
        }
        
        // Formato final de la respuesta
        const respuesta = {
            estudiante: {
                id: idEstudianteNumerico,
                promedioAnterior: promedioGestion
            },
            ofertaSugerida: ofertaSugeridaDetalle
        };

        return res.status(200).json(respuesta);
    } catch (error) {
        console.error(`Error al obtener oferta académica para estudiante ${idEstudianteNumerico}:`, error.message);
        
        return res.status(400).json({
            error: true,
            mensaje: error.message || "Ocurrió un error al procesar la solicitud."
        });
    }
}

