import mongoose from "mongoose";

const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Mongo Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

export default mongoConnect;
