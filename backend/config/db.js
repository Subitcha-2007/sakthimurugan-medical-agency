const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri === 'memory' || mongoUri.includes('localhost:27017')) {
      try {
        if (mongoUri && !mongoUri.includes('memory')) {
          console.log(`Attempting connection to provided MongoDB URI: ${mongoUri}`);
          await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
          console.log('Successfully connected to MongoDB server');
          return;
        }
      } catch (err) {
        console.log('Local MongoDB not accessible, falling back to embedded Mongo engine for 100% offline & portable operation...');
      }

      console.log('Initializing embedded MongoDB instance...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host} (${mongoServer ? 'Embedded In-Memory Engine' : 'External Database'})`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
