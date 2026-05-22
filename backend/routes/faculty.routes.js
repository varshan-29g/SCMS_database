const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/faculty.controller');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload   = require('../middleware/upload');

router.use(verifyToken);

router.get('/',              requireRole('Admin'),                    ctrl.getAll);
router.get('/stats',         requireRole('Admin'),                    ctrl.getStats);
router.get('/:id',                                                    ctrl.getById);
router.post('/',             requireRole('Admin'),                    ctrl.create);
router.put('/:id',           requireRole('Admin', 'Faculty'),        ctrl.update);
router.delete('/:id',        requireRole('Admin'),                    ctrl.remove);
router.put('/:id/avatar',    upload.single('avatar'),                 ctrl.uploadAvatar);
router.get('/:id/subjects',                                           ctrl.getSubjects);
router.post('/leave',        requireRole('Faculty'),                  ctrl.applyLeave);
router.get('/leave/all',     requireRole('Admin'),                    ctrl.getAllLeaves);
router.put('/leave/:leaveId/status', requireRole('Admin'),            ctrl.updateLeaveStatus);
router.post('/:id/upload-material', upload.single('material'),        ctrl.uploadMaterial);

module.exports = router;
