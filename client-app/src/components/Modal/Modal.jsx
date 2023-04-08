import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../../utils/constants";
import "./modal.css";

export const Modal = ({ onClose, campaignId, setCampaignsList }) => {
  const [formValue, setFormValue] = useState({ amount: 0, username: "" });
  const { amount, username } = formValue;
  const [errorTooltip, setErrorTooltip] = useState({
    username: false,
    amount: false,
  });

  const modalRef = useRef();

  const closeModal = (e) => {
    e.stopPropagation();
    if (modalRef?.current === e.target) onClose();
  };

  const onChange = (field) => {
    return (e) => {
      setErrorTooltip((prevError) => {
        return { ...prevError, [field]: false };
      });
      setFormValue((prev) => {
        return { ...prev, [field]: e.target.value };
      });
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const donate = e.target[1].value;
    const userNameValidation =
      username.match(/^[a-z0-9_ ]+$/gi) && username.length > 2;
    const donationSumValidation = +donate >= 0;
    if (!userNameValidation || !donationSumValidation) {
      if (!userNameValidation)
        setErrorTooltip((prev) => {
          return { ...prev, username: true };
        });
      if (!donationSumValidation) {
        setErrorTooltip((prev) => {
          return { ...prev, amount: true };
        });
      }
      return;
    }

    await fetch(api.base + api.donations, {
      method: "POST",
      body: JSON.stringify({ amount, username, campaign_id: campaignId }),
    });
    const updatedCampaigns = await fetch(api.base + api.campaigns).then((res) =>
      res.json()
    );
    setCampaignsList(updatedCampaigns);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "scroll");
  }, []);

  return document.body
    ? createPortal(
        <div className="modal-overlay" onMouseDown={closeModal} ref={modalRef}>
          <div className="modal-inner-wrapper">
            <form className="modal-form" onSubmit={onSubmit}>
              <label htmlFor="" className="modal-label">
                <span>Your nickname:</span>
                {errorTooltip.username && (
                  <span className="error-tooltip">Invalid username</span>
                )}
                <input
                  className={`modal-input ${
                    errorTooltip.username ? "modal-input--error" : ""
                  }`}
                  value={username}
                  onChange={onChange("username")}
                  placeholder="Donator nickname..."
                />
              </label>
              <label htmlFor="" className="modal-label">
                <span>Sum to donate:</span>
                {errorTooltip.amount && (
                  <span className="error-tooltip">Invalid donation sum</span>
                )}
                <input
                  className={`modal-input amount-input ${
                    errorTooltip.amount ? "modal-input--error" : ""
                  }`}
                  value={amount}
                  type="number"
                  onChange={onChange("amount")}
                />
              </label>
              <div className="buttons-wrapper">
                <button
                  className="modal-button"
                  onClick={(e) => {
                    // e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  Close
                </button>
                <button className="modal-button" type="submit">
                  Donate
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
};
