const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/timetable.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/',                         ctrl.getAll);
router.get('/department/:deptId',       ctrl.getByDept);
router.get('/faculty/:fid',             ctrl.getByFaculty);
router.get('/student/:sid',             ctrl.getByStudent);
router.post('/',     requireRole('Admin'), ctrl.create);
router.put('/:id',   requireRole('Admin'), ctrl.update);
router.delete('/:id',requireRole('Admin'), ctrl.remove);

module.exports = router;
