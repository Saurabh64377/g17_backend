const db = require("../../config/db");

exports.createShop = async (req, res) => {
  try {
    const { name, subname, icon, bg, color } = req.body;

    // validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Shop name is required",
      });
    }

    if (!icon) {
      return res.status(400).json({
        success: false,
        message: "Shop icon is required",
      });
    }

    const query = `
      INSERT INTO shops (
        name,
        subname,
        icon,
        bg,
        color
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      name,
      subname || null,
      icon,
      bg || null,
      color || null,
    ]);

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: {
        id: result.insertId,
        name,
        subname,
        icon,
        bg,
        color,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllShops = async (req, res) => {
  try {
    const query = `
      SELECT 
        shops.id,
        shops.name,
        shops.subname,
        shops.icon,
        shops.bg,
        shops.color,
        shops.created_at,
        COUNT(categories.id) AS total_categories
      FROM shops
      LEFT JOIN categories 
        ON shops.id = categories.shop_id
      GROUP BY shops.id
      ORDER BY shops.id DESC
    `;

    const [rows] = await db.query(query);

    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getSingleShop = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT * FROM shops
      WHERE id = ?
    `;

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, subname, icon, bg, color } = req.body;

    const [rows] = await db.query(`SELECT * FROM shops WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const oldShop = rows[0];

    const query = `
      UPDATE shops
      SET
        name = ?,
        subname = ?,
        icon = ?,
        bg = ?,
        color = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(query, [
      name || oldShop.name,

      subname !== undefined ? subname : oldShop.subname,

      icon || oldShop.icon,

      bg !== undefined ? bg : oldShop.bg,

      color !== undefined ? color : oldShop.color,

      id,
    ]);

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`SELECT * FROM shops WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    await db.query(`DELETE FROM shops WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};