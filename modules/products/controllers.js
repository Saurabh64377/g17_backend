const db = require("../../config/db");
exports.createProduct = async (req, res) => {
  try {
    const { shop_id, name, icon, bg, color, description } = req.body;

    // validation
    if (!shop_id) {
      return res.status(400).json({
        success: false,
        message: "shop_id is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const query = `
      INSERT INTO products (
        shop_id,
        name,
        icon,
        bg,
        color,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      shop_id,
      name,
      icon || null,
      bg || null,
      color || null,
      description || null,
    ]);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        id: result.insertId,
        shop_id,
        name,
        icon,
        bg,
        color,
        description,
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

exports.getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
        products.id,
        products.shop_id,
        products.name,
        products.icon,
        products.bg,
        products.color,
        products.description,
        products.created_at,
        products.updated_at,
        shops.name AS shop_name
      FROM products
      JOIN shops ON products.shop_id = shops.id
      ORDER BY products.id DESC
    `;

    const [rows] = await db.query(query);

    return res.status(200).json({
      success: true,
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

exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { shop_id, name, icon, bg, color, description } = req.body;

    const [rows] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const old = rows[0];

    const query = `
      UPDATE products
      SET
        shop_id = ?,
        name = ?,
        icon = ?,
        bg = ?,
        color = ?,
        description = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(query, [
      shop_id || old.shop_id,
      name || old.name,
      icon || old.icon,
      bg || old.bg,
      color || old.color,
      description || old.description,
      id,
    ]);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await db.query(`DELETE FROM products WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getProductsByShop = async (req, res) => {
  try {
    const { shop_id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM products WHERE shop_id = ? ORDER BY id ASC`,
      [shop_id],
    );

    return res.status(200).json({
      success: true,
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

exports.totalproducts = async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) AS total FROM products
    `;

    const [rows] = await db.query(query);

    return res.status(200).json({
      success: true,
      data: rows[0].total,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};