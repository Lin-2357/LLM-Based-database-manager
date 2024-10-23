const express = require('express');
const bodyParser = require('body-parser');
const myGenerate = require('./mygenerate'); // Adjust path if necessary
const myInterpret = require('./generate');
const myPopulate = require('./generate2');

const app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

PORT = 4000;

app.post('/generate', async (req, res) => {
  try {
    const generateInput = req.body.prompt; // Extract prompt from request body

    // Call the local function from mygenerate.js
    const result = await myGenerate({ animal: generateInput });

    // Send the result back to the client
    if (result['result']) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/interpret', async (req, res) => {
  try {

    // Call the local function from mygenerate.js
    const result = await myInterpret(req.body);

    // Send the result back to the client
    if (result['result']) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/populate', async (req, res) => {
  try {

    // Call the local function from mygenerate.js
    const result = await myPopulate(req.body);
    // Send the result back to the client
    res.json(result)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.export = app;



