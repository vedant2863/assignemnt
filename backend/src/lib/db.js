import mongoose from "mongoose";

const dbConnection = () => {
  const connection = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.on("error", (err) => {
    console.error(err);
  });

  return connection;
};

export default dbConnection;