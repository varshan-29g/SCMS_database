const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/library.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

// Books
router.get('/books',           ctrl.getAllBooks);
router.get('/books/search',    ctrl.searchBooks);
router.get('/books/:id',       ctrl.getBookById);
router.post('/books',          requireRole('Admin'), ctrl.addBook);
router.put('/books/:id',       requireRole('Admin'), ctrl.updateBook);
router.delete('/books/:id',    requireRole('Admin'), ctrl.removeBook);

// Issue / Return
router.get('/issued',          requireRole('Admin'), ctrl.getAllIssued);
router.get('/issued/overdue',  requireRole('Admin'), ctrl.getOverdue);
router.post('/issue',          requireRole('Admin'), ctrl.issueBook);
router.put('/return/:id',      requireRole('Admin'), ctrl.returnBook);
router.get('/history/:sid',                          ctrl.getMemberHistory);

module.exports = router;
