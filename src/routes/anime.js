const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const animeFilePath = path.join(__dirname, '../../server/anime.json');

const readAnime = () => {
    const animeData = fs.readFileSync(animeFilePath, "utf8");
    return JSON.parse(animeData);
}

// Escribir datos de anime
const writeAnime = (anime) => {
    fs.writeFileSync(animeFilePath, JSON.stringify(anime, null, 2),"utf8");
}

// create anime
router.post('/', (req, res) => {
  
        const anime = readAnime();
        const studioId = req.body.studioId;
        const studioExists = anime.studios.find(studio => studio.id === studioId);

        if (!studioExists) {
            return res.status(400).json({ message: 'Invalid studio ID' });
        }

        const newAnime = {
            id: anime.animes.length + 1,
            title: req.body.title,
            genre: req.body.genre,
            studioId: studioId
        };

        anime.animes.push(newAnime);
        writeAnime(anime);

        res.status(201).json({ message: 'Anime successfully created' });
    } 
);
//show all animes
router.get('/', (req, res) => {
    try {
        const anime = readAnime();
        res.json(anime.animes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//update anime by id
router.put('/:id', (req, res) => {
    try {
        const anime = readAnime();
        const animeIndex = anime.animes.findIndex((a) => a.id === parseInt(req.params.id, 10));

        if (animeIndex === -1) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        const updatedAnime = {
            ...anime.animes[animeIndex],
            title: req.body.title,
            genre: req.body.genre,
        };

        anime.animes[animeIndex] = updatedAnime;
        writeAnime(anime);

        res.json({ message: 'Update successfully', anime: updatedAnime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Delete anime
router.delete('/:id', (req, res) => {
    const animeData = readAnime();
    const animes = animeData.animes;
    const updatedAnimes = animes.filter(anime => anime.id !== req.params.id);

        if (updatedAnimes.length === animes.length) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        animeData.animes = updatedAnimes;
        writeAnime(animeData);

        res.json({ message: 'Anime successfully deleted' });
    
});

//get anime by id
router.get("/:id", (req, res) => {
    try {
        const anime = readAnime();
        console.log(anime)
        const singleAnime = anime.animes.find((a) => a.id === parseInt(req.params.id, 10));

        if (!singleAnime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        res.json(singleAnime);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//create studio
router.post('/studio', (req, res) => {
    try {
        const anime = readAnime();

        const newStudio = {
            id: anime.studios.length + 1,
            name: req.body.name,
        };

        anime.studios.push(newStudio);
        writeAnime(anime);

        res.status(201).json(newStudio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/studio', (req, res) => {
    const data = readAnime()
    res.json(data.studios)
    
});




module.exports = router;
