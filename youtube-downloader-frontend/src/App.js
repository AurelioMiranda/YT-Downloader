import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('best');
  const [downloadLink, setDownloadLink] = useState('');

  const handleDownload = async () => {
    try {
      const response = await axios.post('/download', { url, quality });
      setDownloadLink(response.data.downloadLink);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  return (
    <div className="App">
      <h1>YouTube Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <select value={quality} onChange={(e) => setQuality(e.target.value)}>
        <option value="best">Best</option>
        <option value="720p">720p</option>
        <option value="480p">480p</option>
        <option value="audio">Audio Only</option>
      </select>
      <button onClick={handleDownload}>Download</button>
      {downloadLink && (
        <a href={downloadLink} download>Download Link</a>
      )}
    </div>
  );
}

export default App;
