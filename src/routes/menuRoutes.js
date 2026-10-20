const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const upload = require('../middleware/upload');

router.get('/', menuController.getAllMenus);
router.post('/', upload.single('image'), menuController.createMenu);
router.put('/:id', upload.single('image'), menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router;