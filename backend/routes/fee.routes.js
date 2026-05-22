const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/fee.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/',              requireRole('Admin'),          ctrl.getAll);
router.get('/pending',       requireRole('Admin'),          ctrl.getPending);
router.get('/stats',         requireRole('Admin'),          ctrl.getStats);
router.get('/student/:sid',                                 ctrl.getByStudent);
router.post('/',             requireRole('Admin'),          ctrl.create);
router.put('/:id',           requireRole('Admin'),          ctrl.update);
router.put('/:id/pay',       requireRole('Admin'),          ctrl.markPaid);
router.delete('/:id',        requireRole('Admin'),          ctrl.remove);

module.exports = router;
