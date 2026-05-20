// controllers/shopController.js

const db = require("../../config/db");
const fs = require("fs");
const path = require("path");


exports.createShop = async (req, res) => {

  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Shop name is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Shop icon is required"
      });
    }

    const icon = req.file.filename;

    const query = `
      INSERT INTO shops (
        name,
        icon
      )
      VALUES (?, ?)
    `;

    const [result] = await db.query(query, [
      name,
      icon
    ]);

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: {
        id: result.insertId,
        name,
        icon_url:
          `${req.protocol}://${req.get("host")}/uploads/${icon}`
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

exports.getAllShops = async (req, res) => {

  try {

    const query = `
      SELECT 
        shops.id,
        shops.name,
        shops.icon,
        COUNT(categories.id) AS total_categories
      FROM shops
      LEFT JOIN categories 
        ON shops.id = categories.shop_id
      GROUP BY shops.id
      ORDER BY shops.id DESC
    `;

    const [rows] = await db.query(query);

    const data = rows.map((shop) => ({
      ...shop,
      icon_url: `${req.protocol}://${req.get("host")}/uploads/${shop.icon}`
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      data
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
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
        message: "Shop not found"
      });

    }

    const shop = rows[0];

    shop.icon_url =
      `${req.protocol}://${req.get("host")}/uploads/${shop.icon}`;

    return res.status(200).json({
      success: true,
      data: shop
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

 
exports.updateShop = async (req, res) => {

  try {

    const { id } = req.params;

    const { name } = req.body;

    const [rows] = await db.query(
      `SELECT * FROM shops WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });

    }

    const oldShop = rows[0];

    let icon = oldShop.icon;

    // new image upload
    if (req.file) {

      // old image delete
      const oldImagePath = path.join(
        __dirname,
        "../uploads",
        oldShop.icon
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      icon = req.file.filename;
    }

    const query = `
      UPDATE shops
      SET
        name = ?,
        icon = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(query, [
      name || oldShop.name,
      icon,
      id
    ]);

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};


exports.deleteShop = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM shops WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });

    }

    const shop = rows[0];

    // image delete
    const imagePath = path.join(
      __dirname,
      "../uploads",
      shop.icon
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await db.query(
      `DELETE FROM shops WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Shop deleted successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};