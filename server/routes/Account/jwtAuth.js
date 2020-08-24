const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../../utils/jwtGenerator");
const validInfo = require("../../middleware/validInfo");
const authorization = require("../../middleware/authorization");
const sesClient = require("../Account/aws/aws_ses_client");

// RESGISTERING //

router.post("/register", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { name, gender, email, password, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM users_email WHERE user_email = $1",
      [email]
    );
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exist");
    }

    //3. bcrypt the user password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. bcrypt the verify code
    var code = Math.floor(Math.random() * 1000000 + 1);
    const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing following code:
      <br/>
      <h3>Code: <b>${code}</b></h3>
      <br/>
      Have a pleasant day.
      <br/><br/>
      `;

    //4. call sesClient to send an email

    sesClient.sendEmail(email, "Account Verification", html);

    //5. enter the new user inside our database

    const newUser = await pool.query(
      "INSERT INTO users_email (full_name, gender, user_email, user_password, birthdate, address,verify) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [name, gender, email, bcryptPassword, birthdate, address, code]
    );

    res.send("Please check your E-mail!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!");
  }
});

// LOGIN ROUTE //

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user doesn't exist(if not then throw error)

    const user = await pool.query(
      "SELECT * FROM users_email WHERE user_email =$1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(401).json("Incorrect E-mail");
    }

    //3. check if incomming password is the same database password

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Incorrect Password");
    }

    //3. give them the jwt token

    const token = jwtGenerator(user.rows[0].user_id);
    res.json({
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//         IS VERIFY ON LOGIN JWT TOKEN

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//         CONFIRM CODE FROM EMAIL
router.get("/verification", async (req, res) => {
  try {
    const { email, vCode } = req.body;

    const rCode = await pool.query(
      "SELECT verify FROM users_email WHERE user_email =$1",
      [email]
    );

    if (rCode.rows[0].verify === vCode) {
      res.send("Correct Code.");
    } else res.send("Incorrect Code!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
