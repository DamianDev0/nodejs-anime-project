const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const characterFilePath = path.join(__dirname, '../../server/anime.json');

// Read characters data from file
const readCharacters = () => {
    const characterData = fs.readFileSync(characterFilePath, 'utf8');
    return JSON.parse(characterData);
}

// Write characters data to file
const writeCharacter = (data) => {
    fs.writeFileSync(characterFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Create a new character
router.post('/', (req, res) => {
    try {
        const data = readCharacters();
        const animeId = req.body.animeId;
        const animeExists = data.animes.find((anime) => anime.id === animeId);

        // Check if the anime ID is valid
        if (!animeExists) {
            return res.status(400).json({ message: 'Invalid anime ID' });
        }

        // Create a new character
        const newCharacter = {
            id: data.characters.length + 1,  // Generate a new ID
            name: req.body.name,
            animeId: animeId
        };

        // Add the new character to the data and write to file
        data.characters.push(newCharacter);
        writeCharacter(data);

        // Send a success response
        res.status(201).json({ message: 'Character created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
