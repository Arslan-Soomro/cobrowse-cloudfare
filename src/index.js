/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const jwt = require("jsonwebtoken");
const fs = require("fs");

export default {
  async fetch(request, env, ctx) {
    const email = "team@usetour.com";
    const licenseKey =  "quGBhRTXlDPITg"; // process.env.COBROWSE_LICENSE;
 
    const privateKey = await fs.readFileSync("./cobrowse-private-key.pem");
    const token = await jwt.sign(
      {
        displayName: "Team Tour",
        role: "agent",

        /* Use this or just options
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expires in 1 hour
      aud: "https://cobrowse.io",
      iss: licenseKey,
      sub: email,
      */
      },
      privateKey,
      {
        expiresIn: "1h",
        issuer: licenseKey,
        subject: email,
        audience: "https://cobrowse.io",
        algorithm: "RS256",
      }
    );
    console.log("Generated Token: ", token);
    return new Response({ token: token });
  },
};
