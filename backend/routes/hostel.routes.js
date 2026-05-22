const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/hostel.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/rooms',              ctrl.getAllRooms);
router.get('/rooms/:id',          ctrl.getRoomById);
router.post('/rooms',             requireRole('Admin'), ctrl.createRoom);
router.put('/rooms/:id',          requireRole('Admin'), ctrl.updateRoom);
router.delete('/rooms/:id',       requireRole('Admin'), ctrl.removeRoom);

router.get('/allocations',        requireRole('Admin'), ctrl.getAllAllocations);
router.post('/allocate',          requireRole('Admin'), ctrl.allocate);
router.put('/vacate/:id',         requireRole('Admin'), ctrl.vacate);
router.get('/student/:sid',                             ctrl.getStudentAllocation);

module.exports = router;
