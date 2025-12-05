import prisma from '../db.js';
import bcrypt from 'bcrypt'; 


async function crearEstudianteConPersona() {
  // 1. Encriptar la contraseña (se asume un factor de coste de 10)
  const contrasenaEncriptada = await bcrypt.hash('Passw0rd!', 10);

  try {
    const nuevoEstudiante = await prisma.estudiante.create({
      data: {
        // Datos específicos del Estudiante
        codigoSis: 201906007,
        contrasena: contrasenaEncriptada, // Contraseña ya encriptada
        
        // Escritura anidada para crear y conectar la Persona
        persona: {
          create: {
            // Datos de la Persona (asumiendo un modelo 'Persona' con estos campos)
            nombres: 'Rolando',
            apellidos: 'Mercado Rojas',
            fechaNacimiento: new Date('2000-12-20'), // Formato Date de JavaScript/TypeScript
          },
        },
      },
      // Opcional: Incluir la persona creada en el resultado
      include: {
        persona: true, 
      },
    });

    console.log('✅ Estudiante y Persona creados con éxito:', nuevoEstudiante);
  } catch (error) {
    console.error('❌ Error al crear Estudiante y Persona:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Llama a la función para ejecutar la operación
crearEstudianteConPersona();