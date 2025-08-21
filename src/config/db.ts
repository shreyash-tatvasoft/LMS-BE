import AWS from "aws-sdk";
import mysql from "mysql2/promise";

const ssm = new AWS.SSM({ region: "ap-south-1" });

async function getDBParams() {
  const names = ["/myapp/DB_HOST","/myapp/DB_USER","/myapp/DB_PASS","/myapp/DB_NAME"];
  const response = await ssm.getParameters({ Names: names, WithDecryption: true }).promise();
  const params: Record<string, string> = {};
  response.Parameters?.forEach(p => {
    params[p.Name!.split("/").pop()!] = p.Value!;
  });
  return params;
}

// Export a ready-to-use pool
export const db = (async () => {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = await getDBParams();
  return mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
})();
