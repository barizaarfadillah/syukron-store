import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections.readyState === 1) {
    console.log("Already connected.");
    return mongoose.connection.asPromise();
  }
  return await mongoose.connect(process.env.MONGODB_URL);
};

export default connectDB;
