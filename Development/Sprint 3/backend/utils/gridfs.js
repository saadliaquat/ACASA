import { GridFSBucket } from 'mongodb';

const initializeGridFSBucket = (conn) => {
  try {
    const bucket = new GridFSBucket(conn.connection.db, {
      bucketName: 'uploads' // Use 'uploads' or any other name as your bucket
    });
    console.log("GridFSBucket initialized");
    return bucket;
  } catch (err) {
    console.error("Error initializing GridFSBucket:", err);
    throw err;
  }
};

export default initializeGridFSBucket;