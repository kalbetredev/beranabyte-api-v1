import { createConnection, connect, ConnectOptions } from "mongoose";

const connectionOption: ConnectOptions = {
  useCreateIndex: true,
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const connection = (uri: string) =>
  createConnection(uri, connectionOption);

const connectDb = (uri: string) =>
  connect(uri, connectionOption).then((m) => {
    console.log("Connected to MongoDB Successfully");
    return m.connection.getClient();
  });

export default connectDb;
