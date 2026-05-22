const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/notification.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/',           ctrl.getAll);
router.get('/unread',     ctrl.getUnread);
router.post('/',          requireRole('Admin'), ctrl.create);
router.put('/:id/read',                         ctrl.markRead);
router.put('/read-all',                          ctrl.markAllRead);
router.delete('/:id',     requireRole('Admin'), ctrl.remove);

module.exports = router;
