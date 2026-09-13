const express = require('express');
const router = express.Router();
const NotesController = require('../controllers/notesController');

router.get('/', NotesController.getNotes);
router.post('/', NotesController.createNote);
router.get('/:id', NotesController.getNoteById);
router.put('/:id', NotesController.updateNote);
router.patch('/:id/pin', NotesController.togglePin);
router.delete('/:id', NotesController.deleteNote);

module.exports = router;
