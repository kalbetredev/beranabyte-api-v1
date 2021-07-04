import { config } from "dotenv";
config();
import {
  createConnection,
  connect,
  ConnectOptions,
  ConnectionOptions,
} from "mongoose";
import { MONGO_URI } from "./Constants";

export const connectionOption: ConnectOptions = {
  useCreateIndex: true,
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const gFsConnectionOption: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const makeConnection = (option: ConnectionOptions) =>
  createConnection(MONGO_URI, option);

const connectDb = () =>
  connect(MONGO_URI, connectionOption).then((m) => {
    console.log("Connected to MongoDB Successfully");
    return m.connection.getClient();
  });

export default connectDb;
