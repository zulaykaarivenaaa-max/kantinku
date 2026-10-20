const db = require('../config/db');

// 1. Get All Menus (Ambil Semua Menu)
exports.getAllMenus = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, c.name AS category_name 
      FROM menus m 
      JOIN categories c ON m.category_id = c.id 
      ORDER BY m.id ASC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Menu (Tambah Menu Baru + Upload Gambar)
exports.createMenu = async (req, res) => {
  try {
    const { name, category_id, price, stock, description } = req.body;
    
    // Jika ada file di-upload gunakan path-nya, jika tidak gunakan default
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-food.jpg';

    const [result] = await db.query(
      `INSERT INTO menus (name, category_id, price, stock, description, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, category_id, price, stock, description, imageUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Menu berhasil ditambahkan!',
      data: { id: result.insertId, name, price, imageUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Menu (Edit Menu & Gambar)
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, price, stock, description } = req.body;

    let query = `UPDATE menus SET name=?, category_id=?, price=?, stock=?, description=?`;
    let params = [name, category_id, price, stock, description];

    if (req.file) {
      query += `, image_url=?`;
      params.push(`/uploads/${req.file.filename}`);
    }

    query += ` WHERE id=?`;
    params.push(id);

    await db.query(query, params);
    res.json({ success: true, message: 'Menu berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Delete Menu (Hapus Menu)
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM menus WHERE id=?`, [id]);
    res.json({ success: true, message: 'Menu berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};