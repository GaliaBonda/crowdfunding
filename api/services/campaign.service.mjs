import crypto from "crypto";

export const addCampaign = async (db, campaign) => {
  const { name, description, goal } = campaign;
  const possibleExistingCampaign = await getCampaignByName(db, name);
  if (possibleExistingCampaign.length > 0) return;
  await db.query(`SELECT * FROM campaigns WHERE name='${name}'`);

  const id = crypto.randomUUID();
  return await db.query(
    "INSERT INTO campaigns (name, description, goal, id) VALUES (?, ?, ?, ?)",
    [name, description, goal, id]
  );
};

export const getAllCampaigns = async (db, name) => {
  return await db.query(`SELECT * FROM campaigns`);
};

const getCampaignByName = async (db, name) => {
  return await db.query(`SELECT * FROM campaigns WHERE name='${name}'`);
};

export const getCampaignById = async (db, id) => {
  return await db.query(`SELECT * FROM campaigns WHERE id='${id}'`);
};

export const updateCampaignAmount = async (db, campaign_id, newAmount) => {
    const updateQuery = `
    UPDATE campaigns 
    SET 
        amount = '${newAmount}'
    WHERE
        id = '${campaign_id}';`
  return await db.query(updateQuery);
};

export const updateCampaignStatus = async (db, campaign_id, newStatus) => {
    const updateQuery = `
    UPDATE campaigns 
    SET 
        status = '${newStatus}'
    WHERE
        id = '${campaign_id}';`
  return await db.query(updateQuery);
};
