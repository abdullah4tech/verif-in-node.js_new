const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

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
  fs.writeFileSync(filePath, JSON.stringify(ids, null, 2), 'utf-8');
};

// Check if a transaction ID is already used
app.post('/check-transaction', (req, res) => {
  const { transactionId } = req.body;
  const usedTransactionIds = loadTransactionIds();

  if (usedTransactionIds.includes(transactionId)) {
    return res.status(400).json({ message: 'Transaction ID already used' });
  }

  // Save new transaction ID
  usedTransactionIds.push(transactionId);
  saveTransactionIds(usedTransactionIds);

  res.json({ message: 'Transaction ID is valid and saved' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
