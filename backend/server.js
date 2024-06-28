const express = require('express');
const youtubedl = require('youtube-dl-exec');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

app.post('/download', (req, res) => {
    const { url, quality } = req.body;
    const output = `downloads/%(title)s.%(ext)s`;
    const options = quality === 'audio' ? { extractAudio: true, audioFormat: 'mp3', output } : { format: quality, output };

    youtubedl(url, options)
        .then(output => {
            console.log(output);
            const videoPath = path.join(__dirname, 'downloads', `${output.title}.${output.ext}`);
            res.json({ downloadLink: videoPath });
        })
        .catch(err => {
            console.error(`Error: ${err.message}`);
            res.status(500).send('Error downloading video');
        });
});

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
