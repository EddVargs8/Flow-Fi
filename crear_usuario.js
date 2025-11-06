import prisma from './src/app/utils/prisma.js';

async function crearUsuario() {
  const nuevoUsuario = await prisma.user.create({
    data: {
      email: '',
      password: '', // Será encriptado automáticamente
      username: '',
    },
  });

  console.log('Usuario creado:', nuevoUsuario);
}

crearUsuario().catch((e) => {
  console.error('Error al crear usuario:', e);
  process.exit(1);
});
