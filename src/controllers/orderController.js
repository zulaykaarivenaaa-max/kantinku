const db = require('../config/db');

// 1. Buat Pesanan Baru (Checkout)
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { customer_name, order_type, table_number, payment_method, items, total_price } = req.body;
    const order_code = 'KNT-' + Date.now().toString().slice(-6);

    // Insert ke tabel orders
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_code, customer_name, order_type, table_number, payment_method, total_price, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      [order_code, customer_name, order_type, table_number || '-', payment_method, total_price]
    );

    const orderId = orderResult.insertId;

    // Insert ke tabel order_items & kurangi stok menu
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, item.menu_id, item.quantity, item.price]
      );

      await connection.query(
        `UPDATE menus SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [item.quantity, item.menu_id, item.quantity]
      );
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      data: { order_code, order_id: orderId }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// 2. Ambil Semua Pesanan (Untuk Antrean Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`SELECT * FROM orders ORDER BY created_at DESC`);

    // Ambil detail items untuk tiap pesanan
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, m.name AS menu_name 
         FROM order_items oi 
         JOIN menus m ON oi.menu_id = m.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Status Pesanan (PENDING -> DIPROSES -> SIAP -> SELESAI / BATAL)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
    res.json({ success: true, message: `Status pesanan berhasil diubah menjadi ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};