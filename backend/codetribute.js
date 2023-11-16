// EXPRESSJS
const express = require("express");
const codetribute = express();

// JSON PAYLOAD PARSER
codetribute.use(express.json());

// CROSS-ORIGIN RESOURCE SHARING
const cors = require("cors");
codetribute.use(cors());

// DOTENV FOR ABSTRACTING CREDENTIALS
const dotenv = require("dotenv");
dotenv.config();

// IMPORT DATABASE CONNECTIVITY SETTINGS
const db = require("./database/connectivity");

// WEB3JS
const Web3 = require("web3");
const web3 = new Web3(
  `https://eth-sepolia.g.alchemy.com/v2/f_R62a50s5Tn4qsHaz0n0AyoIUkwzXAG`
);
const contractAddress = "0x57fdc470b268675ae5932992d08410abf98a2430";
const ABI = require("./CodetributeToken.json");
const contract = new web3.eth.Contract(ABI, contractAddress);
const privateKey =
  "87a7e1d10c78280276541b78c2deb1920f30f4df565a561a6f3ca7a107f03258";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// BACKEND + DATABASE INITIALISATION
codetribute.listen(
  process.env.BACKEND_PORT,
  (__init__ = () => {
    console.log("[server] Server initiated");

    db.connect((err) => {
      try {
        if (err) {
          throw err;
        } else {
          console.log("[db] MySQL database connected");
        }
      } catch (err) {
        console.error(err);
      }
    });
  })
);

// GET REQUESTS
codetribute.get("/get/check/user/exists/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `
            SELECT user_id
            FROM users
            WHERE user_id = ?
            `,
      [id],

      (err, result, fields) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            // do exist
            res.status(409).json({ status: 409 });
          } else {
            // do not exist
            res.status(200).json({ status: 200 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

codetribute.get("/authenticate/:user_id/:password/", async (req, res) => {
  const { user_id, password } = req.params;

  try {
    await db.query(
      `
                SELECT *
                FROM users
                WHERE user_id = ? AND password = ?
            `,
      [user_id, password],

      (err, result, fields) => {
        if (err) {
          res.status(500).json({ status: 500 });
        } else {
          if (result.length > 0) {
            res.status(200).json({ status: 200, userdata: result[0] });
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

// Registration API
codetribute.post(
  "/registration/:user_id/:name/:email/:password/:phone_number/:privilege",
  async (req, res) => {
    const { user_id, name, email, password, phone_number, privilege } =
      req.params;

    try {
      await db.query(
        `
            INSERT INTO users (user_id, name, email, password, phone_number, privilege)
            VALUES (?,?,?,?,?,?)
          `,
        [user_id, name, email, password, phone_number, privilege],

        (err, result, fields) => {
          if (err) res.status(400).json({ status: 400 });
          else
            res
              .status(200)
              .json({ status: 200, msg: "User registered successfully." });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 500, msg: "Internal Server Error" });
    }
  }
);

codetribute.post("/publish", async (req, res) => {
  const { project_id, projectName, projectDescription, projectLink, userId } =
    req.body;

  try {
    await db.query(
      `INSERT INTO projectbase (project_id, project_name, project_description, publisher_id, code_path)
      VALUES (?,?,?,?,?)`,
      [project_id, projectName, projectDescription, userId, projectLink],

      (err, result, fields) => {
        if (err) {
          console.error(err);
          res
            .status(400)
            .json({ status: 400, error: err.sqlMessage.toString() });
        } else {
          res.status(200).json({ status: 200 });
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

codetribute.post("/post/commit/contributor", async (req, res) => {
  const { commit_id, project_id, contributor_id, commit_path } = req.body;

  console.log(commit_id, project_id, contributor_id, commit_path);

  try {
    await db.query(
      `
        INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id)
        VALUES (?,?,?,?)
      `,
      [commit_id, contributor_id, commit_path, project_id],

      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res.status(200).json({ status: 200 });
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

// Project retrieval API (using publisher_id)
codetribute.get("/get/projects/publisher/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    await db.query(
      `
            SELECT P.*
            FROM users U
            INNER JOIN projectbase P ON U.user_id = P.publisher_id
            WHERE U.user_id = ?
            `,
      [pid],

      (err, result, fields) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

// All projects for contributor
codetribute.get("/get/projects", async (req, res) => {
  try {
    await db.query(
      `
            SELECT *
            FROM projectbase
            `,
      [],

      (err, result, fields) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

// Project retrieval API (using project_id)
codetribute.get("/get/projects/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    await db.query(
      `
            SELECT *
            FROM projectbase
            WHERE project_id = ?
            `,
      [pid],

      (err, result, fields) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

codetribute.get("/get/commit/count/:project_id", async (req, res) => {
  const { project_id } = req.params;

  try {
    await db.query(
      `SELECT COUNT(*) as "CommitCount"
      FROM commitbase C
      INNER JOIN projectbase P ON C.project_id = P.project_id
      WHERE C.project_id = ? AND C.commit_status = "Accepted"`,
      [project_id],

      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400 });
        } else {
          res.status(200).json(result[0].CommitCount);
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

// DELETE REQUESTS - PUBLISHER
codetribute.post("/manage/commit/reject/:commit_id", async (req, res) => {
  const { commit_id } = req.params;

  try {
    await db.query(
      `
      UPDATE commitbase
      SET commit_status = 'Rejected'
      WHERE commit_id = ?
      `,
      [commit_id],

      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
          console.log(err.sqlMessage);
        } else {
          res.status(200).json({ status: 200, msg: "Update done!" });
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

codetribute.post("/manage/commit/accept/:commit_id", async (req, res) => {
  const { commit_id } = req.params;

  try {
    await db.query(
      `
      UPDATE commitbase
      SET commit_status = "Accepted"
      WHERE commit_id = ?;
    `,
      [commit_id],

      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, msg: "Update unsuccessful!" });
        } else {
          res.status(200).json({ status: 200, msg: "Update done!" });
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

// Get all commits for a publisher, based on ONLY his projects (publisher_id)
codetribute.get("/get/commits/projects/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    await db.query(
      `SELECT C.* 
      FROM commitbase C
      INNER JOIN projectbase P ON C.project_id = P.project_id
      WHERE P.publisher_id = ? AND C.commit_status = 'Accepted'`,
      [pid],
      (err, result, field) => {
        if (err) {
          res.status(400).json({ status: 400 });
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

codetribute.post("/recordTx/:_to/:_amount", async (req, res) => {
  const {_to, _amount} = req.params;

  try {
    await db.query(
      `
      INSERT INTO transactions (receiver_id, amount)
      VALUES (?,?)
      `,
      [_to, _amount],
      (err, result, fields) => {
        if (err) {
          res.status(400).json({status: 400});
        }
        else {
          res.status(200).json({status: 200});
        }
      }
    )
  }
  catch (error) {
    console.error(error);
  }
});

// Transfer token as soon as possible
codetribute.post("/transfer/tokens/:to", async (req, res) => {
  const { to } = req.params;

  try {
    if (!to) {
      res.status(400).json({ status: 400 });
      return;
    }

    await db.query(
      `
        SELECT *
        FROM walletbase
        WHERE owner_id = ?
      `,
      [to],

      async (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400 });
        } else {
          const toAddress = result[0].wallet_id;

          contract.methods
            .transfer(toAddress, 1000)
            .send({ from: web3.eth.defaultAccount, gas: 300000 })
            .on("transactionHash", function (hash) {
              console.log("Transaction Hash:", hash);
            })
            .on("confirmation", function (confirmationNumber, receipt) {
              console.log("Confirmation Number:", confirmationNumber);
              

            })
            .on("receipt", function (receipt) {
              console.log("Transaction Receipt:", receipt);
            })
            .on("error", function (error, receipt) {
              console.error("Transaction Error:", error);
            });

          res.status(200).json({
            status: 200,
            _amount: 100,
            _to: result[0].owner_id,
            _wallet: result[0].wallet_id
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

codetribute.get("/get/history/:id", async (req, res) => {
  const {id} = req.params;

  try {
    await db.query(
      `
                SELECT *
                FROM transactions T
                WHERE T.receiver_wallet_id = ? OR T.sender_wallet_id = ?
                
            `,
      [id, id],

      (err, result, field) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
        console.table(result);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

// Commit Retrieval API (by project_id)
codetribute.get("/get/commit/project/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    await db.query(
      `
                SELECT C.*
                FROM commitbase C
                INNER JOIN projectbase P ON C.project_id = P.project_id
                WHERE P.project_id = ? AND C.commit_status = "Pending"
            `,
      [pid],

      (err, result, field) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

// Commit and Project Retrieval API (by contributor_id)
codetribute.get("/get/commit/contributor/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    await db.query(
      `
                SELECT *
                FROM commitbase C 
                INNER JOIN projectbase P ON C.project_id = P.project_id
                WHERE C.contributor_id = ?
              `,
      [cid],

      (err, result, field) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
          console.log(err.sqlMessage);
        } else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

// Commit Retrieval API (by commit_status)
codetribute.get("/get/commit/success", async (req, res) => {
  try {
    await db.query(
      `
                SELECT *
                FROM commitbase
                WHERE commit_status = "Accepted"
            `,
      [],

      (err, result, field) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});

// Commit Retrieval API (by uncommit_status)
codetribute.get("/get/commit/failure", async (req, res) => {
  try {
    await db.query(
      `
                SELECT *
                FROM commitbase
                WHERE commit_status = "Rejected"
            `,
      [],

      (err, result, field) => {
        if (err) res.status(400).json({ status: 400 });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({ status: 400 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
});
