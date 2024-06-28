import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  console.log("Handler called");
  const { url, quality } = await req.json();

  if (!ytdl.validateURL(url)) {
    return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log("Starting download");
    const videoInfo = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(videoInfo.formats, { quality });

    const downloadPath = path.join(process.cwd(), 'public', 'video.mp4');
    const stream = ytdl(url, { format }).pipe(fs.createWriteStream(downloadPath));

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log("Download finished");
        resolve(
          new Response(
            JSON.stringify({ downloadUrl: '/video.mp4' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      });

      stream.on('error', (error) => {
        console.log("Download error:", error);
        reject(
          new Response(
            JSON.stringify({ error: 'Failed to download video' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      });
    });
  } catch (error) {
    console.log("Download error:", error);
    return new Response(JSON.stringify({ error: 'Failed to download video' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
