import mongoose from "mongoose";

let isConnected = false; // Variable para rastrear el estado de la conexión

export const connectToDB = async () => {
  if (isConnected) {
    console.log("Ya conectado a la base de datos");
    return mongoose.connection;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Conectado a la base de datos");
    return mongoose.connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw new Error("Error al conectar a la base de datos");
  }
};
