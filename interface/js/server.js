const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');
const os = require('os');
const multer = require('multer');

const app = express();
const port = 3000;
// Configurare `multer` pentru salvarea fișierelor în folderul `storage`
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'storage'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

const mediaDirectory = path.join(__dirname, 'storage'); 

// Ruta pentru încărcarea fișierelor
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Fișierul nu a fost încărcat' });
    }
    
    res.json({ message: 'Fișier încărcat cu succes!', fileName: req.file.filename });
});


// Listare fișiere disponibile
app.get('/files', (req, res) => {
    fs.readdir(mediaDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Eroare la citirea fișierelor' });
        }

        const fileData = files.map(file => {
            const ext = path.extname(file).toLowerCase();
            let type = 'file';
            let previewPath = null;

            if (['.jpg', '.png', '.gif', '.jpeg'].includes(ext)) {
                type = 'image';
                previewPath = `/media/${file}`;
            } else if (['.mp4', '.webm', '.avi', '.mov'].includes(ext)) {
                type = 'video';
                previewPath = `/media/${file}`;
            }

            return { name: file, type, preview: previewPath };
        });

        res.json(fileData);
    });
});

// Servirea fișierelor media
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// Conectare SSH
app.post('/connect', (req, res) => {
    const { serverIP, username, password } = req.body;

    const conn = new Client();
    conn.on('ready', () => {
        console.log(`Autentificare reușită pe ${serverIP}`);
        res.json({ success: true });
        conn.end();
    }).on('error', (err) => {
        console.error("Eroare SSH:", err);
        res.json({ success: false, error: err.message });
    }).connect({
        host: serverIP,
        username: username,
        password: password
    });
});

// Obține memoria utilizată și disponibilă
app.get('/memory', (req, res) => {
    const total = os.totalmem() / (1024 * 1024 * 1024); 
    const free = os.freemem() / (1024 * 1024 * 1024);
    const used = total - free;

    res.json({ used: used.toFixed(2), free: free.toFixed(2) });
});

// Calculare tipuri de fișiere
app.get('/filetypes', (req, res) => {
    fs.readdir(mediaDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Eroare la citirea fișierelor' });
        }

        const fileTypes = {};

        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            if (!fileTypes[ext]) fileTypes[ext] = 0;
            fileTypes[ext] += fs.statSync(path.join(mediaDirectory, file)).size / (1024 * 1024);
        });

        res.json(fileTypes);
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Serverul rulează pe http://localhost:${port}`);
});