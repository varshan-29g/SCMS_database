const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/exam.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/',                        ctrl.getAll);
router.get('/upcoming',                ctrl.getUpcoming);
router.get('/:id',                     ctrl.getById);
router.post('/',         requireRole('Admin', 'Faculty'), ctrl.create);
router.put('/:id',       requireRole('Admin', 'Faculty'), ctrl.update);
router.delete('/:id',    requireRole('Admin'),             ctrl.remove);

// Results
router.get('/:id/results',             ctrl.getResults);
router.post('/:id/results',  requireRole('Admin', 'Faculty'), ctrl.addResult);
router.put('/results/:rid',  requireRole('Admin', 'Faculty'), ctrl.updateResult);
router.get('/results/student/:sid',    ctrl.getStudentResults);
router.get('/results/ranklist/:examId',ctrl.getRanklist);

module.exports = router;
