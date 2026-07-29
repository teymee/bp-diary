const crypto = require("crypto");

const publicKey =
  "BNRSOkIJKYgS3HCBezWZIAIxd-YBffkGYJ323493p9-Emfza6PhAV3A6r3X6aYXyC2YhY9DWaAveYTOXWpJ3FUY";
const privateKey = "LCnpuI-4lEaIhC2FBo4iB7Y_9e2TwBOAysxJcwDnl6I";

const publicKeyBuffer = Buffer.from(publicKey, "base64url");
const privateKeyBuffer = Buffer.from(privateKey, "base64url");

// VAPID uses an EC P-256 public key.
// The uncompressed public key is:
// 04 + X (32 bytes) + Y (32 bytes)

if (publicKeyBuffer.length !== 65) {
  throw new Error(
    `Expected a 65-byte uncompressed public key, got ${publicKeyBuffer.length} bytes`,
  );
}

const x = publicKeyBuffer.subarray(1, 33);
const y = publicKeyBuffer.subarray(33, 65);

const publicJwk = {
  kty: "EC",
  crv: "P-256",
  x: x.toString("base64url"),
  y: y.toString("base64url"),
};

const privateJwk = {
  ...publicJwk,
  d: privateKeyBuffer.toString("base64url"),
};

console.log("\nVAPID_PUBLIC_JWK:\n");
console.log(JSON.stringify(publicJwk));

console.log("\nVAPID_PRIVATE_JWK:\n");
console.log(JSON.stringify(privateJwk));
// VAPID_PUBLIC_JWK:

// {"kty":"EC","crv":"P-256","x":"1FI6QgkpiBLccIF7NZkgAjF35gF9-QZgnfbfj3en34Q","y":"mfza6PhAV3A6r3X6aYXyC2YhY9DWaAveYTOXWpJ3FUY"}

// VAPID_PRIVATE_JWK:

// {"kty":"EC","crv":"P-256","x":"1FI6QgkpiBLccIF7NZkgAjF35gF9-QZgnfbfj3en34Q","y":"mfza6PhAV3A6r3X6aYXyC2YhY9DWaAveYTOXWpJ3FUY","d":"LCnpuI-4lEaIhC2FBo4iB7Y_9e2TwBOAysxJcwDnl6I"}
