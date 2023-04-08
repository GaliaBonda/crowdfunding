import React, { useEffect, useState, useRef } from "react";
import { Modal } from "../Modal/Modal";
import "./campaign.css";

export const Campaign = ({ name, goal, amount, id, status, description, setCampaignsList }) => {
  const [isVisible, setVisible] = useState(false);
  const [modalIsShown, setModalIsShown] = useState(false);

  const campaignRef = useRef();

  const onClick = () => {
    if (status !== "active") return;
    setModalIsShown(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setVisible(entry.isIntersecting);
      });
    });
    const campaignElement = campaignRef.current;
    observer.observe(campaignElement);
    return () => observer.unobserve(campaignElement);
  }, [campaignRef]);

  return (
    <li
      ref={campaignRef}
      className={`campaign ${status === "fraud" ? "fraud" : ""} ${
        status === "successful" ? "successful" : ""
      }  ${status === "active" ? "active" : ""} ${
        isVisible ? "is-visible" : ""
      }`}
      onClick={onClick}
    >
      <div className="campaign-inner-wrapper">
        <h3 className="campaign-title">{name}</h3>
        <div>
          <p>Goal: ${goal}</p>
          <p>Raised: ${amount}</p>
        </div>
      </div>
      {description && <p>{description}</p>}
      {status === "fraud" && <span>fraud</span>}
      {modalIsShown && (
        <Modal
        campaignId={id}
          onClose={() => {
            setModalIsShown(false);
          }}
          setCampaignsList={setCampaignsList}
        />
      )}
    </li>
  );
};
