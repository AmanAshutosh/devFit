import React from "react";
import "./DisclaimerModal.css";

const DisclaimerModal = ({ onAccept, onCancel }) => (
  <div className="disclaimer-overlay">
    <div className="disclaimer-modal">
      <div className="disclaimer-icon">⚠️</div>
      <h2 className="disclaimer-title">Health & Safety Disclaimer</h2>
      <p className="disclaimer-subtitle">
        Please read carefully before proceeding
      </p>

      <div className="disclaimer-body">
        <ul className="disclaimer-list">
          <li>
            <strong>Not Medical Advice:</strong> These plans are not substitutes
            for professional medical advice, diagnosis, or treatment.
          </li>
          <li>
            <strong>No Responsibility:</strong> DevFit does not take
            responsibility for injuries, health issues, or damages arising from
            use of these plans.
          </li>
          <li>
            <strong>Consult Professionals:</strong> Always consult qualified
            healthcare providers before starting any fitness or diet program.
          </li>
          <li>
            <strong>Personal Responsibility:</strong> You are solely responsible
            for your health and safety throughout any program.
          </li>
          <li>
            <strong>Individual Results May Vary:</strong> Results depend on
            genetics, consistency, diet, and existing health conditions.
          </li>
        </ul>

        <div className="disclaimer-note">
          <strong>Important Note:</strong> These plans are for general guidance
          only. What works for one person may not work for another. Always
          listen to your body and stop if you experience pain or discomfort.
        </div>
      </div>

      <p className="disclaimer-consent">
        By clicking <strong>"I Understand & Accept All Terms"</strong>, you
        agree to this disclaimer and acknowledge DevFit's terms of use.
      </p>

      <div className="disclaimer-actions">
        <button className="btn btn-accent disclaimer-accept" onClick={onAccept}>
          I Understand & Accept All Terms
        </button>
        <button className="btn btn-ghost disclaimer-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default DisclaimerModal;
