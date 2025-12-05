-- CreateTable
CREATE TABLE "persona" (
    "id_persona" SERIAL NOT NULL,
    "nombres" VARCHAR(100),
    "apellidos" VARCHAR(100),
    "fecha_nacimiento" DATE,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id_persona")
);

-- CreateTable
CREATE TABLE "docente" (
    "id_docente" SERIAL NOT NULL,
    "id_persona" INTEGER,
    "titulo" VARCHAR(30),

    CONSTRAINT "docente_pkey" PRIMARY KEY ("id_docente")
);

-- CreateTable
CREATE TABLE "estudiante" (
    "id_estudiante" SERIAL NOT NULL,
    "id_persona" INTEGER,
    "codigo_sis" INTEGER,
    "contrasena" VARCHAR(255),

    CONSTRAINT "estudiante_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "facultad" (
    "id_facultad" SERIAL NOT NULL,
    "nombre_facultad" TEXT,

    CONSTRAINT "facultad_pkey" PRIMARY KEY ("id_facultad")
);

-- CreateTable
CREATE TABLE "carrera" (
    "id_carrera" SERIAL NOT NULL,
    "id_facultad" INTEGER,
    "codigo_carrera" INTEGER,
    "nombre_carrera" TEXT,

    CONSTRAINT "carrera_pkey" PRIMARY KEY ("id_carrera")
);

-- CreateTable
CREATE TABLE "kardex" (
    "id_kardex" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_carrera" INTEGER,

    CONSTRAINT "kardex_pkey" PRIMARY KEY ("id_kardex")
);

-- CreateTable
CREATE TABLE "carrera_materia" (
    "id_carr_mat" SERIAL NOT NULL,
    "id_carrera" INTEGER,
    "id_materia" INTEGER,

    CONSTRAINT "carrera_materia_pkey" PRIMARY KEY ("id_carr_mat")
);

-- CreateTable
CREATE TABLE "materia" (
    "id_materia" SERIAL NOT NULL,
    "mat_id_materia" INTEGER,
    "codigo_materia" INTEGER,
    "nombre_materia" VARCHAR(50),
    "nivel" TEXT,
    "tipo" TEXT,
    "materia_prerequisito_codigo" VARCHAR(10),

    CONSTRAINT "materia_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "grupo" (
    "id_grupo" SERIAL NOT NULL,
    "id_materia" INTEGER,
    "id_docente" INTEGER,
    "codigo_grupo" INTEGER,
    "nombre_grupo" TEXT,
    "cupos_disponible" INTEGER,
    "mesa_disponible" BOOLEAN,

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "horario" (
    "id_horario" SERIAL NOT NULL,
    "id_grupo" INTEGER,
    "id_dia" INTEGER,
    "id_hora" INTEGER,
    "id_aula" INTEGER,

    CONSTRAINT "horario_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "historico_notas" (
    "id_historico_notas" SERIAL NOT NULL,
    "id_kardex" INTEGER,
    "id_grupo" INTEGER,
    "gestion_nota" VARCHAR(10),
    "modalidad" VARCHAR(20),
    "nota" INTEGER,

    CONSTRAINT "historico_notas_pkey" PRIMARY KEY ("id_historico_notas")
);

-- CreateTable
CREATE TABLE "inscripcion" (
    "id_inscripcion" SERIAL NOT NULL,
    "id_estudiante" INTEGER,
    "id_grupo" INTEGER,
    "gestion_ins" CHAR(10),

    CONSTRAINT "inscripcion_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "aula" (
    "id_aula" SERIAL NOT NULL,
    "nombre_aula" TEXT,

    CONSTRAINT "aula_pkey" PRIMARY KEY ("id_aula")
);

-- CreateTable
CREATE TABLE "dia" (
    "id_dia" SERIAL NOT NULL,
    "nombre_dia" TEXT,

    CONSTRAINT "dia_pkey" PRIMARY KEY ("id_dia")
);

-- CreateTable
CREATE TABLE "hora" (
    "id_hora" SERIAL NOT NULL,
    "inicio" TIME,
    "fin" TIME,

    CONSTRAINT "hora_pkey" PRIMARY KEY ("id_hora")
);

-- AddForeignKey
ALTER TABLE "docente" ADD CONSTRAINT "docente_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante" ADD CONSTRAINT "estudiante_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "persona"("id_persona") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrera" ADD CONSTRAINT "carrera_id_facultad_fkey" FOREIGN KEY ("id_facultad") REFERENCES "facultad"("id_facultad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex" ADD CONSTRAINT "kardex_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex" ADD CONSTRAINT "kardex_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "carrera"("id_carrera") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrera_materia" ADD CONSTRAINT "carrera_materia_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "carrera"("id_carrera") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrera_materia" ADD CONSTRAINT "carrera_materia_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materia"("id_materia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materia" ADD CONSTRAINT "materia_mat_id_materia_fkey" FOREIGN KEY ("mat_id_materia") REFERENCES "materia"("id_materia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materia"("id_materia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "docente"("id_docente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id_grupo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_id_dia_fkey" FOREIGN KEY ("id_dia") REFERENCES "dia"("id_dia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_id_hora_fkey" FOREIGN KEY ("id_hora") REFERENCES "hora"("id_hora") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "aula"("id_aula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_notas" ADD CONSTRAINT "historico_notas_id_kardex_fkey" FOREIGN KEY ("id_kardex") REFERENCES "kardex"("id_kardex") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_notas" ADD CONSTRAINT "historico_notas_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id_grupo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiante"("id_estudiante") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupo"("id_grupo") ON DELETE SET NULL ON UPDATE CASCADE;
