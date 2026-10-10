import mysql from "../config/db.js";

export const createDriver = async ({
  role = "driver",
  lastName,
  firstName,
  middleInitial,
  email,
  phoneNumber,
  password,
  truck_company_id,
}) => {
  const insertQuery = `INSERT INTO drivers (role, lastName, firstName, middleInitial, email, phoneNumber, password, truck_company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await mysql.execute(insertQuery, [
    role,
    lastName,
    firstName,
    middleInitial,
    email,
    phoneNumber,
    password,
    truck_company_id,
  ]);

  const newDriver = result.insertId;
  const generatedUsername = `${lastName.slice(0, 2).toUpperCase()}${newDriver}`;

  const updateQuery = `UPDATE drivers SET username = ? WHERE id = ?`;
  await mysql.execute(updateQuery, [generatedUsername, newDriver]);

  return { id: newDriver, username: generatedUsername };
};

// Can be use to find user via email or username
export const findDriverByIdentifier = async (identifier) => {
  const selectQuery = `SELECT id, username, lastName, firstName, middleInitial, email, password, truck_company_id, created_at FROM drivers WHERE email = ? OR username = ? `;

  const [rows] = await mysql.execute(selectQuery, [identifier, identifier]);

  return rows[0] || null;
};

// Use to find driver by id
export const findDriverById = async (id) => {
  const selectQuery = `SELECT id, username, lastName, firstName, middleInitial, email, password, created_at FROM drivers WHERE id =?`;
  const [rows] = await mysql.execute(selectQuery, [id]);

  return rows[0] || null;
};

export const getAllTruckCompanies = async () => {
  const selectQuery = `SELECT id, name FROM truck_companies WHERE status = "active" ORDER BY name ASC`;
  const [rows] = await mysql.execute(selectQuery);

  return rows;
};

export const findTruckCompanyById = async (id) => {
  const selectQuery = `SELECT id, name FROM truck_companies WHERE id = ?`;
  const [rows] = await mysql.execute(selectQuery, [id]);

  return rows[0] || null;
};
