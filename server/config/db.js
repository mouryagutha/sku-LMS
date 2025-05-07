import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  });

  mongoose.connection.on("error", (err) => {
    console.log(`Mongoose connection error: ${err}`);
  });

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });
};

const disconnectDB = () => {
  mongoose.disconnect();
};

export { connectDB, disconnectDB };
