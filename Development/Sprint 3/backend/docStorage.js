import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const docStorage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: `doc-${Date.now()}-${file.originalname}`,
      bucketName: 'docs',
    };
  },
});

const uploadDoc = multer({ storage: docStorage });

export default uploadDoc;
