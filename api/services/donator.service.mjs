import { updateCampaignStatus } from "./campaign.service.mjs";

export const addDonator = async (db, username) => {
  const possibleExistingDonator = await getDonatorByName(db, username);
  if (possibleExistingDonator.length > 0) return;
  await addDonatorToDb(db, username);
  const newDonator = await db.query('SELECT * FROM donators where id = LAST_INSERT_ID()')
  return newDonator;
};

export const getDonatorByName = async (db, username) => {
  return await db.query(`SELECT * FROM donators WHERE username='${username}'`);
};

const addDonatorToDb = async (db, username) => {
  return await db.query("INSERT INTO donators (username) VALUES (?)", [
    username,
  ]);
};

const updateDonationState = async (db, donation_id, newState) => {
    const updateQuery = `
    UPDATE donations 
    SET 
        state = '${newState}'
    WHERE
        id = '${donation_id}';`
  return await db.query(updateQuery);
}

export const getAllDonatorsDonations = async (db, donator_id) => {
  const allDonationsQuery = `SELECT 
    username, 
    donators.id, 
    donations.donator_id, 
    donations.id as donation_id,
    donations.amount, 
    campaigns.id as campaign_id,
    campaigns.name 
  FROM donators
    LEFT JOIN donations ON 
    (donations.donator_id = donators.id)
    LEFT JOIN campaigns ON 
    (campaigns.id = donations.campaign_id)
    WHERE donators.id = ${donator_id}
  `;
//   WHERE username = ${username}
  const allDonations = await db.query(allDonationsQuery);
  return allDonations;
};

export const markDonatorFraud = async (db, username) => {
  const donator = (await getDonatorByName(db, username))?.[0];
  // console.log(donator)
    const allDonations = await getAllDonatorsDonations(db, donator.id);
    for (const donation of allDonations) {
        await updateCampaignStatus(db, donation.campaign_id, 'fraud');
        await updateDonationState(db, donation.donation_id, 'fraud');
    }
    return true;
}