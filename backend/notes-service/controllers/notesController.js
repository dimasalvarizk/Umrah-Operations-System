const NotesService = require('../services/notesService');

class NotesController {
  static async getNotes(req, res) {
    try {
      const { search, category, priority, status } = req.query;
      const notes = await NotesService.listNotes({ search, category, priority, status });
      return res.status(200).json({
        success: true,
        message: 'Notes fetched successfully',
        data: {
          notes,
          total: notes.length,
        },
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch notes',
        error: error.message,
      });
    }
  }

  static async getNoteById(req, res) {
    try {
      const { id } = req.params;
      const note = await NotesService.getNoteById(id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Note retrieved successfully',
        data: note,
      });
    } catch (error) {
      console.error('Error fetching note by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch note details',
        error: error.message,
      });
    }
  }

  static async createNote(req, res) {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'title and content are required',
        });
      }

      const note = await NotesService.createNote(req.body);
      return res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: note,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create note',
        error: error.message,
      });
    }
  }

  static async updateNote(req, res) {
    try {
      const { id } = req.params;
      const note = await NotesService.updateNote(id, req.body);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found for update',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: note,
      });
    } catch (error) {
      console.error('Error updating note:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update note',
        error: error.message,
      });
    }
  }

  static async togglePin(req, res) {
    try {
      const { id } = req.params;
      const note = await NotesService.togglePin(id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Note pin status toggled successfully',
        data: note,
      });
    } catch (error) {
      console.error('Error toggling pin on note:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to toggle pin',
        error: error.message,
      });
    }
  }

  static async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const deleted = await NotesService.deleteNote(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Note not found for deletion',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Note deleted successfully',
        data: null,
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete note',
        error: error.message,
      });
    }
  }
}

module.exports = NotesController;
