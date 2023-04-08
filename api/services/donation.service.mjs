import {
  getCampaignById,
  updateCampaignAmount,
  updateCampaignStatus,
} from "./campaign.service.mjs";
import { addDonator, getDonatorByName } from "./donator.service.mjs";

export const addDonation = async (db, donation) => {
  let donator_id;
  const { amount, username, campaign_id } = donation;

  // English letters, digits, and underscores
  if (!username.match(/^[a-z0-9_ ]+$/gi)) throw new Error("username invalid");
  const campaign = await getCampaignById(db, campaign_id);

  if (!campaign.length) throw new Error("no such campaign");

  const donator = await getDonatorByName(db, username);
  donator_id = donator[0]?.id;
  
  if (!donator_id) {
    const newDonator = (await addDonator(db, username))?.[0];
    donator_id = newDonator?.id;
  }

  const newDonation = await addDonationToDb(db, {
    amount,
    donator_id,
    campaign_id,
  });
  
  return newDonation;
};

const addDonationToDb = async (db, donation) => {
  const { amount, donator_id, campaign_id } = donation;
  await db.query(
    `INSERT INTO donations (amount, donator_id, campaign_id) VALUES (?, ?, ?);
    `,
    [amount, donator_id, campaign_id]
  );

  const newDonation = await db.query('SELECT * FROM donations where id = LAST_INSERT_ID()');

  const campaign = (await getCampaignById(db, campaign_id))?.[0];

  await updateCampaignAmount(db, campaign_id, +campaign.amount + +amount);
  const updatedCampaign = (await getCampaignById(db, campaign_id))?.[0];

  if (updatedCampaign.amount >= updatedCampaign.goal) {
    await updateCampaignStatus(db, campaign_id, "successful");
  }

  return newDonation;
};

