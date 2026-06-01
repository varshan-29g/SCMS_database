const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/student.controller');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload   = require('../middleware/upload');

router.use(verifyToken);

router.get('/',          requireRole('Admin', 'Faculty'), ctrl.getAll);
router.get('/stats',     requireRole('Admin'),            ctrl.getStats);
router.get('/:id',                                        ctrl.getById);
router.post('/',         requireRole('Admin'),            ctrl.create);
router.put('/:id',       requireRole('Admin', 'Faculty', 'Student'), ctrl.update);
router.delete('/:id',    requireRole('Admin'),            ctrl.remove);
router.put('/:id/avatar',upload.single('avatar'),         ctrl.uploadAvatar);

module.exports = router;
