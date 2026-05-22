const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/department.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getById);
router.post('/',      requireRole('Admin'), ctrl.create);
router.put('/:id',    requireRole('Admin'), ctrl.update);
router.delete('/:id', requireRole('Admin'), ctrl.remove);

module.exports = router;
