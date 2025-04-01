const pool = require('../db/database');

// Get all blocks
exports.getAllBlocks = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, d.name as district_name 
      FROM blocks b
      JOIN districts d ON b.district_id = d.id
      ORDER BY d.name, b.name
    `);
    
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching blocks'
    });
  }
};

// Get single block by ID
exports.getBlockById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT b.*, d.name as district_name 
      FROM blocks b
      JOIN districts d ON b.district_id = d.id
      WHERE b.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Block with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching block:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching block'
    });
  }
};

// Create new block
exports.createBlock = async (req, res) => {
  try {
    const { name, district_id, population, headquarters } = req.body;
    
    // Validate required fields
    if (!name || !district_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Block name and district_id are required'
      });
    }
    
    // Check if district exists
    const [checkDistrict] = await pool.query('SELECT * FROM districts WHERE id = ?', [district_id]);
    
    if (checkDistrict.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `District with ID ${district_id} not found`
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO blocks (name, district_id, population, headquarters) VALUES (?, ?, ?, ?)',
      [name, district_id, population || null, headquarters || null]
    );
    
    const [newBlock] = await pool.query(`
      SELECT b.*, d.name as district_name 
      FROM blocks b
      JOIN districts d ON b.district_id = d.id
      WHERE b.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      status: 'success',
      message: 'Block created successfully',
      data: newBlock[0]
    });
  } catch (error) {
    console.error('Error creating block:', error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 'error',
        message: 'Block with this name already exists in the district'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error creating block'
    });
  }
};

// Update block
exports.updateBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, district_id, population, headquarters } = req.body;
    
    // Check if block exists
    const [checkBlock] = await pool.query('SELECT * FROM blocks WHERE id = ?', [id]);
    
    if (checkBlock.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Block with ID ${id} not found`
      });
    }
    
    // If district_id is provided, check if it exists
    if (district_id) {
      const [checkDistrict] = await pool.query('SELECT * FROM districts WHERE id = ?', [district_id]);
      
      if (checkDistrict.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: `District with ID ${district_id} not found`
        });
      }
    }
    
    // Update block
    await pool.query(
      'UPDATE blocks SET name = ?, district_id = ?, population = ?, headquarters = ? WHERE id = ?',
      [
        name || checkBlock[0].name,
        district_id || checkBlock[0].district_id,
        population !== undefined ? population : checkBlock[0].population,
        headquarters !== undefined ? headquarters : checkBlock[0].headquarters,
        id
      ]
    );
    
    // Get updated block
    const [updatedBlock] = await pool.query(`
      SELECT b.*, d.name as district_name 
      FROM blocks b
      JOIN districts d ON b.district_id = d.id
      WHERE b.id = ?
    `, [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'Block updated successfully',
      data: updatedBlock[0]
    });
  } catch (error) {
    console.error('Error updating block:', error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 'error',
        message: 'Block with this name already exists in the district'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error updating block'
    });
  }
};

// Delete block
exports.deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if block exists
    const [checkBlock] = await pool.query('SELECT * FROM blocks WHERE id = ?', [id]);
    
    if (checkBlock.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Block with ID ${id} not found`
      });
    }
    
    // Delete block
    await pool.query('DELETE FROM blocks WHERE id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: `Block with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting block'
    });
  }
};