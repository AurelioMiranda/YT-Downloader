import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('highest');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setDownloading(true);
    setError('');

    try {
      const response = await axios.post('/api/download', { url, quality });
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.setAttribute('download', 'video.mp4');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download video');
    }

    setDownloading(false);
  };

  return (
    <div>
      <h1>YouTube Downloader</h1>
      <input 
        type="text" 
        placeholder="Enter YouTube URL" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
      />
      <select 
        value={quality} 
        onChange={(e) => setQuality(e.target.value)}
      >
        <option value="highest">Highest Quality</option>
        <option value="lowest">Lowest Quality</option>
        <option value="highestaudio">Audio Only</option>
      </select>
      <button onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Downloading...' : 'Download'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
