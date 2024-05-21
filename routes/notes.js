const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// GET /api/notes - Read the db.json file and return all saved notes as JSON
router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      return res.status(500).send('Server Error');
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseErr) {
      console.error('Error parsing notes:', parseErr);
      res.status(500).send('Server Error');
    }
  });
});

// POST /api/notes - Receive a new note, save it to the db.json file, and return the new note
router.post('/', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Note must have a title and text' });
  }

  const newNote = { title, text, id: uuidv4() };

  fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      return res.status(500).send('Server Error');
    }

    try {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          console.error('Error writing notes:', err);
          return res.status(500).send('Server Error');
        }
        res.json(newNote);
      });
    } catch (parseErr) {
      console.error('Error parsing notes:', parseErr);
      res.status(500).send('Server Error');
    }
  });
});

// DELETE /api/notes/:id - Delete a note by id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
  
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading notes:', err);
        return res.status(500).send('Server Error');
      }
  
      try {
        let notes = JSON.parse(data);
  
        // Filter out the note with the specified id
        notes = notes.filter(note => note.id !== id);
  
        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes, null, 2), (err) => {
          if (err) {
            console.error('Error writing notes:', err);
            return res.status(500).send('Server Error');
          }
          res.status(200).json({ message: 'Note deleted successfully' });
        });
      } catch (parseErr) {
        console.error('Error parsing notes:', parseErr);
        res.status(500).send('Server Error');
      }
    });
  });

module.exports = router;
