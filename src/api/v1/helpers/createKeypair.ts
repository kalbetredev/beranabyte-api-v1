import crypto from "crypto";
import fs from "fs";

const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4095,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(__dirname + "../../../../id_rsa_pub.pem", keyPair.publicKey);
  fs.writeFileSync(
    __dirname + "../../../../id_rsa_priv.pem",
    keyPair.privateKey
  );
};

export default generateKeyPair;
