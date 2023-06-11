import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return await mongoose.connect(process.env.MONGODB_URL);
};

export default connectDB;
