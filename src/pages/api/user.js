// pages/api/user.js
import { getSession } from "next-auth/react";
import prisma from "../../app/utils/prisma";


export default async function handler(req, res) {
  // Verifica la sesión activa
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    // Busca al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { username: true, bio: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error en el endpoint de usuario:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
}
