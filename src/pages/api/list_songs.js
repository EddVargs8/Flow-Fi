import prisma from "../../app/utils/prisma";
import { getSession } from "next-auth/react"; // Usa el sistema de autenticación

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '10mb', 
      },
      responseLimit: false,
    },
  };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    const userId = session.user.id; 
    const songs = await prisma.song.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las canciones" });
  }
}
