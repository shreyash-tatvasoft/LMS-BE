import bcrypt from "bcrypt";
import AWS from "aws-sdk";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}


export async function getJWTSecret(): Promise<string> {
  // AWS Setup
  
  // const ssm = new AWS.SSM({ region: "ap-south-1" });
  // const param = await ssm
  //   .getParameter({
  //     Name: "/myapp/JWT_SECRET", // replace with your parameter name
  //     WithDecryption: true,      // decrypt if it's a SecureString
  //   })
  //   .promise();

  // Railway Setup

  const param = { Parameter : { Value: process.env.JWT_SECRET }}

  if (!param.Parameter?.Value) {
    throw new Error("JWT secret not found in SSM");
  }

  return param.Parameter.Value;
}
