import { addDonator, getAllDonatorsDonations, markDonatorFraud } from "./donator.service.mjs";
import { addCampaign } from "./campaign.service.mjs";
import { addDonation } from "./donation.service.mjs";

const donators = ["user1", "user2", "user3", "user4"];
const campaigns = [
  { name: "campaign1", description: "description", goal: 1000 },
  { name: "campaign2", description: "description", goal: 2000 },
  { name: "campaign3", description: "description", goal: 3000 },
  { name: "campaign4", description: "description", goal: 4000 },
  { name: "campaign5", description: "description", goal: 5000 },
  { name: "campaign6", description: "description", goal: 6000 },
  { name: "campaign7", description: "description", goal: 7000 },
  { name: "campaign8", description: "description", goal: 8000 },
  { name: "campaign9", description: "description", goal: 9000 },
  { name: "campaign10", description: "description", goal: 4000 },
  { name: "campaign11", description: "description", goal: 5000 },
  { name: "campaign12", description: "description", goal: 6000 },
  { name: "campaign13", description: "description", goal: 7000 },
  { name: "campaign14", description: "description", goal: 8000 },
  { name: "campaign15", description: "description", goal: 9000 },
];

export const prepare = async (db) => {
  db.query(
    "CREATE DATABASE IF NOT EXISTS crowdfunding",
    function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
    }
  );
  const donatorsTableCreationQuery = `CREATE TABLE IF NOT EXISTS donators (
        username VARCHAR(255) NOT NULL, 
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

  db.query(donatorsTableCreationQuery, function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
  });
  const campaignsTableCreationQuery = `CREATE TABLE IF NOT EXISTS campaigns (
        name VARCHAR(255) NOT NULL, 
        description VARCHAR(255),
        amount INT DEFAULT '0' NOT NULL, 
        goal INT, 
        status ENUM('active', 'fraud', 'successful') DEFAULT 'active' NOT NULL, 
        id VARCHAR(255) NOT NULL PRIMARY KEY, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
  db.query(campaignsTableCreationQuery, function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
  });

  const donationsTableCreationQuery = `CREATE TABLE IF NOT EXISTS donations ( 
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        amount INT NOT NULL,
        donator_id INT NOT NULL, 
        campaign_id VARCHAR(255) NOT NULL,
        state ENUM('valid', 'fraud') DEFAULT 'valid' NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        FOREIGN KEY (donator_id)
          REFERENCES donators (id)
          ON DELETE CASCADE,
        FOREIGN KEY (campaign_id)
          REFERENCES campaigns (id)
          ON DELETE CASCADE
        )`;

  db.query(donationsTableCreationQuery, function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    // db.end();
  });

  for (const donator of donators) {
    try {
      await addDonator(db, donator);
    } catch (error) {
      console.error(error);
    }
  }

  for (const campaign of campaigns) {
    try {
      await addCampaign(db, campaign);
      console.error(error);
    } catch (error) {}
  }

  try {
//   await addDonation(db, {amount: 300, username: 'user2', campaign_id: 'bc0a7d33-a427-47d4-ac82-cd16dc19f886'})
  // await getAllDonatorsDonations(db, '2');
  // await markDonatorFraud(db, 'user1');
    
  } catch (error) {
    console.error(error)
  }

//   db.end();
};
