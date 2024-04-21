const connection = require("../config/db");
const { MY_DB } = require("../config/env");

const locationTable = async () => {
  try {
    // Switch to the created database
    await connection.query(`USE ${MY_DB};`);
    console.log(`Switched to ${MY_DB}`);
    // Create locations_table table if it doesn't exist
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS locations_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT
);
    `;

    await connection.query(createTableSql);
    console.log("locations_table table created or successfully checked");
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

// Create table
locationTable();

const listAllLocations = async () => {
  const [rows] = await connection.query("SELECT * FROM locations_table");
  return rows;
};

const findLocationById = async (id) => {
  const [rows] = await connection.execute(
    "SELECT * FROM locations_table WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addOneLocation = async (location) => {
  const { name, address, latitude, longitude } = location;

  const sql = `INSERT INTO locations_table (name, address, latitude, longitude)
               VALUES (?, ?, ?, ?)`;

  const params = [name, address, latitude, longitude];

  const rows = await connection.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { location_id: rows[0].insertId };
};

// connection.format: This is a method provided by the mysql2 package that helps format SQL queries with values safely. It replaces placeholders (?) in the SQL string with the values provided in the array.
// const modifyLocation = async (location, id) => {
//   let sql = connection.format(`UPDATE locations_table SET ? WHERE id = ?`, [
//     location,
//     id,
//   ]);

//   const rows = await connection.execute(sql);
//   if (rows[0].affectedRows === 0) {
//     return false;
//   }
//   return { message: "success" };
// };

const modifyLocation = async (location, id) => {
  const sql = "UPDATE locations_table SET ? WHERE id = ?";
  const [rows] = await connection.execute(sql, [location, id]);
  
  if (rows.affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeLocation = async (id) => {
  let sql = "DELETE FROM locations_table WHERE id = ?";
  const [rows] = await connection.execute(sql, [id]);

  if (rows.affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

module.exports = {
  listAllLocations,
  findLocationById,
  addOneLocation,
  modifyLocation,
  removeLocation,
};


