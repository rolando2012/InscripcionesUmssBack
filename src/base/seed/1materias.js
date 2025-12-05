import prisma from '../db.js';

const materiasData = [
  // --- NIVEL A ---
  { codigo: 1803001, nombre: "INGLES I", nivel: "A", tipo: "REGULAR", prereq: null },
  { codigo: 2006063, nombre: "FISICA GENERAL", nivel: "A", tipo: "REGULAR", prereq: null },
  { codigo: 2008019, nombre: "ALGEBRA I", nivel: "A", tipo: "REGULAR", prereq: null },
  { codigo: 2008054, nombre: "CALCULO I", nivel: "A", tipo: "REGULAR", prereq: null },
  { codigo: 2010010, nombre: "INTRODUCCION A LA PROGRAMACION", nivel: "A", tipo: "REGULAR", prereq: null },
  { codigo: 2010140, nombre: "METODOLOGIA INVESTIGACION Y TEC. COMUNICACION", nivel: "A", tipo: "REGULAR", prereq: null },

  // --- NIVEL B ---
  { codigo: 2008022, nombre: "ALGEBRA II", nivel: "B", tipo: "REGULAR", prereq: "2008019" },
  { codigo: 2008056, nombre: "CALCULO II", nivel: "B", tipo: "REGULAR", prereq: "2008054" },
  { codigo: 2008057, nombre: "MATEMATICA DISCRETA", nivel: "B", tipo: "REGULAR", prereq: "2008054" },
  { codigo: 2010003, nombre: "ELEM. DE PROGRAMACION Y ESTRUC. DE DATOS", nivel: "B", tipo: "REGULAR", prereq: "2010010" }, // Requiere también 2010140, pero el esquema soporta uno
  { codigo: 2010013, nombre: "ARQUITECTURA DE COMPUTADORAS I", nivel: "B", tipo: "REGULAR", prereq: "2006063" },

  // --- NIVEL C ---
  { codigo: 2008058, nombre: "ECUACIONES DIFERENCIALES", nivel: "C", tipo: "REGULAR", prereq: "2008056" },
  { codigo: 2008059, nombre: "ESTADISTICA I", nivel: "C", tipo: "REGULAR", prereq: "2008022" },
  { codigo: 2008060, nombre: "CALCULO NUMERICO", nivel: "C", tipo: "REGULAR", prereq: "2008057" },
  { codigo: 2010012, nombre: "METODOS TECNICAS Y TALLER DE PROGRAMACION", nivel: "C", tipo: "REGULAR", prereq: "2010003" },
  { codigo: 2010015, nombre: "BASE DE DATOS I", nivel: "C", tipo: "REGULAR", prereq: "2010003" },
  { codigo: 2010141, nombre: "CIRCUITOS ELECTRONICOS", nivel: "C", tipo: "REGULAR", prereq: "2010013" },

  // --- NIVEL D ---
  { codigo: 2008061, nombre: "ESTADISTICA II", nivel: "D", tipo: "REGULAR", prereq: "2008059" },
  { codigo: 2010016, nombre: "BASE DE DATOS II", nivel: "D", tipo: "REGULAR", prereq: "2010015" },
  { codigo: 2010017, nombre: "TALLER DE SISTEMAS OPERATIVOS", nivel: "D", tipo: "REGULAR", prereq: "2010141" },
  { codigo: 2010018, nombre: "SISTEMAS DE INFORMACION I", nivel: "D", tipo: "REGULAR", prereq: "2010012" },
  { codigo: 2016046, nombre: "CONTABILIDAD BASICA", nivel: "D", tipo: "REGULAR", prereq: "2008060" },
  { codigo: 2016048, nombre: "INVESTIGACION OPERATIVA I", nivel: "D", tipo: "REGULAR", prereq: "2008058" },

  // --- NIVEL E ---
  { codigo: 1803002, nombre: "INGLES II", nivel: "E", tipo: "REGULAR", prereq: "1803001" },
  { codigo: 2010022, nombre: "SISTEMAS DE INFORMACION II", nivel: "E", tipo: "REGULAR", prereq: "2010018" },
  { codigo: 2010035, nombre: "APLICACION DE SISTEMAS OPERATIVOS", nivel: "E", tipo: "REGULAR", prereq: "2010017" },
  { codigo: 2010053, nombre: "TALLER DE BASE DE DATOS", nivel: "E", tipo: "REGULAR", prereq: "2010016" },
  { codigo: 2010142, nombre: "SISTEMAS I", nivel: "E", tipo: "REGULAR", prereq: "2016046" },
  { codigo: 2016051, nombre: "INVESTIGACION OPERATIVA II", nivel: "E", tipo: "REGULAR", prereq: "2016048" },
  { codigo: 2016057, nombre: "MERCADOTECNIA", nivel: "E", tipo: "REGULAR", prereq: "2008061" },

  // --- NIVEL F ---
  { codigo: 2010019, nombre: "SIMULACION DE SISTEMAS", nivel: "F", tipo: "REGULAR", prereq: "2016051" },
  { codigo: 2010020, nombre: "INGENIERIA DE SOFTWARE", nivel: "F", tipo: "REGULAR", prereq: "2010022" },
  { codigo: 2010027, nombre: "INTELIGENCIA ARTIFICIAL", nivel: "F", tipo: "REGULAR", prereq: "2010053" },
  { codigo: 2010047, nombre: "REDES DE COMPUTADORAS", nivel: "F", tipo: "REGULAR", prereq: "2010035" },
  { codigo: 2010143, nombre: "SISTEMAS II", nivel: "F", tipo: "REGULAR", prereq: "2010142" },
  { codigo: 2010144, nombre: "SISTEMAS ECONOMICOS", nivel: "F", tipo: "REGULAR", prereq: "2016057" },
  { codigo: 2010182, nombre: "TELEFONIA IP", nivel: "F", tipo: "ELECTIVA", prereq: null }, // Electiva

  // --- NIVEL G ---
  { codigo: 2010024, nombre: "TALLER DE INGENIERIA DE SOFTWARE", nivel: "G", tipo: "REGULAR", prereq: "2010020" },
  { codigo: 2010145, nombre: "GESTION DE CALIDAD DE SOFTWARE", nivel: "G", tipo: "REGULAR", prereq: "2010027" },
  { codigo: 2010146, nombre: "REDES AVANZADAS DE COMPUTADORAS", nivel: "G", tipo: "REGULAR", prereq: "2010047" },
  { codigo: 2010186, nombre: "DINAMICA DE SISTEMAS", nivel: "G", tipo: "REGULAR", prereq: "2010019" },
  { codigo: 2010211, nombre: "APLIC INTERACTIVAS PARA TELEVISION DIGITAL", nivel: "G", tipo: "ELECTIVA", prereq: null },
  { codigo: 2014087, nombre: "ELECTROTECNIA INDUSTRIAL", nivel: "G", tipo: "ELECTIVA", prereq: null },
  { codigo: 2016092, nombre: "PLANIFICACION Y EVALUACION DE PROYECTOS", nivel: "G", tipo: "REGULAR", prereq: "2010144" },

  // --- NIVEL H ---
  { codigo: 1803009, nombre: "INGLES III", nivel: "H", tipo: "REGULAR", prereq: "1803002" },
  { codigo: 2010034, nombre: "SISTEMAS COLABORATIVOS", nivel: "H", tipo: "ELECTIVA", prereq: null },
  { codigo: 2010102, nombre: "EVALUACION Y AUDITORIA DE SISTEMAS", nivel: "H", tipo: "REGULAR", prereq: "2010145" },
  { codigo: 2010116, nombre: "TALLER DE SIMULACION DE SISTEMAS", nivel: "H", tipo: "REGULAR", prereq: "2010186" },
  { codigo: 2010119, nombre: "METODOL. PLANIF. Y PROYECTO DE GRADO", nivel: "H", tipo: "REGULAR", prereq: "2010024" },
  { codigo: 2010209, nombre: "SEGURIDAD DE SISTEMAS", nivel: "H", tipo: "REGULAR", prereq: "2010146" },
  { codigo: 2016059, nombre: "GESTION ESTRATEGICA DE EMPRESAS", nivel: "H", tipo: "REGULAR", prereq: "2016092" },

  // --- ELECTIVAS ADICIONALES / OTROS NIVELES ---
  { codigo: 2010079, nombre: "WEB SEMANTICAS", nivel: "H", tipo: "ELECTIVA", prereq: null },
  { codigo: 2010103, nombre: "ROBOTICA", nivel: "H", tipo: "ELECTIVA", prereq: null },
  
  // NIVEL I (1) / Finales
  { codigo: 2010122, nombre: "PROYECTO FINAL - TALLER DE TITULACION", nivel: "I", tipo: "REGULAR", prereq: "2010119" },
  { codigo: 2010147, nombre: "PRACTICA EMPRESARIAL", nivel: "I", tipo: "REGULAR", prereq: "2010119" },
  { codigo: 2010174, nombre: "PROGRAMACION MOVIL", nivel: "I", tipo: "ELECTIVA", prereq: null },
  { codigo: 2010217, nombre: "BUSINESS INTELLIGENCE Y BIG DATA", nivel: "I", tipo: "ELECTIVA", prereq: "2010020" },

  // NIVEL J / Electivas extra
  { codigo: 2016021, nombre: "PLANIF. Y CONTROL DE PRODUCCION I", nivel: "J", tipo: "ELECTIVA", prereq: null },
  { codigo: 2016023, nombre: "INGENIERIA ECONOMICA", nivel: "J", tipo: "ELECTIVA", prereq: null },
  { codigo: 2016027, nombre: "PLANIF. Y CONTROL DE PRODUCCION II", nivel: "J", tipo: "ELECTIVA", prereq: null },
  { codigo: 2016049, nombre: "COSTOS INDUSTRIALES", nivel: "J", tipo: "ELECTIVA", prereq: null },
  { codigo: 2016052, nombre: "INGENIERIA DE METODOS Y REINGENIERIA", nivel: "J", tipo: "ELECTIVA", prereq: null },
  { codigo: 2010033, nombre: "GENERACION DE SOFTWARE", nivel: "J", tipo: "ELECTIVA", prereq: null },
  { codigo: 2010044, nombre: "DISEÑO DE COMPILADORES", nivel: "J", tipo: "ELECTIVA", prereq: null },
  { codigo: 2010191, nombre: "TECNICAS DE RUTEO AVANZADA", nivel: "J", tipo: "ELECTIVA", prereq: null },
];

async function main() {
  console.log('Iniciando el seeding...');

  // 1. Limpieza de tablas (Orden para evitar conflictos de FK)
  // Usamos deleteMany() para limpiar datos existentes
  await prisma.horario.deleteMany();
  await prisma.grupo.deleteMany();
  await prisma.carreraMateria.deleteMany();
  
  // Para borrar Materia necesitamos romper las relaciones circulares (prerequisito) primero
  // Actualizamos todas las materias para quitar prerequisitos
  await prisma.materia.updateMany({ data: { matIdMateria: null } });
  await prisma.materia.deleteMany();
  
  await prisma.carrera.deleteMany();
  await prisma.facultad.deleteMany();

  console.log('Tablas limpiadas.');

  // 2. Crear Facultad
  const facultad = await prisma.facultad.create({
    data: {
      nombreFacultad: "Ciencias y Tecnología",
    }
  });
  console.log(`Facultad creada: ${facultad.nombreFacultad}`);

  // 3. Crear Carrera
  const carrera = await prisma.carrera.create({
    data: {
      nombreCarrera: "Ingeniería de Sistemas",
      codigoCarrera: 10, // Código ficticio o real si se conoce
      facultadId: facultad.id
    }
  });
  console.log(`Carrera creada: ${carrera.nombreCarrera}`);

  // 4. Crear Materias (Primera pasada: Crear registros sin relaciones de prerequisitos aún)
  console.log('Creando materias...');
  
  // Mapa para guardar la referencia de código -> ID de base de datos
  const codigoToIdMap = new Map();

  for (const m of materiasData) {
    const materiaCreada = await prisma.materia.create({
      data: {
        codigoMateria: m.codigo,
        nombreMateria: m.nombre,
        nivel: m.nivel,
        tipo: m.tipo,
        materiaPrerequisitoCodigo: m.prereq, // Guardamos el string del código
        // Relacionamos con la carrera en la tabla intermedia
        carreraMaterias: {
          create: {
            carreraId: carrera.id
          }
        }
      }
    });
    
    // Guardamos en el mapa: "2008019" -> ID_REAL_EN_DB
    codigoToIdMap.set(String(m.codigo), materiaCreada.id);
  }

  // 5. Segunda pasada: Conectar las relaciones de Prerrequisitos (Self-Relation)
  console.log('Conectando prerrequisitos...');
  
  for (const m of materiasData) {
    if (m.prereq) {
        const idMateriaActual = codigoToIdMap.get(String(m.codigo));
        const idMateriaPrereq = codigoToIdMap.get(String(m.prereq));

        if (idMateriaActual && idMateriaPrereq) {
            await prisma.materia.update({
                where: { id: idMateriaActual },
                data: {
                    matIdMateria: idMateriaPrereq // FK field
                }
            });
        } else {
            console.warn(`Advertencia: No se encontró el ID para el prerequisito ${m.prereq} de la materia ${m.nombre}`);
        }
    }
  }

  console.log('Seeding completado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });