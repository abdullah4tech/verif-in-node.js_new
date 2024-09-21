const cors = require('cors')

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors(
  {
    origin: [
      'https://payment-verification-form.vercel.app', 
      'https://formspree.io/f/mldrybrn', 
      'http://localhost:3000'
    ], 
    methods: ['GET', 'POST'],
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  }
))
app.options('*', cors());

const filePath = path.join(__dirname, 'transactionIds.json');

// Load existing transaction IDs
const loadTransactionIds = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save transaction IDs
const saveTransactionIds = (ids) => {
  fs.writeFileSync(filePath, JSON.stringify(ids, null ,2), 'utf-8');
};

// Check if a transaction ID is already used
app.post('/check-transaction', (req, res) => {
  const { transactionId } = req.body;
  console.log(transactionId)
  const usedTransactionIds = loadTransactionIds();

  if (usedTransactionIds.includes(transactionId)) {
    return res.status(400).json({ message: 'This Transaction ID has already been used.' });
  }

  // Save new transaction ID
  usedTransactionIds.push(transactionId);
  saveTransactionIds(usedTransactionIds);

  res.json({ message: 'Transaction ID is valid and saved' });
});

const port = process.env.PORT || 3000; // Use environment variable if available
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
