const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const directorFilePath = path.join(__dirname, '../../server/anime.json');

// Read directors data from file
const readDirectors = () => {
    const directorData = fs.readFileSync(directorFilePath, "utf8");
    return JSON.parse(directorData);
};

// Write directors data to file
const writeDirectors = (data) => {
    fs.writeFileSync(directorFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Create a new director
router.post('/', (req, res) => {
    try {
        const data = readDirectors();

        const newDirector = {
            id: data.directors.length + 1,  // Generate a new ID
            name: req.body.name,
        };

        data.directors.push(newDirector);
        writeDirectors(data);

        res.status(201).json({ message: 'Director created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get all directors
router.get('/', (req, res) => {
    try {
        const data = readDirectors();
        res.json(data.directors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get a director by ID
router.get('/:id', (req, res) => {
    try {
        const data = readDirectors();
        const director = data.directors.find(d => d.id === parseInt(req.params.id, 10));

        if (!director) {
            return res.status(404).send('Director not found');
        }

        res.json(director);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update a director by ID

router.put('/:id', (req, res) => {
    try{
        const data = readDirectors();
        const directorIndex = data.directors.findIndex(d => d.id === parseInt(req.params.id, 10));

        if(directorIndex != 1){
            return res.status(404).json({ message: 'Director not found' });
        }

        const updateDirector = {
            ...data.directors,
            name: req.body.name || data.directors[directorIndex].name,
        }
        data.directors[directorIndex] = updateDirector;
        writeDirectors(data);

        res.status(200).json({ message: 'Director', director: updateDirector})


    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
})

// Delete a director by ID

router.delete('/:id', (req, res) => {
    try{
        const data = readDirectors();
        const directorIndex = data.directors.findIndex(d => d.id === parseInt(req.params.id, 10));

        if(directorIndex == -1){
            return res.status(404).json({ message: 'Director not found' });
        }

        data.directors.splice(directorIndex, 1)
        writeDirectors(data);
        res.status(200).json({ message: 'Director deleted successfully', director: directorIndex})
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
})
module.exports = router;
