// EXPRESSJS
const express = require("express");
const codetribute = express();

// FOR SHA1
const crypto = require("crypto");

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
        res
          .status(500)
          .json({ status: 500, errorMsg: "Internal Server Error" });
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
            res.status(400).json({ status: 400 });
          } else {
            res.status(200).json({ status: 200 });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.get("/get/wallet/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    await db.query(
      `
      SELECT *
      FROM walletbase
      WHERE user_id = ?
      `,
      [user_id],
      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (result.length > 0) {
            res
              .status(200)
              .json({ status: 200, accountAddress: result[0].wallet_address });
          } else {
            res.status(400).json({ status: 400 , errorMsg: 'No wallet found for such user'});
          }
        }
      }
    );
  } catch (error) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
          res.status(400).json({ status: 400 });
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
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

// Ban user API
codetribute.post("/banUser/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    await db.query(
      `
          UPDATE users
          SET status = "Suspended"
          WHERE user_id = ?
        `,
      [user_id],

      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res
            .status(200)
            .json({ status: 200, msg: "User suspended until further notice." });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.post("/unbanUser/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    await db.query(
      `
          UPDATE users
          SET status = "Active"
          WHERE user_id = ?
        `,
      [user_id],

      (err) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res
            .status(200)
            .json({ status: 200, msg: "User' status is active now." });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

// const transactional_log_commit = (
//   user_id,
//   operation_type,
//   table_name,
//   query
// ) => {
//   try {
//     db.beginTransaction();
//     db.query(
//       `INSERT INTO transaction_log (actor_id, operation_type, table_name, query) 
//        VALUES (?,?,?,?)
//       `,
//       [user_id, operation_type, table_name, query],
//       (err, result, fields) => {
//         if (err) {
//           db.rollback();
//         } else {
//           db.commit();
//         }
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     db.rollback();
//   }
// };

codetribute.get("/view/system/logs/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    if (user_id[0] == "C" || user_id[0] == "P") {
      res.status(400).json({ status: 400, msg: "Insufficient privileges" });
      return;
    } else {
      await db.query(
        `
        SELECT * 
        FROM transaction_log
        `,
        [],
        async (err, result, fields) => {
          if (err) {
            await db.rollback();
            res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
            return;
          } else {
            if (result.length > 0) {
              res.status(200).json(result);
            } else {
              res
                .status(400)
                .json({ status: 200, msg: "No transactional logs found." });
            }
          }
        }
      );
      await db.commit();
    }
  } catch (error) {
    db.rollback();
    res
      .status(500)
      .json({ status: 500, errorMsg: `Internal Server Error:\n${error}` });
    console.error(error);
  }
});

codetribute.get("/view/activity/logs/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    db.beginTransaction();
    await db.query(
      `
        SELECT * 
        FROM transaction_log
        WHERE user_id = ?
        `,
      [user_id],
      async (err, result, fields) => {
        if (err) {
          await db.rollback();
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
          return;
        } else {
          if (result.length > 0) {
            db.commit();
            res.status(200).json(result);
          } else {
            db.commit();
            res
              .status(400)
              .json({ status: 200, msg: "No transactional logs found." });
          }
        }
      }
    );
  } catch (error) {
    db.rollback();
    res
      .status(500)
      .json({ status: 500, errorMsg: `Internal Server Error:\n${error}` });
    console.error(error);
  }
});

// Registration API (req.body)
codetribute.post("/registration/:actor_id", async (req, res) => {
  const { actor_id } = req.params;
  const { user_id, name, email, password, phone_number } = req.body;

  let privilege;

  if (user_id[0] == "C") {
    privilege = "Contributor";
  } else if (user_id[0] == "P") {
    privilege = "Publisher";
  }

  try {
    await db.beginTransaction();
    await db.query(
      `
            INSERT INTO users (user_id, name, email, password, phone_number, privilege)
            VALUES (?,?,?,?,?,?)
          `,
      [user_id, name, email, password, phone_number, privilege],

      async (err, result, fields) => {
        if (err) {
          await db.rollback();
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res
            .status(200)
            .json({ status: 200, msg: "User registered successfully." });
        }
      }
    );
    await db.commit();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
    await db.rollback();
  }
});

codetribute.post("/update/project/:project_id/:name/:description/:code_path", async (req,res) => {
  const { project_id, name, description, code_path } = req.params;

try {
    await db.query(`
      UPDATE projectbase
      SET project_name = ?, project_description = ?, code_path = ?
      WHERE project_id = ?
    `, [name, description, code_path, project_id],
      (err, result, fields) => {
        if (err) {
          res.status(400).json({status:400, errorMsg: err.sqlMessage});
        }
        else {
          res.status(200).json({status:200, msg: 'Project removed from listing'});
        }
      }
     )
} catch (error) {
  console.error(error);
  res.status(500).json({status:500, errorMsg: `Internal server error: ${error.message}`})
}
});

codetribute.delete("/delete/project/:project_id", async (req,res) => {
  const { project_id } = req.params;

try {
    await db.query(`
      DELETE
      FROM projectbase
      WHERE project_id = ?
    `, [project_id],
      (err, result, fields) => {
        if (err) {
          res.status(400).json({status:400, errorMsg: err.sqlMessage});
        }
        else {
          res.status(200).json({status:200, msg: 'Project removed from listing'});
        }
      }
     )
} catch (error) {
  console.error(error);
  res.status(500).json({status:500, errorMsg: `Internal server error: ${error.message}`})
}
});

codetribute.post("/update/user/:actor_id/:user_id", async (req, res) => {
  const { actor_id, user_id } = req.params;
  const { name, email, password, phone_number } = req.body;

  try {
    await db.beginTransaction();
    await db.query(
      `
        UPDATE users
        SET name=?, email=?, password=?, phone_number=?
        WHERE user_id=?
      `,
      [name, email, password, phone_number, user_id],

      async (err, result, fields) => {
        if (err) {
          await db.rollback();
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res
            .status(200)
            .json({ status: 200, msg: "User profile updated successfully." });
        }
      }
    );
    await db.commit();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
    await db.rollback();
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
          if (err) {
            res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
          } else {
            res
              .status(200)
              .json({ status: 200, msg: "User registered successfully." });
          }
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
    }
  }
);

codetribute.post("/publish", async (req, res) => {
  const { project_id, projectName, projectDescription, projectLink, user_id } =
    req.body;

  try {
    await db.query(
      `INSERT INTO projectbase (project_id, project_name, project_description, publisher_id, code_path)
      VALUES (?,?,?,?,?)`,
      [project_id, projectName, projectDescription, user_id, projectLink],

      (err, result, fields) => {
        if (err) {
          console.error(err);
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res
            .status(200)
            .json({ status: 200, msg: "Project published successfully" });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.post("/post/commit/contributor", async (req, res) => {
  const { commit_id, project_id, contributor_id, commit_path } = req.body;

  console.log(commit_id, project_id, contributor_id, commit_path);

  try {
    db.beginTransaction();
    await db.query(
      `
        INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id)
        VALUES (?,?,?,?)
      `,
      [commit_id, contributor_id, commit_path, project_id],

      (err, result, fields) => {
        if (err) {
          db.rollback();
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          db.commit();
          transactional_log_commit(
            contributor_id,
            "INSERT",
            "commitbase",
            `INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (${commit_id},${contributor_id},${commit_path},${project_id})`
          );
          res.status(200).json({ status: 200, msg: "Commit successful" });
        }
      }
    );
  } catch (err) {
    db.rollback();
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.get("/get/commit/count/leaderboard/:cid", async (req, res) => {
  const {cid} = req.params;
  try {
    await db.query(
      `SELECT COUNT(*) as "CommitCount"
      FROM commitbase C
      INNER JOIN projectbase P ON C.project_id = P.project_id
      WHERE contributor_id = ? AND C.commit_status = "Accepted"`,
      [cid],

      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400 });
        } else {
          if (result.length > 0) {
            res.status(200).json(result[0].CommitCount);
          } else {
            res
              .status(400)
              .json({ status: 400, msg: "No commit found for such project" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
})

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
          if (result.length > 0) {
            res.status(200).json(result[0].CommitCount);
          } else {
            res
              .status(400)
              .json({ status: 400, msg: "No commit found for such project" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.get("/get/publishers/", async (req, res) => {
  try {
    await db.query(
      `
      SELECT *
      FROM users
      WHERE privilege LIKE 'P%'     
      `,
      [],
      (err, publishers, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (publishers.length > 0) {
            res.status(200).json(publishers);
          } else {
            res.status(400).json({ status: 400, msg: "No users found" });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

// GET CONTRIBUTOR PROFILE DATA
codetribute.get("/get/contributors/", async (req, res) => {
  try {
    await db.query(
      `
      SELECT *
      FROM users
      WHERE privilege LIKE 'C%'    
      `,
      [],
      (err, contributors, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (contributors.length > 0) {
            res.status(200).json(contributors);
          } else {
            res.status(400).json({ status: 400, msg: "No contributors found" });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

// GET ALL USERS EXCEPT ADMINS
codetribute.get("/get/allUsersExceptAdmins/", async (req, res) => {
  try {
    await db.query(
      `
      SELECT *
      FROM users
      WHERE privilege LIKE 'C%' OR privilege LIKE 'P%'     
      `,
      [],
      (err, users, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (users.length > 0) {
            res.status(200).json({status:200, user: users});
          } else {
            res.status(400).json({ status: 400, msg: "No users found" });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res
            .status(200)
            .json({ status: 200, msg: "Commit status updated as 'Rejected'" });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res
              .status(400)
              .json({ status: 400, msg: "No commits found for such project" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.post("/recordTx/:_from/:_to/:_amount", async (req, res) => {
  const { _from, _to, _amount } = req.params;

  const hash = crypto.createHash("sha1");
  hash.update(`Transaction${_from}${_to}${_amount}${Date.now()}`);
  const hashedTxId = hash.digest("hex");
  console.log(hashedTxId);

  try {
    await db.query(
      `
      INSERT INTO payments (transaction_id, sender_user_id, receiver_user_id, amount)
      VALUES (?,?,?,?)
      `,
      [hashedTxId, _from, _to, _amount],
      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          res.status(200).json({ status: 200, msg: "Transaction recorded" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.get("/get/history/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `
                SELECT *
                FROM payments
                WHERE sender_user_id = ? OR receiver_user_id = ?
            `,
      [id, id],

      (err, result, field) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({
              status: 400,
              msg: "No transaction history for this wallet account",
            });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.get("/get/tx/incoming/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `
      SELECT *
      FROM payments
      WHERE receiver_user_id = ?
      `,
      [id],
      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res
              .status(400)
              .json({ status: 400, msg: "No incoming tx found for such user" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});

codetribute.get("/get/tx/outgoing/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `
      SELECT *
      FROM payments
      WHERE sender_user_id = ?
      `,
      [id],
      (err, result, fields) => {
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res
              .status(400)
              .json({ status: 400, msg: "No outgoing tx found for such user" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
        if (err) {
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        } else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({
              status: 400,
              msg: "No commit found for such project id",
            });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
        } else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res.status(400).json({
              status: 400,
              msg: "No commit found for this contributor.",
            });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
        if (err)
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res
              .status(400)
              .json({ status: 400, msg: "No accepted commits found" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
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
        if (err)
          res.status(400).json({ status: 400, errorMsg: err.sqlMessage });
        else {
          if (result.length > 0) {
            res.status(200).json(result);
          } else {
            res
              .status(400)
              .json({ status: 400, msg: "No rejected commits found" });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, errorMsg: "Internal Server Error" });
  }
});
