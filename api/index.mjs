import { createServer } from "node:http";
import { makeDb } from "./db.mjs";
import { markDonatorFraud } from "./services/donator.service.mjs";
import { addDonation } from "./services/donation.service.mjs";
import { prepare } from "./services/prepare.mjs";
import { getAllCampaigns } from "./services/campaign.service.mjs";

const db = makeDb();

try {
  await prepare(db);
  createCrowfundingServer();
} catch (err) {
} finally {
  await db.close();
}

createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "GET" && req.url === "/campaigns") {
    const dbConnection = makeDb();
    try {
      const allCampaigns = await getAllCampaigns(dbConnection);

      res.end(JSON.stringify(allCampaigns));
      return;
    } catch (error) {
      console.error(error);
    } finally {
      dbConnection.close();
    }
  }
  if (req.method === "POST" && req.url === "/donations") {
    const dbConnection = makeDb();
    try {
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();

      const parsedBody = JSON.parse(data);
      const newDonation = await addDonation(dbConnection, parsedBody);

      res.end(JSON.stringify(newDonation));
      return;
    } catch (error) {
      console.error(error);
    } finally {
      dbConnection.close();
    }
  }

    if (req.method === "POST" && req.url === "/fraud") {
      const dbConnection = makeDb();
      try {
        const buffers = [];
  
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
  
        const parsedBody = JSON.parse(data);
        console.log(parsedBody)
        await markDonatorFraud(dbConnection, parsedBody.username);
  
        res.end();
        return;
      } catch (error) {
        console.error(error);
      } finally {
        dbConnection.close();
      }
      return;
    }

  res.statusCode = 404;
  res.end("NOT FOUND");
}).listen(3001);
