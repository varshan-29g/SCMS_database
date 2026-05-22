const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/attendance.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/',                     requireRole('Admin', 'Faculty'),       ctrl.getAll);
router.get('/report',               requireRole('Admin', 'Faculty'),       ctrl.getReport);
router.get('/student/:studentId',                                           ctrl.getByStudent);
router.get('/subject/:subjectId',   requireRole('Admin', 'Faculty'),       ctrl.getBySubject);
router.post('/mark',                requireRole('Faculty', 'Admin'),        ctrl.mark);
router.post('/bulk-mark',           requireRole('Faculty', 'Admin'),        ctrl.bulkMark);
router.put('/:id',                  requireRole('Faculty', 'Admin'),        ctrl.update);
router.get('/low-attendance',       requireRole('Admin', 'Faculty'),        ctrl.getLowAttendance);
router.get('/analytics',            requireRole('Admin', 'Faculty'),        ctrl.getAnalytics);

module.exports = router;
