const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const studiosFilePath = path.join(__dirname, '../../server/anime.json');

// Read studio data
const readStudios = () => {
    const studioData = fs.readFileSync(studiosFilePath, 'utf8');
    return JSON.parse(studioData);
};

// Write studio data
const writeStudios = (studioData) => {
    fs.writeFileSync(studiosFilePath, JSON.stringify(studioData, null, 2), 'utf8');
};

// Create studio
router.post('/', (req, res) => {
    try {
        const data = readStudios();

        const newStudio = {
            id: data.studios.length + 1,
            name: req.body.name,
        };

        data.studios.push(newStudio);
        writeStudios(data);

        res.status(201).json({ message: 'Studio created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all studios
router.get('/', (req, res) => {
    try {
        const data = readStudios();
        res.json(data.studios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get studio by ID
router.get('/:id', (req, res) => {
    try {
        const data = readStudios();
        const studioIndex = data.studios.findIndex(studio => studio.id === parseInt(req.params.id, 10));

        if (studioIndex === -1) {
            return res.status(404).json({ message: 'Studio not found' });
        }
        res.json(data.studios[studioIndex]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update studio
router.put('/:id', (req, res) => {
    const data = readStudios();
    const studioIndex = data.studios.findIndex(studio => studio.id === parseInt(req.params.id, 10));

    if (studioIndex === -1) {
        return res.status(404).json({ message: 'Studio not found' });
    }

    data.studios[studioIndex].name = req.body.name || data.studios[studioIndex].name;

    writeStudios(data);

    return res.status(200).json({ message: 'Studio updated', studio: data.studios[studioIndex] });
});

// Delete studio by ID
router.delete('/:id', (req, res) => {
    try {
        const data = readStudios();
        const studioIndex = data.studios.findIndex(studio => studio.id === parseInt(req.params.id, 10));

        if (studioIndex === -1) {
            return res.status(404).json({ message: 'Studio not found' });
        }

        data.studios.splice(studioIndex, 1);
        writeStudios(data);

        res.json({ message: 'Studio successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
