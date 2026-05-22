const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/course.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/',             ctrl.getAll);
router.get('/:id',          ctrl.getById);
router.get('/:id/subjects', ctrl.getSubjects);
router.post('/',            requireRole('Admin'), ctrl.create);
router.put('/:id',          requireRole('Admin'), ctrl.update);
router.delete('/:id',       requireRole('Admin'), ctrl.remove);

// Subjects sub-routes
router.post('/subjects',           requireRole('Admin'),            ctrl.createSubject);
router.put('/subjects/:sid',       requireRole('Admin'),            ctrl.updateSubject);
router.delete('/subjects/:sid',    requireRole('Admin'),            ctrl.removeSubject);

module.exports = router;
