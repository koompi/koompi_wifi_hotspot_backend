const router = require("express").Router();
const pool = require("../../db");

router.put("/user", async (req, res) => {
  try {
    const { username, old_password, new_password } = req.body;
    const user = await pool.query(
      "SELECT * FROM radcheck WHERE username = $1",
      [username]
    );
    if (user.rows.length === 0) {
      return res.status(401).json("Incorrect username!");
    }
    // save save old_password into temporary_pass to encrypt AND takes from it to compare
    const tem = await pool.query(
      "INSERT INTO temporary_pass (username,value) VALUES ($1,MD5($2))",
      [username, old_password]
    );
    const pass = await pool.query(
      "SELECT * FROM temporary_pass WHERE username = $1",
      [username]
    );

    // have to delete data from temporary_pass
    const DELETE = await pool.query(
      "DELETE FROM temporary_pass WHERE username = $1",
      [username]
    );
    // comparing password
    if (pass.rows[0].value !== user.rows[0].value) {
      return res.status(401).json("Incorect Password!");
    }

    // update into database
    const newPass = await pool.query(
      "UPDATE radcheck SET value = MD5($1) WHERE username = $2",
      [new_password, username]
    );

    res.send("Reset successfull");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
