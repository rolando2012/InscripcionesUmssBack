import prisma from '../db.js';

async function main() {
  console.log('--- Iniciando Seed de Kardex e Historial ---');

  const ESTUDIANTE_ID = 1;
  const GESTION_APROBACION = "I-2025";

  // 1. Verificar si existe el estudiante
  const estudiante = await prisma.estudiante.findUnique({
    where: { id: ESTUDIANTE_ID },
    include: { persona: true }
  });

  if (!estudiante) {
    console.error("El estudiante con ID 1 no existe. Ejecuta los seeds anteriores primero.");
    return;
  }

  // 2. Buscar la Carrera (Ingeniería de Sistemas)
  const carrera = await prisma.carrera.findFirst({
    where: { nombreCarrera: "Ingeniería de Sistemas" }
  });

  if (!carrera) {
    console.error("La carrera no existe.");
    return;
  }

  // 3. Crear Kardex (Si no existe ya)
  let kardex = await prisma.kardex.findFirst({
    where: { estudianteId: ESTUDIANTE_ID }
  });

  if (!kardex) {
    kardex = await prisma.kardex.create({
      data: {
        estudianteId: ESTUDIANTE_ID,
        carreraId: carrera.id
      }
    });
    console.log(`Kardex creado para: ${estudiante.persona.nombres} ${estudiante.persona.apellidos}`);
  } else {
    console.log(`Kardex ya existente para: ${estudiante.persona.nombres}`);
  }

  // 4. Obtener materias del Nivel A
  const materiasNivelA = await prisma.materia.findMany({
    where: { nivel: "A" }
  });

  console.log(`Encontradas ${materiasNivelA.length} materias de Nivel A.`);

  // 5. Generar notas de aprobación
  for (const materia of materiasNivelA) {
    // Buscar un grupo cualquiera para esta materia (para simular donde cursó)
    const grupo = await prisma.grupo.findFirst({
      where: { materiaId: materia.id }
    });

    if (!grupo) {
      console.warn(`[AVISO] No hay grupos creados para ${materia.nombreMateria}. Se saltará el historial.`);
      continue;
    }

    // Generar nota aleatoria entre 51 y 60
    const notaFinal = Math.floor(Math.random() * (60 - 51 + 1)) + 51;

    // Crear registro en historico_notas
    await prisma.historicoNotas.create({
      data: {
        kardexId: kardex.id,
        grupoId: grupo.id,
        gestionNota: GESTION_APROBACION,
        modalidad: "Normal",
        nota: notaFinal
      }
    });

    console.log(` > Aprobó ${materia.nombreMateria} con ${notaFinal} en Grupo ${grupo.codigoGrupo}`);
  }

  console.log('--- Seed de Kardex finalizado ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });