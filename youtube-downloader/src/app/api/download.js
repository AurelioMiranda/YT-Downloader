import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { url, quality } = req.body;

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
      const videoInfo = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(videoInfo.formats, { quality });

      const downloadPath = path.join(process.cwd(), 'public', 'video.mp4');
      const stream = ytdl(url, { format })
        .pipe(fs.createWriteStream(downloadPath));

      stream.on('finish', () => {
        res.status(200).json({ downloadUrl: '/video.mp4' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to download video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
