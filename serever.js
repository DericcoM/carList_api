const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3100;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToMongoDB() {
    try {
      await client.connect();
      db = client.db(process.env.DB_NAME);
      console.log('Connected to MongoDB');
  
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

connectToMongoDB();

app.get('/api/cars', async (req, res) => {
    try {
      const carsCollection = db.collection('stock');
  
      const pipeline = [
        {
          $group: {
            _id: '$mark',
            count: { $sum: 1 },
          },
        },
      ];
  
      const carCountsByBrand = await carsCollection.aggregate(pipeline).toArray();
      const cars = await carsCollection.find().toArray();
  
      res.json({ cars, carCountsByBrand });
    } catch (error) {
      console.error('Error getting cars:', error);
      res.status(500).json({ error: 'Failed to get cars' });
    }
  });
  
