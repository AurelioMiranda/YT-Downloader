"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('highest');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem('theme');
    if (storedPreference) {
      setIsDarkMode(storedPreference === 'dark');
      document.documentElement.classList.toggle('dark', storedPreference === 'dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  const handleDownload = async () => {
    if (!url) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setDownloading(true);
    setError('');

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        body: JSON.stringify({ url, quality }),
      });

      if (!response.ok) {
        throw new Error('Failed to download video');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const contentDisposition = response.headers.get('Content-Disposition');
      const title = contentDisposition.split(';').find(part => part.trim().startsWith('title'));

      if (title) {
        link.setAttribute('download', `${title.split('=')[1].replaceAll("\"", "")}.mp4`);
      } else {
        link.setAttribute('download', 'video.mp4');
      }

      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download video');
    }

    setDownloading(false);
  };

  return (
    <div style={{ height: '100vh' }}>
      <nav className={`nav ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h1 className="text-3xl font-bold mb-4">YouTube Downloader</h1>
        <button
          onClick={handleToggleDarkMode}
          className="mb-4 px-4 py-2 border rounded-md bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
        >
          {isDarkMode ? (
            <img src="/sun.png" alt="Light Mode" width="20" height="20" />
          ) : (
            <img src="/moon.png" alt="Dark Mode" width="20" height="20"
            style={{filter: "invert(1)"}} />
          )}
        </button>
      </nav>
      <div className={`content-container flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mb-4 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="mb-4 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
        >
          <option value="highest">Highest Quality</option>
          <option value="lowest">Lowest Quality</option>
          <option value="highestaudio">Audio Only</option>
        </select>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-4 py-2 border rounded-md bg-blue-500 text-white dark:bg-blue-700"
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <footer>
        <p>
          &copy; 2024
          <a href="https://aurelio-miranda.netlify.app/" target="_blank" rel="noopener noreferrer"> Aurélio Miranda</a>
          . All rights reserved.
        </p>
        <div>
          <a href="https://www.instagram.com/l_aurelio_l/" target="_blank" rel="noopener noreferrer">
            <img maw={240} width="25" height="25"
              src="https://www.iconpacks.net/icons/2/free-instagram-logo-icon-3497-thumb.png"
              alt="Instagram" />
          </a>
          <a href="https://www.linkedin.com/in/mirandex/" target="_blank" rel="noopener noreferrer">
            <img maw={240} width="25" height="25"
              src="https://cdn-icons-png.flaticon.com/512/61/61109.png"
              alt="LinkedIn" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100008999912309" target="_blank" rel="noopener noreferrer">
            <img maw={240} width="25" height="25"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Facebook%2BIcon%2BBlack.png"
              alt="Facebook" />
          </a>
          <a href="mailto:aureliogaboleiro49@gmail.com">
            <img maw={240} width="25" height="auto"
              src="https://www.pngmart.com/files/15/Email-Symbol-PNG-Transparent.png"
              alt="Email" />
          </a>
        </div>
      </footer>
    </div>
  );
}
