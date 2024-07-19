const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const characterFilePath = path.join(__dirname, '../../server/anime.json');

// Read characters data from file
const readCharacters = () => {
    const characterData = fs.readFileSync(characterFilePath, 'utf8');
    return JSON.parse(characterData);
};

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
        return res.status(201).json({ message: 'Character created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get all characters
router.get('/', (req, res) => {
    try {
        const data = readCharacters();
        res.json(data.characters);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// get character by id

router.get('/:id', (req, res) => {
    try{
        const data = readCharacters()
        const singleCharacter = data.characters.find((c) => c.id === parseInt(req.params.id, 10))

        if (!singleCharacter) {
            return res.status(404).json({ message: 'Character not found' });
        }
        res.json(singleCharacter);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
})

// Update a character by ID
router.put('/:id', (req, res) => {
    try {
        const data = readCharacters();
        const characterIndex = data.characters.findIndex((c) => c.id === parseInt(req.params.id, 10));

        if (characterIndex === -1) {
            return res.status(404).json({ message: 'Character not found' });
        }

        const updatedCharacter = {
            ...data.characters[characterIndex],
            name: req.body.name || data.characters[characterIndex].name,
            animeId: req.body.animeId || data.characters[characterIndex].animeId
        };

        data.characters[characterIndex] = updatedCharacter;
        writeCharacter(data);
        res.json({ message: 'Character updated', anime: updatedCharacter});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Delete a character by ID

router.delete('/:id', (req, res) => {
    try {
        const data = readCharacters();
        const characterIndex = data.characters.findIndex((character) => character.id === parseInt(req.params.id, 10));

        if (characterIndex === -1) {
            return res.status(404).json({ message: 'Character not found' });
        }
        const deletedCharacter = data.characters.splice(characterIndex, 1);

        writeCharacter(data);

        res.json({ message: 'Character deleted', character: deletedCharacter });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;
