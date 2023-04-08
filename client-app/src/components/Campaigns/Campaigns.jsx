import React, { useEffect, useState } from "react";
import { api } from "../../utils/constants";
import { Campaign } from "../Campaign/Campaign";
import "./campaigns.css";

export const Campaigns = () => {
  const [campaignsList, setCampaignsList] = useState([]);

  useEffect(() => {
    fetch(api.base + api.campaigns)
      .then((res) => res.json())
      .then((res) => setCampaignsList(res));
  }, []);

  return (
    <ul className="campaigns-list">
      {campaignsList.map(({ name, goal, amount, id, status, description }) => {
        return (
          <Campaign name={name} goal={goal} amount={amount} key={id} status={status} description={description} id={id} setCampaignsList={setCampaignsList}/>
        );
      })}
    </ul>
  );
};
