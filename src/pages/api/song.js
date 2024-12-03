// pages/api/songs.js
import prisma from "../../app/utils/prisma";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', 
    },
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, duration, userId, blobData } = req.body;

      const song = await prisma.song.create({
        data: {
          title,
          duration,
          userId,
          blobData: Buffer.from(blobData), 
        },
      });

      res.status(200).json({ success: true, song });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al guardar la canción' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
