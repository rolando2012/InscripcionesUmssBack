import prisma from '../db.js';
// Helper para convertir enteros de hora (ej: 945) a objeto Date JS
const createTime = (timeInt) => {
  const timeStr = timeInt.toString().padStart(3, '0'); // "945" -> "0945"
  const hours = parseInt(timeStr.slice(0, -2));
  const minutes = parseInt(timeStr.slice(-2));
  
  const date = new Date();
  date.setUTCHours(hours, minutes, 0, 0);
  // Nota: Prisma guardará esto como DateTime. Al consultar solo nos importa la hora.
  return date;
};

// Datos extraídos y expandidos (Niveles A-D + Electiva)
const gruposRawData = [
  // ================= NIVEL A =================
  // --- INGLES I (1803001) ---
  {
    codigoMateria: 1803001,
    grupo: 1,
    docente: "VARGAS LOPEZ MARIA",
    horarios: [
      { dia: "LU", inicio: 1415, fin: 1545, aula: "612" },
      { dia: "MI", inicio: 1415, fin: 1545, aula: "612" }
    ]
  },
  // --- FISICA GENERAL (2006063) ---
  {
    codigoMateria: 2006063,
    grupo: 1,
    docente: "AGUILAR PEREZ CARLOS",
    horarios: [
      { dia: "MA", inicio: 815, fin: 945, aula: "693C" },
      { dia: "JU", inicio: 815, fin: 945, aula: "693C" }
    ]
  },
  {
    codigoMateria: 2006063,
    grupo: 2,
    docente: "TORRICO SALINAS ANA",
    horarios: [
      { dia: "MI", inicio: 1115, fin: 1245, aula: "692A" },
      { dia: "VI", inicio: 1115, fin: 1245, aula: "692A" }
    ]
  },
  // --- ALGEBRA I (2008019) ---
  {
    codigoMateria: 2008019,
    grupo: 10,
    docente: "RODRIGUEZ SEJAS JUAN ANTONIO",
    horarios: [
      { dia: "MA", inicio: 945, fin: 1115, aula: "693B" },
      { dia: "MI", inicio: 815, fin: 945, aula: "692E" },
      { dia: "VI", inicio: 945, fin: 1115, aula: "692F" }
    ]
  },
  {
    codigoMateria: 2008019,
    grupo: 5,
    docente: "TABORGA ACHA FIDEL",
    horarios: [
      { dia: "MI", inicio: 1415, fin: 1545, aula: "617" },
      { dia: "VI", inicio: 1415, fin: 1545, aula: "617" }
    ]
  },
  // --- CALCULO I (2008054) ---
  {
    codigoMateria: 2008054,
    grupo: 1,
    docente: "ORELLANA LAFUENTE RENATO",
    horarios: [
      { dia: "LU", inicio: 815, fin: 945, aula: "617" },
      { dia: "MI", inicio: 815, fin: 945, aula: "617" },
      { dia: "VI", inicio: 815, fin: 945, aula: "617" }
    ]
  },
  {
    codigoMateria: 2008054,
    grupo: 4,
    docente: "MOLLO MAMANI ALBERTO",
    horarios: [
      { dia: "LU", inicio: 945, fin: 1115, aula: "624" },
      { dia: "JU", inicio: 945, fin: 1115, aula: "624" }
    ]
  },
  // --- INTRODUCCION A LA PROGRAMACION (2010010) ---
  {
    codigoMateria: 2010010,
    grupo: 1,
    docente: "COSTAS JAUREGUI VLADIMIR",
    horarios: [
      { dia: "LU", inicio: 1415, fin: 1545, aula: "691B" },
      { dia: "MI", inicio: 1415, fin: 1545, aula: "691B" },
      { dia: "VI", inicio: 1415, fin: 1545, aula: "691B" }
    ]
  },
  {
    codigoMateria: 2010010,
    grupo: 2,
    docente: "BLANCO COCA LETICIA",
    horarios: [
      { dia: "MA", inicio: 1715, fin: 1845, aula: "691C" },
      { dia: "JU", inicio: 1715, fin: 1845, aula: "691C" }
    ]
  },
  // --- METODOLOGIA INVESTIGACION (2010140) ---
  {
    codigoMateria: 2010140,
    grupo: 1,
    docente: "GUZMAN SAAVEDRA RAQUEL",
    horarios: [
      { dia: "VI", inicio: 945, fin: 1115, aula: "690D" }
    ]
  },

  // ================= NIVEL B =================
  // --- ALGEBRA II (2008022) ---
  {
    codigoMateria: 2008022,
    grupo: 1,
    docente: "TORRICO BASCARAN WALTER",
    horarios: [
      { dia: "MA", inicio: 1115, fin: 1245, aula: "693B" },
      { dia: "JU", inicio: 1115, fin: 1245, aula: "693B" }
    ]
  },
  // --- CALCULO II (2008056) ---
  {
    codigoMateria: 2008056,
    grupo: 1,
    docente: "FLORES MONTAÑO JORGE",
    horarios: [
      { dia: "LU", inicio: 1545, fin: 1715, aula: "691A" },
      { dia: "MI", inicio: 1545, fin: 1715, aula: "691A" }
    ]
  },
  // --- MATEMATICA DISCRETA (2008057) ---
  {
    codigoMateria: 2008057,
    grupo: 1,
    docente: "GUZMAN SORIA JAIME",
    horarios: [
      { dia: "LU", inicio: 1715, fin: 1845, aula: "623" },
      { dia: "MI", inicio: 1715, fin: 1845, aula: "623" }
    ]
  },
  // --- ELEM. DE PROGRAMACION (2010003) ---
  {
    codigoMateria: 2010003,
    grupo: 1,
    docente: "BLANCO COCA LETICIA",
    horarios: [
      { dia: "LU", inicio: 945, fin: 1115, aula: "691C" },
      { dia: "MI", inicio: 945, fin: 1115, aula: "691C" }
    ]
  },
  {
    codigoMateria: 2010003,
    grupo: 2,
    docente: "VILLARROEL NOVILLO JIMMY",
    horarios: [
      { dia: "MA", inicio: 815, fin: 945, aula: "690E" },
      { dia: "JU", inicio: 815, fin: 945, aula: "690E" }
    ]
  },
  // --- ARQUITECTURA DE COMPUTADORAS I (2010013) ---
  {
    codigoMateria: 2010013,
    grupo: 1,
    docente: "TERRAZAS VARGAS RICHARD",
    horarios: [
      { dia: "VI", inicio: 1415, fin: 1545, aula: "692F" }
    ]
  },

  // ================= NIVEL C =================
  // --- ECUACIONES DIFERENCIALES (2008058) ---
  {
    codigoMateria: 2008058,
    grupo: 1,
    docente: "RIVERA CLAUDIA",
    horarios: [
      { dia: "LU", inicio: 645, fin: 815, aula: "617" },
      { dia: "MA", inicio: 645, fin: 815, aula: "617" }
    ]
  },
  // --- ESTADISTICA I (2008059) ---
  {
    codigoMateria: 2008059,
    grupo: 1,
    docente: "VALENZUELA MIRANDA ROSIO",
    horarios: [
      { dia: "MI", inicio: 945, fin: 1115, aula: "691D" },
      { dia: "VI", inicio: 945, fin: 1115, aula: "691D" }
    ]
  },
  // --- METODOS TECNICAS Y TALLER (2010012) ---
  {
    codigoMateria: 2010012,
    grupo: 1,
    docente: "ACHA CABAERO PATRICIA",
    horarios: [
      { dia: "MA", inicio: 1545, fin: 1715, aula: "691B" }
    ]
  },
  // --- BASE DE DATOS I (2010015) ---
  {
    codigoMateria: 2010015,
    grupo: 1,
    docente: "USTARIZ VARGAS HERNAN",
    horarios: [
      { dia: "MA", inicio: 945, fin: 1115, aula: "692D" },
      { dia: "JU", inicio: 945, fin: 1115, aula: "692D" }
    ]
  },
  // --- CIRCUITOS ELECTRONICOS (2010141) ---
  {
    codigoMateria: 2010141,
    grupo: 1,
    docente: "ZURITA BORIS",
    horarios: [
      { dia: "LU", inicio: 1845, fin: 2015, aula: "692H" }
    ]
  },

  // ================= NIVEL D =================
  // --- ESTADISTICA II (2008061) ---
  {
    codigoMateria: 2008061,
    grupo: 1,
    docente: "VALENZUELA MIRANDA ROSIO",
    horarios: [
      { dia: "MA", inicio: 815, fin: 945, aula: "692B" },
      { dia: "JU", inicio: 815, fin: 945, aula: "692B" }
    ]
  },
  // --- BASE DE DATOS II (2010016) ---
  {
    codigoMateria: 2010016,
    grupo: 1,
    docente: "FLORES VILLARROEL CORINA",
    horarios: [
      { dia: "MI", inicio: 1545, fin: 1715, aula: "690E" },
      { dia: "VI", inicio: 1545, fin: 1715, aula: "690E" }
    ]
  },
  {
    codigoMateria: 2010016,
    grupo: 2,
    docente: "GARCIA PEREZ CARMEN ROSA",
    horarios: [
      { dia: "LU", inicio: 1115, fin: 1245, aula: "INFLAB" }
    ]
  },
  // --- TALLER DE SISTEMAS OPERATIVOS (2010017) ---
  {
    codigoMateria: 2010017,
    grupo: 1,
    docente: "RODRIGUEZ BILBAO MARCOS",
    horarios: [
      { dia: "MA", inicio: 1415, fin: 1545, aula: "691E" },
      { dia: "JU", inicio: 1415, fin: 1545, aula: "691E" }
    ]
  },
  // --- SISTEMAS DE INFORMACION I (2010018) ---
  {
    codigoMateria: 2010018,
    grupo: 1,
    docente: "MONTALVO ARNEZ SAUL",
    horarios: [
      { dia: "LU", inicio: 1845, fin: 2015, aula: "617" }
    ]
  },
  // --- CONTABILIDAD BASICA (2016046) ---
  {
    codigoMateria: 2016046,
    grupo: 1,
    docente: "ZURITA VILLARROEL GUALBERTO",
    horarios: [
      { dia: "VI", inicio: 645, fin: 815, aula: "624" }
    ]
  },
  // --- INVESTIGACION OPERATIVA I (2016048) ---
  {
    codigoMateria: 2016048,
    grupo: 1,
    docente: "BUSTAMANTE GARCIA MIRTHA",
    horarios: [
      { dia: "MI", inicio: 945, fin: 1115, aula: "625D" },
      { dia: "VI", inicio: 945, fin: 1115, aula: "625D" }
    ]
  },

  // ================= ELECTIVAS =================
  // --- ROBOTICA (2010103) - Nivel H ---
  {
    codigoMateria: 2010103,
    grupo: 1,
    docente: "CHOQUE LUIS",
    horarios: [
      { dia: "SA", inicio: 815, fin: 1115, aula: "INFLAB" } // Horario intensivo sabados
    ]
  },
  // --- PROGRAMACION MOVIL (2010174) - Nivel I ---
  {
    codigoMateria: 2010174,
    grupo: 1,
    docente: "FIORILO LOZADA AMERICO",
    horarios: [
      { dia: "MA", inicio: 2015, fin: 2145, aula: "691C" },
      { dia: "VI", inicio: 2015, fin: 2145, aula: "691E" }
    ]
  }
];

// Mapeo de abreviaturas a nombres completos
const diasMap = {
  "LU": "Lunes", "MA": "Martes", "MI": "Miércoles", 
  "JU": "Jueves", "VI": "Viernes", "SA": "Sábado", "DO": "Domingo"
};

async function main() {
  console.log('--- Iniciando Seed de Grupos y Horarios ---');

  // 1. Poblar tabla DIA
  console.log('1. Creando/Verificando Días...');
  const diasRef = {};
  for (const [key, nombre] of Object.entries(diasMap)) {
    const dia = await prisma.dia.create({
      data: { nombreDia: nombre }
    });
    diasRef[key] = dia.id; // Guardamos ID para usar luego: diasRef['LU'] = 1
  }

  // 2. Procesar Grupos
  console.log('2. Procesando Grupos, Docentes, Aulas y Horas...');

  for (const g of gruposRawData) {
    // A. Buscar Materia (Debe existir del seed anterior)
    const materia = await prisma.materia.findFirst({
      where: { codigoMateria: g.codigoMateria }
    });

    if (!materia) {
      console.warn(`[SKIP] Materia con código ${g.codigoMateria} no encontrada.`);
      continue;
    }

    // B. Gestionar Docente (Persona + Docente)
    // Asumimos formato "APELLIDOS NOMBRES" o similar. Simplificación para el seed.
    let docente = await prisma.docente.findFirst({
      where: { persona: { apellidos: { contains: g.docente.split(" ")[0] } } }, // Busqueda simple
      include: { persona: true }
    });

    if (!docente) {
      // Crear Persona
      const nuevaPersona = await prisma.persona.create({
        data: {
          nombres: g.docente.split(" ").slice(2).join(" "), // Intento de separar nombre
          apellidos: g.docente.split(" ").slice(0, 2).join(" ") // Intento de separar apellido
        }
      });
      // Crear Docente
      docente = await prisma.docente.create({
        data: {
          personaId: nuevaPersona.id,
          titulo: "Lic/Ing"
        }
      });
    }

    // C. Crear Grupo
    const grupoCreado = await prisma.grupo.create({
      data: {
        materiaId: materia.id,
        docenteId: docente.id,
        codigoGrupo: g.grupo,
        nombreGrupo: `Grupo ${g.grupo}`,
        cuposDisponible: 3, // Default
        mesaDisponible: true
      }
    });

    console.log(` > Grupo ${g.grupo} creado para ${materia.nombreMateria} (${g.docente})`);

    // D. Crear Horarios
    for (const h of g.horarios) {
      // D.1 Gestionar Aula (Upsert manual)
      let aula = await prisma.aula.findFirst({ where: { nombreAula: h.aula } });
      if (!aula) {
        aula = await prisma.aula.create({ data: { nombreAula: h.aula } });
      }

      // D.2 Gestionar Hora (Upsert manual basado en inicio/fin)
      // Buscamos si existe un bloque horario idéntico
      const inicioDate = createTime(h.inicio);
      const finDate = createTime(h.fin);
      
      let hora = await prisma.hora.findFirst({
        where: {
          inicio: inicioDate,
          fin: finDate
        }
      });

      if (!hora) {
        hora = await prisma.hora.create({
          data: {
            inicio: inicioDate,
            fin: finDate
          }
        });
      }

      // D.3 Crear relación Horario
      await prisma.horario.create({
        data: {
          grupoId: grupoCreado.id,
          diaId: diasRef[h.dia],
          horaId: hora.id,
          aulaId: aula.id
        }
      });
    }
  }

  console.log('--- Seed de Grupos finalizado ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });