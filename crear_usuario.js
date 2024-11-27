import prisma from './src/app/utils/prisma.js';

async function crearUsuario() {
  const nuevoUsuario = await prisma.user.create({
    data: {
      email: 'eddvargs8@gmail.com',
      password: 'qwerty123', // Será encriptado automáticamente
      username: 'eddvargs8',
    },
  });

  console.log('Usuario creado:', nuevoUsuario);
}

crearUsuario().catch((e) => {
  console.error('Error al crear usuario:', e);
  process.exit(1);
});
