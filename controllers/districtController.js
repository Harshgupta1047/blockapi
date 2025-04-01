const pool = require('../db/database');

// Get all districts
exports.getAllDistricts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM districts ORDER BY name');
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching districts'
    });
  }
};

// Get single district by ID
exports.getDistrictById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM districts WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `District with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching district:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching district'
    });
  }
};

// Create new district
exports.createDistrict = async (req, res) => {
  try {
    const { name, population, area, headquarters } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'District name is required'
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO districts (name, population, area, headquarters) VALUES (?, ?, ?, ?)',
      [name, population || null, area || null, headquarters || null]
    );
    
    const [newDistrict] = await pool.query('SELECT * FROM districts WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      status: 'success',
      message: 'District created successfully',
      data: newDistrict[0]
    });
  } catch (error) {
    console.error('Error creating district:', error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 'error',
        message: 'District with this name already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error creating district'
    });
  }
};

// Update district
exports.updateDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, population, area, headquarters } = req.body;
    
    // Check if district exists
    const [checkDistrict] = await pool.query('SELECT * FROM districts WHERE id = ?', [id]);
    
    if (checkDistrict.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `District with ID ${id} not found`
      });
    }
    
    // Update district
    await pool.query(
      'UPDATE districts SET name = ?, population = ?, area = ?, headquarters = ? WHERE id = ?',
      [
        name || checkDistrict[0].name,
        population !== undefined ? population : checkDistrict[0].population,
        area !== undefined ? area : checkDistrict[0].area,
        headquarters !== undefined ? headquarters : checkDistrict[0].headquarters,
        id
      ]
    );
    
    // Get updated district
    const [updatedDistrict] = await pool.query('SELECT * FROM districts WHERE id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'District updated successfully',
      data: updatedDistrict[0]
    });
  } catch (error) {
    console.error('Error updating district:', error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 'error',
        message: 'District with this name already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error updating district'
    });
  }
};

// Delete district
exports.deleteDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if district exists
    const [checkDistrict] = await pool.query('SELECT * FROM districts WHERE id = ?', [id]);
    
    if (checkDistrict.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `District with ID ${id} not found`
      });
    }
    
    // Delete district
    await pool.query('DELETE FROM districts WHERE id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: `District with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting district:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting district'
    });
  }
};

// Get all blocks for a district
exports.getDistrictBlocks = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if district exists
    const [checkDistrict] = await pool.query('SELECT * FROM districts WHERE id = ?', [id]);
    
    if (checkDistrict.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `District with ID ${id} not found`
      });
    }
    
    // Get blocks for the district
    const [blocks] = await pool.query(
      'SELECT * FROM blocks WHERE district_id = ? ORDER BY name',
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      district: checkDistrict[0],
      results: blocks.length,
      data: blocks
    });
  } catch (error) {
    console.error('Error fetching district blocks:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching district blocks'
    });
  }
};