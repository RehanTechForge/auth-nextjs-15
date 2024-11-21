import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("error", (err) =>
      console.log(`Error connecting to Mongo DB ${err.message}`)
    );
    connection.once("connected", () =>
      console.log(` connected to Mongo DB ${connection.host}`)
    );
    connection.on("disconnected", () =>
      console.log("Mongoose connection disconnected")
    );
  } catch (error: any) {
    console.log(`Error connecting to Mongoose: ${error.message}`);
    process.exit(1);
  }
};
