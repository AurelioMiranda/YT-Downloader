import ytdl from 'ytdl-core';

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

    const stream = ytdl(url, { format });

    return new Response(stream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="video.mp4"',
      },
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
