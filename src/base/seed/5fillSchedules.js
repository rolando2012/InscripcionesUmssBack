import prisma from '../db.js';

// Helper para convertir hora formato entero (945) a objeto Date para campo DateTime @db.Time
const createTime = (timeInt) => {
  const timeStr = timeInt.toString().padStart(3, '0');
  const hours = parseInt(timeStr.slice(0, -2));
  const minutes = parseInt(timeStr.slice(-2));
  
  // Usamos una fecha base arbitraria, Prisma solo guardará la parte de la hora
  const date = new Date();
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
};

// Mapeo para buscar IDs de la tabla Dia
const diasMap = {
  "LU": "Lunes", "MA": "Martes", "MI": "Miércoles", 
  "JU": "Jueves", "VI": "Viernes", "SA": "Sábado"
};

// DATA: Horarios extraídos (Niveles B al J y faltantes)
const schedulesData = [
  // ================= NIVEL B =================
  {
    codigoMateria: 2008022, // ALGEBRA II
    grupo: 5, docente: "TAYLOR TERRAZAS DARLONG",
    horarios: [ { dia: "JU", inicio: 815, fin: 945, aula: "622" }, { dia: "VI", inicio: 815, fin: 945, aula: "660" }, { dia: "VI", inicio: 945, fin: 1115, aula: "651" } ]
  },
  {
    codigoMateria: 2008022, 
    grupo: 6, docente: "MEDINA GAMBOA JULIO",
    horarios: [ { dia: "JU", inicio: 1115, fin: 1245, aula: "691B" }, { dia: "VI", inicio: 1245, fin: 1415, aula: "691A" } ]
  },
  { // Auxiliatura del grupo 6
    codigoMateria: 2008022, grupo: 6, docente: "CRUZ ACHAYA MARIA CLAUDIA",
    horarios: [ { dia: "SA", inicio: 815, fin: 945, aula: "692A" } ]
  },
  {
    codigoMateria: 2008022, 
    grupo: 8, docente: "OMONTE OJALVO JOSE ROBERTO",
    horarios: [ { dia: "LU", inicio: 1115, fin: 1245, aula: "624" }, { dia: "JU", inicio: 1415, fin: 1545, aula: "692B" } ]
  },
  {
    codigoMateria: 2010013, // ARQ COMPUTADORAS I
    grupo: 1, docente: "ACHA PEREZ SAMUEL",
    horarios: [ { dia: "LU", inicio: 1545, fin: 1715, aula: "692C" }, { dia: "MA", inicio: 1715, fin: 1845, aula: "691D" } ]
  },
  {
    codigoMateria: 2010013, 
    grupo: 2, docente: "BLANCO COCA LETICIA",
    horarios: [ { dia: "LU", inicio: 1415, fin: 1545, aula: "691B" }, { dia: "JU", inicio: 1415, fin: 1545, aula: "624" } ]
  },
  {
    codigoMateria: 2010013, 
    grupo: 3, docente: "AGREDA CORRALES LUIS ROBERTO",
    horarios: [ { dia: "LU", inicio: 1115, fin: 1245, aula: "692A" }, { dia: "MI", inicio: 1245, fin: 1415, aula: "617" } ]
  },
  {
    codigoMateria: 2008056, // CALCULO II
    grupo: 6, docente: "TERRAZAS LOBO JUAN",
    horarios: [ { dia: "MI", inicio: 945, fin: 1115, aula: "691D" }, { dia: "JU", inicio: 1115, fin: 1245, aula: "693D" } ]
  },
  {
    codigoMateria: 2008056, // TP Grupo 6
    grupo: 6, docente: "SOSA MARZE DAVID SAUL",
    horarios: [ { dia: "MI", inicio: 1415, fin: 1545, aula: "625C" } ]
  },
  {
    codigoMateria: 2008056, // GRUPO 6A (Caso especial String)
    grupo: "6A", docente: "BUSTILLOS VARGAS ALEX",
    horarios: [ { dia: "LU", inicio: 1245, fin: 1415, aula: "693D" }, { dia: "MA", inicio: 945, fin: 1115, aula: "692D" }, { dia: "JU", inicio: 815, fin: 945, aula: "691B" } ]
  },
  {
    codigoMateria: 2008056, 
    grupo: 7, docente: "CATARI RIOS RAUL",
    horarios: [ { dia: "LU", inicio: 815, fin: 945, aula: "622" }, { dia: "MA", inicio: 945, fin: 1115, aula: "607" }, { dia: "MI", inicio: 945, fin: 1115, aula: "693B" } ]
  },
  {
    codigoMateria: 2010003, // ELEM PROG
    grupo: 1, docente: "TORRICO BASCOPE ROSEMARY",
    horarios: [ { dia: "MA", inicio: 815, fin: 945, aula: "617C" }, { dia: "VI", inicio: 815, fin: 945, aula: "690C" } ]
  },
  {
    codigoMateria: 2010003, // TP Grupo 1
    grupo: 1, docente: "CUENCA VARGAS FERNANDO",
    horarios: [ { dia: "MI", inicio: 1115, fin: 1245, aula: "691F" } ]
  },
  {
    codigoMateria: 2010003, 
    grupo: 2, docente: "BLANCO COCA LETICIA",
    horarios: [ { dia: "LU", inicio: 1245, fin: 1415, aula: "623" }, { dia: "JU", inicio: 1245, fin: 1415, aula: "624" } ]
  },
  {
    codigoMateria: 2010003, // TP Grupo 2
    grupo: 2, docente: "ORTIZ FLORES ANDY",
    horarios: [ { dia: "MI", inicio: 1545, fin: 1715, aula: "623" } ]
  },
  {
    codigoMateria: 2010003, 
    grupo: 3, docente: "BLANCO COCA LETICIA",
    horarios: [ { dia: "MA", inicio: 1845, fin: 2015, aula: "622" }, { dia: "MI", inicio: 645, fin: 815, aula: "691C" } ]
  },

  // ================= NIVEL C =================
  {
    codigoMateria: 2010015, // BASE DE DATOS I
    grupo: 1, docente: "FERNANDEZ RAMOS DAVID",
    horarios: [ { dia: "MI", inicio: 1245, fin: 1415, aula: "691B" }, { dia: "MA", inicio: 1245, fin: 1415, aula: "691B" } ]
  },
  {
    codigoMateria: 2010015, 
    grupo: 2, docente: "DELGADILLO COSSIO DAVID",
    horarios: [ { dia: "MI", inicio: 1245, fin: 1415, aula: "693D" }, { dia: "JU", inicio: 1245, fin: 1415, aula: "692H" }, { dia: "LU", inicio: 645, fin: 815, aula: "693B" } ]
  },
  {
    codigoMateria: 2008060, // CALCULO NUMERICO
    grupo: 2, docente: "CALANCHA NAVIA BORIS",
    horarios: [ { dia: "LU", inicio: 645, fin: 815, aula: "622" }, { dia: "MA", inicio: 645, fin: 815, aula: "693A" }, { dia: "VI", inicio: 645, fin: 815, aula: "693D" } ]
  },
  {
    codigoMateria: 2008060, 
    grupo: 3, docente: "JUCHANI BAZUALDO DEMETRIO",
    horarios: [ { dia: "LU", inicio: 1415, fin: 1545, aula: "617" }, { dia: "MA", inicio: 1115, fin: 1245, aula: "692H" }, { dia: "JU", inicio: 645, fin: 815, aula: "690D" } ]
  },
  {
    codigoMateria: 2010141, // CIRCUITOS ELECTRONICOS
    grupo: 2, docente: "ZABALAGA MONTANO OSCAR",
    horarios: [ { dia: "LU", inicio: 1545, fin: 1715, aula: "691A" }, { dia: "MA", inicio: 1545, fin: 1715, aula: "692A" } ]
  },
  {
    codigoMateria: 2008058, // ECUACIONES DIFERENCIALES
    grupo: "3A", docente: "CATARI RIOS RAUL",
    horarios: [ { dia: "MI", inicio: 1245, fin: 1415, aula: "693C" }, { dia: "VI", inicio: 945, fin: 1115, aula: "623" }, { dia: "SA", inicio: 945, fin: 1115, aula: "617" } ]
  },
  {
    codigoMateria: 2008058, 
    grupo: 4, docente: "TAYLOR TERRAZAS DARLONG",
    horarios: [ { dia: "LU", inicio: 945, fin: 1115, aula: "651" }, { dia: "MA", inicio: 815, fin: 945, aula: "692C" } ]
  },
  {
    codigoMateria: 2008059, // ESTADISTICA I
    grupo: 3, docente: "REVOLLO TERAN LUZ MAYA",
    horarios: [ { dia: "MA", inicio: 945, fin: 1115, aula: "692G" }, { dia: "JU", inicio: 1415, fin: 1545, aula: "690C" } ]
  },
  {
    codigoMateria: 2008059, 
    grupo: 4, docente: "SORUCO MAITA JOSE",
    horarios: [ { dia: "MA", inicio: 1545, fin: 1715, aula: "AULVIR" }, { dia: "VI", inicio: 945, fin: 1115, aula: "AULVIR" } ]
  },
  {
    codigoMateria: 2008059, 
    grupo: 5, docente: "OMONTE OJALVO JOSE GIL",
    horarios: [ { dia: "LU", inicio: 2015, fin: 2145, aula: "624" }, { dia: "MA", inicio: 1715, fin: 1845, aula: "692C" }, { dia: "JU", inicio: 815, fin: 945, aula: "690B" } ]
  },

  // ================= NIVEL D =================
  {
    codigoMateria: 2010016, // BASE DE DATOS II
    grupo: 1, docente: "APARICIO YUJA TATIANA",
    horarios: [ { dia: "LU", inicio: 645, fin: 815, aula: "617B" }, { dia: "MA", inicio: 645, fin: 815, aula: "691F" }, { dia: "MI", inicio: 815, fin: 945, aula: "617B" } ]
  },
  {
    codigoMateria: 2010016, 
    grupo: 2, docente: "APARICIO YUJA TATIANA",
    horarios: [ { dia: "LU", inicio: 1245, fin: 1415, aula: "692B" }, { dia: "MA", inicio: 815, fin: 945, aula: "INFLAB" }, { dia: "MI", inicio: 945, fin: 1115, aula: "612" } ]
  },
  {
    codigoMateria: 2016046, // CONTABILIDAD BASICA
    grupo: 2, docente: "MEJIA URQUIETA VICTOR",
    horarios: [ { dia: "JU", inicio: 945, fin: 1115, aula: "625C" }, { dia: "VI", inicio: 945, fin: 1115, aula: "693D" } ]
  },
  {
    codigoMateria: 2008061, // ESTADISTICA II
    grupo: 2, docente: "SORUCO MAITA JOSE",
    horarios: [ { dia: "LU", inicio: 945, fin: 1115, aula: "AULVIR" }, { dia: "JU", inicio: 1545, fin: 1715, aula: "AULVIR" } ]
  },
  {
    codigoMateria: 2008061, 
    grupo: 3, docente: "OMONTE OJALVO JOSE ROBERTO",
    horarios: [ { dia: "LU", inicio: 815, fin: 945, aula: "692B" }, { dia: "VI", inicio: 1415, fin: 1545, aula: "691E" } ]
  },
  {
    codigoMateria: 2016048, // INVESTIGACION OPERATIVA I
    grupo: 1, docente: "PERICON BALDERRAMA ALFREDO",
    horarios: [ { dia: "LU", inicio: 1115, fin: 1245, aula: "682L8" }, { dia: "MA", inicio: 645, fin: 815, aula: "682L8" }, { dia: "MI", inicio: 815, fin: 945, aula: "682L7" } ]
  },
  {
    codigoMateria: 2016048, 
    grupo: 3, docente: "QUIROZ CHAVEZ ABDON",
    horarios: [ { dia: "MA", inicio: 1115, fin: 1245, aula: "AULVIR" }, { dia: "MI", inicio: 945, fin: 1115, aula: "AULVIR" }, { dia: "JU", inicio: 1245, fin: 1415, aula: "AULVIR" } ]
  },
  {
    codigoMateria: 2010018, // SISTEMAS DE INFORMACION I
    grupo: 1, docente: "SALAZAR SERRUDO CARLA",
    horarios: [ { dia: "MI", inicio: 1545, fin: 1715, aula: "692B" }, { dia: "JU", inicio: 945, fin: 1115, aula: "607" }, { dia: "VI", inicio: 945, fin: 1115, aula: "691E" } ]
  },
  {
    codigoMateria: 2010018, 
    grupo: 2, docente: "SALAZAR SERRUDO CARLA",
    horarios: [ { dia: "LU", inicio: 1715, fin: 1845, aula: "691B" }, { dia: "MA", inicio: 1715, fin: 1845, aula: "693D" }, { dia: "MI", inicio: 1845, fin: 2015, aula: "617" } ]
  },
  {
    codigoMateria: 2010017, // TALLER DE SISTEMAS OPERATIVOS
    grupo: 1, docente: "ORELLANA ARAOZ JORGE",
    horarios: [ { dia: "MI", inicio: 815, fin: 945, aula: "INFLAB" }, { dia: "JU", inicio: 815, fin: 945, aula: "691F" }, { dia: "VI", inicio: 1415, fin: 1545, aula: "691C" } ]
  },
  {
    codigoMateria: 2010017, 
    grupo: 2, docente: "ORELLANA ARAOZ JORGE",
    horarios: [ { dia: "LU", inicio: 815, fin: 945, aula: "623" }, { dia: "MI", inicio: 1415, fin: 1545, aula: "691A" }, { dia: "VI", inicio: 815, fin: 945, aula: "624" } ]
  },
  {
    codigoMateria: 2010017, 
    grupo: 3, docente: "CUSSI NICOLAS GROVER",
    horarios: [ { dia: "LU", inicio: 1845, fin: 2015, aula: "INFLAB" }, { dia: "MA", inicio: 1845, fin: 2015, aula: "691E" }, { dia: "JU", inicio: 2015, fin: 2145, aula: "691A" } ]
  },

  // ================= NIVEL E =================
  {
    codigoMateria: 2010035, // APLICACION DE SISTEMAS OPERATIVOS
    grupo: 1, docente: "CUSSI NICOLAS GROVER",
    horarios: [ { dia: "LU", inicio: 2015, fin: 2145, aula: "691E" }, { dia: "VI", inicio: 1845, fin: 2015, aula: "693D" } ]
  },
  {
    codigoMateria: 2010035, 
    grupo: 2, docente: "CUSSI NICOLAS GROVER",
    horarios: [ { dia: "LU", inicio: 1245, fin: 1415, aula: "693B" }, { dia: "JU", inicio: 1845, fin: 2015, aula: "690B" } ]
  },
  {
    codigoMateria: 2010035, 
    grupo: 3, docente: "AYOROA CARDOZO JOSE",
    horarios: [ { dia: "LU", inicio: 945, fin: 1115, aula: "693A" }, { dia: "MI", inicio: 945, fin: 1115, aula: "INFLAB" } ]
  },
  {
    codigoMateria: 1803002, // INGLES II
    grupo: 1, docente: "PEETERS ILONAA MAGDA",
    horarios: [ { dia: "MA", inicio: 945, fin: 1115, aula: "691B" }, { dia: "JU", inicio: 645, fin: 815, aula: "661" } ]
  },
  {
    codigoMateria: 1803002, 
    grupo: 2, docente: "PEETERS ILONAA MAGDA",
    horarios: [ { dia: "JU", inicio: 945, fin: 1115, aula: "691B" }, { dia: "VI", inicio: 945, fin: 1115, aula: "691C" } ]
  },
  {
    codigoMateria: 2016051, // INVESTIGACION OPERATIVA II
    grupo: 2, docente: "MANCHEGO CASTELLON ROBERTO",
    horarios: [ { dia: "MI", inicio: 1715, fin: 1845, aula: "692C" }, { dia: "JU", inicio: 1715, fin: 1845, aula: "607" }, { dia: "SA", inicio: 815, fin: 945, aula: "623" } ]
  },
  {
    codigoMateria: 2016057, // MERCADOTECNIA
    grupo: 2, docente: "GUTIERREZ ANDRADE OSVALDO",
    horarios: [ { dia: "LU", inicio: 1545, fin: 1715, aula: "661" }, { dia: "VI", inicio: 1545, fin: 1715, aula: "693D" } ]
  },
  {
    codigoMateria: 2016057, 
    grupo: 3, docente: "SARMIENTO FRANCO ARIEL",
    horarios: [ { dia: "MA", inicio: 1845, fin: 2015, aula: "623" }, { dia: "MI", inicio: 1845, fin: 2015, aula: "690D" } ]
  },
  {
    codigoMateria: 2010022, // SISTEMAS DE INFORMACION II
    grupo: 1, docente: "FLORES SOLIZ JUAN MARCELO",
    horarios: [ { dia: "MA", inicio: 645, fin: 815, aula: "690E" }, { dia: "MI", inicio: 645, fin: 815, aula: "690D" }, { dia: "VI", inicio: 645, fin: 815, aula: "691C" } ]
  },
  {
    codigoMateria: 2010022, // Grupo 1A
    grupo: "1A", docente: "SALAZAR SERRUDO CARLA",
    horarios: [ { dia: "LU", inicio: 1545, fin: 1715, aula: "693A" }, { dia: "MA", inicio: 1545, fin: 1715, aula: "692D" }, { dia: "JU", inicio: 1545, fin: 1715, aula: "692F" } ]
  },
  {
    codigoMateria: 2010022, 
    grupo: 2, docente: "JALDIN ROSALES ROLANDO",
    horarios: [ { dia: "MI", inicio: 815, fin: 945, aula: "690E" }, { dia: "JU", inicio: 945, fin: 1115, aula: "690E" }, { dia: "VI", inicio: 945, fin: 1115, aula: "690E" } ]
  },
  {
    codigoMateria: 2010142, // SISTEMAS I
    grupo: 2, docente: "FIORILO LOZADA AMERICO",
    horarios: [ { dia: "LU", inicio: 1845, fin: 2015, aula: "693A" }, { dia: "VI", inicio: 1845, fin: 2015, aula: "692C" } ]
  },
  {
    codigoMateria: 2010053, // TALLER DE BASE DE DATOS
    grupo: 1, docente: "CALANCHA NAVIA BORIS",
    horarios: [ { dia: "MI", inicio: 1715, fin: 1845, aula: "690D" }, { dia: "JU", inicio: 1715, fin: 1845, aula: "693C" } ]
  },
  {
    codigoMateria: 2010053, 
    grupo: 2, docente: "CALANCHA NAVIA BORIS",
    horarios: [ { dia: "MI", inicio: 1845, fin: 2015, aula: "692C" }, { dia: "JU", inicio: 1845, fin: 2015, aula: "693B" } ]
  },
  {
    codigoMateria: 2010053, 
    grupo: 3, docente: "FLORES SOLIZ JUAN MARCELO",
    horarios: [ { dia: "LU", inicio: 645, fin: 815, aula: "690B" }, { dia: "JU", inicio: 645, fin: 815, aula: "690B" } ]
  },
  {
    codigoMateria: 2010053, 
    grupo: 4, docente: "CALANCHA NAVIA BORIS",
    horarios: [ { dia: "MI", inicio: 1245, fin: 1415, aula: "INFLAB" }, { dia: "JU", inicio: 1245, fin: 1415, aula: "INFLAB" } ]
  },

  // ================= NIVEL F =================
  {
    codigoMateria: 2010020, // INGENIERIA DE SOFTWARE
    grupo: 1, docente: "CAMACHO DEL CASTILLO INDIRA",
    horarios: [ { dia: "MA", inicio: 645, fin: 815, aula: "651" }, { dia: "MI", inicio: 645, fin: 815, aula: "652" }, { dia: "JU", inicio: 645, fin: 815, aula: "692D" } ]
  },
  {
    codigoMateria: 2010020, 
    grupo: 2, docente: "TORRICO BASCOPE ROSEMARY",
    horarios: [ { dia: "MA", inicio: 1115, fin: 1245, aula: "690B" }, { dia: "MI", inicio: 945, fin: 1115, aula: "INFLAB" }, { dia: "VI", inicio: 945, fin: 1115, aula: "691D" } ]
  },
  {
    codigoMateria: 2010027, // INTELIGENCIA ARTIFICIAL
    grupo: 1, docente: "GARCIA PEREZ CARMEN ROSA",
    horarios: [ { dia: "MA", inicio: 1115, fin: 1245, aula: "692D" }, { dia: "MI", inicio: 945, fin: 1115, aula: "692A" }, { dia: "JU", inicio: 1115, fin: 1245, aula: "692D" } ]
  },
  {
    codigoMateria: 2010027, 
    grupo: 2, docente: "RODRIGUEZ BILBAO ERIKA",
    horarios: [ { dia: "LU", inicio: 1245, fin: 1415, aula: "691C" }, { dia: "MA", inicio: 1245, fin: 1415, aula: "690B" }, { dia: "MI", inicio: 1245, fin: 1415, aula: "692C" } ]
  },
  {
    codigoMateria: 2010047, // REDES DE COMPUTADORAS
    grupo: 1, docente: "ORELLANA ARAOZ JORGE",
    horarios: [ { dia: "LU", inicio: 1415, fin: 1545, aula: "692B" }, { dia: "MI", inicio: 945, fin: 1115, aula: "693A" }, { dia: "VI", inicio: 945, fin: 1115, aula: "692C" } ]
  },
  {
    codigoMateria: 2010047, 
    grupo: 2, docente: "ORELLANA ARAOZ JORGE",
    horarios: [ { dia: "LU", inicio: 945, fin: 1115, aula: "691B" }, { dia: "MA", inicio: 945, fin: 1115, aula: "693A" }, { dia: "JU", inicio: 945, fin: 1115, aula: "691C" } ]
  },
  {
    codigoMateria: 2010019, // SIMULACION DE SISTEMAS
    grupo: 1, docente: "VILLARROEL TAPIA HENRY",
    horarios: [ { dia: "LU", inicio: 1415, fin: 1545, aula: "692G" }, { dia: "MI", inicio: 645, fin: 815, aula: "651" } ]
  },
  {
    codigoMateria: 2010019, 
    grupo: 2, docente: "VILLARROEL TAPIA HENRY",
    horarios: [ { dia: "LU", inicio: 645, fin: 815, aula: "625D" }, { dia: "MA", inicio: 645, fin: 815, aula: "617C" } ]
  },
  {
    codigoMateria: 2010144, // SISTEMAS ECONOMICOS
    grupo: 2, docente: "VARGAS PEREDO EMIR",
    horarios: [ { dia: "LU", inicio: 1245, fin: 1415, aula: "625D" }, { dia: "MA", inicio: 1415, fin: 1545, aula: "660" } ]
  },
  {
    codigoMateria: 2010143, // SISTEMAS II
    grupo: 2, docente: "GARCIA MOLINA JUAN RUBEN",
    horarios: [ { dia: "MI", inicio: 1115, fin: 1245, aula: "693A" }, { dia: "JU", inicio: 1715, fin: 1845, aula: "691F" } ]
  },
  {
    codigoMateria: 2010182, // TELEFONIA IP
    grupo: 1, docente: "MONTOYA BURGOS YONY",
    horarios: [ { dia: "LU", inicio: 2015, fin: 2145, aula: "693B" }, { dia: "MA", inicio: 2015, fin: 2145, aula: "INFLAB" } ]
  },

  // ================= NIVEL G =================
  {
    codigoMateria: 2010186, // DINAMICA DE SISTEMAS
    grupo: 1, docente: "ORELLANA ARAOZ JORGE",
    horarios: [ { dia: "MA", inicio: 1415, fin: 1545, aula: "690C" }, { dia: "JU", inicio: 1415, fin: 1545, aula: "690E" } ]
  },
  {
    codigoMateria: 2014087, // ELECTROTECNIA INDUSTRIAL
    grupo: 5, docente: "ACHA PEREZ SAMUEL",
    horarios: [ { dia: "LU", inicio: 645, fin: 815, aula: "692E" }, { dia: "MA", inicio: 645, fin: 900, aula: "682L3" }, { dia: "MI", inicio: 645, fin: 815, aula: "693B" } ]
  },
  {
    codigoMateria: 2010145, // GESTION DE CALIDAD DE SOFTWARE
    grupo: 2, docente: "TORRICO BASCOPE ROSEMARY",
    horarios: [ { dia: "MA", inicio: 945, fin: 1115, aula: "690D" }, { dia: "JU", inicio: 815, fin: 945, aula: "691C" } ]
  },
  {
    codigoMateria: 2016092, // PLANIFICACION Y EVALUACION PROY
    grupo: 2, docente: "VARGAS ANTEZANA ADEMAR",
    horarios: [ { dia: "MA", inicio: 1715, fin: 1845, aula: "660" }, { dia: "MI", inicio: 645, fin: 815, aula: "692C" }, { dia: "JU", inicio: 945, fin: 1115, aula: "690B" } ]
  },
  {
    codigoMateria: 2010146, // REDES AVANZADAS
    grupo: 2, docente: "MONTECINOS CHOQUE MARCO",
    horarios: [ { dia: "MA", inicio: 1245, fin: 1415, aula: "607" }, { dia: "JU", inicio: 1245, fin: 1415, aula: "692A" } ]
  },
  {
    codigoMateria: 2010024, // TALLER DE INGENIERIA DE SOFTWARE
    grupo: 1, docente: "FLORES VILLARROEL CORINA",
    horarios: [ { dia: "LU", inicio: 945, fin: 1115, aula: "690D" }, { dia: "MA", inicio: 945, fin: 1115, aula: "690E" } ]
  },
  {
    codigoMateria: 2010024, 
    grupo: 2, docente: "BLANCO COCA LETICIA",
    horarios: [ { dia: "MA", inicio: 815, fin: 945, aula: "651" }, { dia: "MI", inicio: 815, fin: 945, aula: "INFLAB" } ]
  },
  {
    codigoMateria: 2010024, 
    grupo: 3, docente: "ESCALERA FERNANDEZ DAVID",
    horarios: [ { dia: "LU", inicio: 645, fin: 815, aula: "INFLAB" }, { dia: "JU", inicio: 645, fin: 815, aula: "INFLAB" } ]
  },
  {
    codigoMateria: 2010024, 
    grupo: 4, docente: "RODRIGUEZ BILBAO ERIKA",
    horarios: [ { dia: "LU", inicio: 1415, fin: 1545, aula: "690E" }, { dia: "MA", inicio: 1415, fin: 1545, aula: "690E" } ]
  },

  // ================= NIVEL H =================
  {
    codigoMateria: 2010102, // EVALUACION Y AUDITORIA
    grupo: 1, docente: "ROMERO RODRIGUEZ PATRICIA",
    horarios: [ { dia: "MA", inicio: 1115, fin: 1245, aula: "691F" }, { dia: "MI", inicio: 815, fin: 945, aula: "690B" }, { dia: "JU", inicio: 815, fin: 945, aula: "690C" } ]
  },
  {
    codigoMateria: 2010102, 
    grupo: 2, docente: "VILLARROEL NOVILLO JIMMY",
    horarios: [ { dia: "LU", inicio: 1545, fin: 1715, aula: "692F" }, { dia: "MA", inicio: 815, fin: 945, aula: "691D" }, { dia: "MI", inicio: 945, fin: 1115, aula: "661" } ]
  },
  {
    codigoMateria: 2016059, // GESTION ESTRATEGICA
    grupo: 2, docente: "GUZMAN ORELLANA GONZALO",
    horarios: [ { dia: "MA", inicio: 645, fin: 945, aula: "682L6" }, { dia: "MI", inicio: 815, fin: 945, aula: "682L6" } ]
  },
  {
    codigoMateria: 1803009, // INGLES III
    grupo: 1, docente: "GRILO SALVATIERRA MARIA",
    horarios: [ { dia: "MA", inicio: 1415, fin: 1545, aula: "693A" }, { dia: "VI", inicio: 1545, fin: 1715, aula: "693B" } ]
  },
  {
    codigoMateria: 2010119, // METODOL PLANIF PROY GRADO
    grupo: 3, docente: "JALDIN ROSALES ROLANDO",
    horarios: [ { dia: "MI", inicio: 945, fin: 1115, aula: "690E" }, { dia: "JU", inicio: 1545, fin: 1715, aula: "690E" }, { dia: "VI", inicio: 815, fin: 945, aula: "690E" } ]
  },
  {
    codigoMateria: 2010119, 
    grupo: 4, docente: "FIORILO LOZADA AMERICO",
    horarios: [ { dia: "LU", inicio: 2015, fin: 2145, aula: "692D" }, { dia: "MA", inicio: 1845, fin: 2015, aula: "642" }, { dia: "MI", inicio: 645, fin: 815, aula: "690C" } ]
  },
  {
    codigoMateria: 2010119, 
    grupo: 5, docente: "VILLARROEL TAPIA HENRY",
    horarios: [ { dia: "LU", inicio: 1545, fin: 1715, aula: "625C" }, { dia: "MA", inicio: 1715, fin: 1845, aula: "625C" }, { dia: "MI", inicio: 1715, fin: 1845, aula: "690B" } ]
  },
  {
    codigoMateria: 2010209, // SEGURIDAD DE SISTEMAS
    grupo: 1, docente: "ANTEZANA CAMACHO MARCELO",
    horarios: [ { dia: "LU", inicio: 1115, fin: 1245, aula: "INFLAB" }, { dia: "MA", inicio: 1115, fin: 1245, aula: "INFLAB" } ]
  },
  {
    codigoMateria: 2010034, // SISTEMAS COLABORATIVOS
    grupo: 1, docente: "ANTEZANA CAMACHO MARCELO",
    horarios: [ { dia: "LU", inicio: 815, fin: 945, aula: "INFLAB" }, { dia: "MA", inicio: 945, fin: 1115, aula: "INFLAB" } ]
  },
  {
    codigoMateria: 2010116, // TALLER DE SIMULACION
    grupo: 1, docente: "VILLARROEL TAPIA HENRY",
    horarios: [ { dia: "LU", inicio: 1845, fin: 2015, aula: "690E" }, { dia: "MI", inicio: 1415, fin: 1545, aula: "690E" } ]
  },
  {
    codigoMateria: 2010116, 
    grupo: 2, docente: "AYOROA CARDOZO JOSE",
    horarios: [ { dia: "LU", inicio: 815, fin: 945, aula: "661" }, { dia: "MI", inicio: 815, fin: 945, aula: "625D" } ]
  },

  // ================= NIVEL I/J =================
  {
    codigoMateria: 2010217, // BUSINESS INTELLIGENCE
    grupo: 1, docente: "DOCENTE POR DESIGNAR",
    horarios: [ { dia: "MI", inicio: 645, fin: 815, aula: "INFLAB" }, { dia: "VI", inicio: 645, fin: 815, aula: "691F" } ]
  },
  {
    codigoMateria: 2016049, // COSTOS INDUSTRIALES
    grupo: 2, docente: "LIMA VACAFLOR TITO",
    horarios: [ { dia: "LU", inicio: 1845, fin: 2015, aula: "617" }, { dia: "MI", inicio: 2015, fin: 2145, aula: "612" }, { dia: "SA", inicio: 1115, fin: 1245, aula: "617" } ]
  },
  {
    codigoMateria: 2016049, 
    grupo: 3, docente: "LIMA VACAFLOR TITO",
    horarios: [ { dia: "LU", inicio: 2015, fin: 2145, aula: "692E" }, { dia: "MI", inicio: 1845, fin: 2015, aula: "682L0" } ]
  },
  {
    codigoMateria: 2016052, // ING METODOS Y REING
    grupo: 2, docente: "COSIO PAPADOPOLIS CARLOS",
    horarios: [ { dia: "MA", inicio: 645, fin: 815, aula: "691B" }, { dia: "MI", inicio: 815, fin: 945, aula: "691C" }, { dia: "VI", inicio: 645, fin: 815, aula: "692A" } ]
  },
  {
    codigoMateria: 2016023, // INGENIERIA ECONOMICA
    grupo: 2, docente: "ARANIBAR LA FUENTE LIGIA",
    horarios: [ { dia: "MA", inicio: 815, fin: 945, aula: "682L8" }, { dia: "JU", inicio: 815, fin: 945, aula: "652" }, { dia: "VI", inicio: 815, fin: 945, aula: "692B" } ]
  },
  {
    codigoMateria: 2016023, 
    grupo: 3, docente: "ARANIBAR LA FUENTE LIGIA",
    horarios: [ { dia: "MA", inicio: 945, fin: 1115, aula: "652" }, { dia: "MI", inicio: 1715, fin: 1845, aula: "693B" }, { dia: "VI", inicio: 945, fin: 1115, aula: "690B" } ]
  },
  {
    codigoMateria: 2016021, // PLANIF CONTROL PROD I
    grupo: 3, docente: "QUIROZ CHAVEZ ABDON",
    horarios: [ { dia: "MA", inicio: 815, fin: 945, aula: "AULVIR" }, { dia: "MI", inicio: 1115, fin: 1245, aula: "AULVIR" }, { dia: "JU", inicio: 945, fin: 1115, aula: "AULVIR" } ]
  },
  {
    codigoMateria: 2016027, // PLANIF CONTROL PROD II
    grupo: 3, docente: "CHOQUE FLORES ALEX",
    horarios: [ { dia: "MA", inicio: 1845, fin: 2015, aula: "690B" }, { dia: "JU", inicio: 1845, fin: 2015, aula: "625D" }, { dia: "SA", inicio: 945, fin: 1115, aula: "691F" } ]
  },
  {
    codigoMateria: 2010147, // PRACTICA EMPRESARIAL
    grupo: 2, docente: "ANTEZANA CAMACHO MARCELO",
    horarios: [ { dia: "LU", inicio: 945, fin: 1115, aula: "690E" }, { dia: "MA", inicio: 815, fin: 945, aula: "INFLAB" } ]
  },
  {
    codigoMateria: 2010174, // PROGRAMACION MOVIL
    grupo: 1, docente: "FIORILO LOZADA AMERICO",
    horarios: [ { dia: "MA", inicio: 2015, fin: 2145, aula: "691C" }, { dia: "VI", inicio: 2015, fin: 2145, aula: "691E" } ]
  },
  {
    codigoMateria: 2010122, // PROYECTO FINAL
    grupo: 2, docente: "MONTANO QUIROGA VICTOR",
    horarios: [ { dia: "MA", inicio: 1115, fin: 1245, aula: "INFLAB" }, { dia: "JU", inicio: 815, fin: 945, aula: "INFDEP" } ]
  },
  {
    codigoMateria: 2010122, 
    grupo: 3, docente: "GARCIA PEREZ CARMEN ROSA",
    horarios: [ { dia: "MI", inicio: 1245, fin: 1415, aula: "690E" }, { dia: "JU", inicio: 815, fin: 945, aula: "690E" } ]
  },
  {
    codigoMateria: 2010122, 
    grupo: 4, docente: "ROMERO RODRIGUEZ PATRICIA",
    horarios: [ { dia: "LU", inicio: 1245, fin: 1415, aula: "692G" }, { dia: "MA", inicio: 945, fin: 1115, aula: "625C" } ]
  },
  {
    codigoMateria: 2010122, 
    grupo: 5, docente: "VILLARROEL NOVILLO JIMMY",
    horarios: [ { dia: "LU", inicio: 1415, fin: 1545, aula: "INFDEP" }, { dia: "MA", inicio: 1415, fin: 1545, aula: "INFDEP" } ]
  },
  {
    codigoMateria: 2010103, // ROBOTICA
    grupo: 1, docente: "GARCIA PEREZ CARMEN ROSA",
    horarios: [ { dia: "MA", inicio: 945, fin: 1115, aula: "692F" }, { dia: "JU", inicio: 945, fin: 1115, aula: "692G" } ]
  },
  {
    codigoMateria: 2010079, // WEB SEMANTICAS
    grupo: 1, docente: "RODRIGUEZ BILBAO ERIKA",
    horarios: [ { dia: "LU", inicio: 1115, fin: 1245, aula: "691C" }, { dia: "MI", inicio: 1415, fin: 1545, aula: "692D" } ]
  },
  {
    codigoMateria: 2010033, // GENERACION DE SOFTWARE
    grupo: 1, docente: "COSTAS JAUREGUI VLADIMIR",
    horarios: [ { dia: "MA", inicio: 1415, fin: 1545, aula: "607" }, { dia: "MI", inicio: 945, fin: 1115, aula: "692C" } ]
  },
  {
    codigoMateria: 2010191, // TECNICAS DE RUTEO
    grupo: 1, docente: "MONTOYA BURGOS YONY",
    horarios: [ { dia: "LU", inicio: 1845, fin: 2015, aula: "INFLAB" }, { dia: "MA", inicio: 1845, fin: 2015, aula: "INFLAB" } ]
  },
];

async function main() {
  console.log('--- Iniciando Seed Complementario de Horarios (Nivel B-J) ---');

  // 1. Obtener referencia de días
  // Invertimos el mapa para obtener el ID dado el string "Lunes" -> "LU"
  const diasDB = await prisma.dia.findMany();
  const diasRef = {};
  diasDB.forEach(d => {
    const key = Object.keys(diasMap).find(k => diasMap[k] === d.nombreDia);
    if(key) diasRef[key] = d.id;
  });

  for (const s of schedulesData) {
    // A. Buscar Materia
    const materia = await prisma.materia.findFirst({
      where: { codigoMateria: s.codigoMateria }
    });

    if (!materia) {
      console.warn(`[SKIP] Materia ${s.codigoMateria} no encontrada.`);
      continue;
    }

    // B. Gestionar Docente (Upsert)
    // Asumimos modelos 'Docente' y 'Persona' existen implícitamente
    let docenteId;
    const nombreCompleto = s.docente.trim();
    const parts = nombreCompleto.split(" ");
    let apellidos, nombres;
    
    // Lógica simple para separar apellidos y nombres
    if (parts.length >= 3) {
      apellidos = parts.slice(0, 2).join(" ");
      nombres = parts.slice(2).join(" ");
    } else {
      apellidos = parts[0];
      nombres = parts.slice(1).join(" ") || "Por Designar";
    }

    let docente = await prisma.docente.findFirst({
      where: { 
        persona: { 
          apellidos: { equals: apellidos, mode: 'insensitive' },
          nombres: { contains: nombres.split(" ")[0], mode: 'insensitive' }
        } 
      },
      include: { persona: true }
    });

    if (!docente) {
      // Crear persona y docente
      const nuevaPersona = await prisma.persona.create({
        data: { nombres, apellidos }
      });
      const nuevoDocente = await prisma.docente.create({
        data: { personaId: nuevaPersona.id, titulo: "Lic/Ing" }
      });
      docenteId = nuevoDocente.id;
    } else {
      docenteId = docente.id;
    }

    // C. Gestionar Grupo
    // Manejo de "6A" vs 6.
    const rawGroup = s.grupo.toString();
    const groupInt = parseInt(rawGroup.replace(/\D/g, '')) || 0; // "6A" -> 6
    const groupName = `Grupo ${rawGroup}`; // "Grupo 6A"

    // Buscamos por nombreGrupo para ser exactos ("Grupo 6" vs "Grupo 6A")
    let grupo = await prisma.grupo.findFirst({
      where: {
        materiaId: materia.id,
        nombreGrupo: groupName
      }
    });

    if (!grupo) {
      grupo = await prisma.grupo.create({
        data: {
          materiaId: materia.id,
          docenteId: docenteId,
          codigoGrupo: groupInt, // Campo Int según esquema
          nombreGrupo: groupName, // "Grupo 6A"
          cuposDisponible: 50,
          mesaDisponible: false
        }
      });
      console.log(` > ${groupName} creado para ${materia.nombreMateria}`);
    } else {
      console.log(` . ${groupName} encontrado para ${materia.nombreMateria}. Actualizando horarios...`);
    }

    // D. Crear Horarios
    for (const h of s.horarios) {
      // D.1 Aula
      let aula = await prisma.aula.findFirst({ where: { nombreAula: h.aula } });
      if (!aula) {
        aula = await prisma.aula.create({ data: { nombreAula: h.aula } });
      }

      // D.2 Hora
      const inicioDate = createTime(h.inicio);
      const finDate = createTime(h.fin);
      
      let hora = await prisma.hora.findFirst({
        where: { inicio: inicioDate, fin: finDate }
      });

      if (!hora) {
        hora = await prisma.hora.create({
          data: { inicio: inicioDate, fin: finDate }
        });
      }

      // D.3 Relación Horario (Evitar duplicados)
      const horarioExiste = await prisma.horario.findFirst({
        where: {
          grupoId: grupo.id,
          diaId: diasRef[h.dia],
          horaId: hora.id
        }
      });

      if (!horarioExiste) {
        await prisma.horario.create({
          data: {
            grupoId: grupo.id,
            diaId: diasRef[h.dia],
            horaId: hora.id,
            aulaId: aula.id
          }
        });
      }
    }
  }

  console.log('--- Seed Complementario Finalizado ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });