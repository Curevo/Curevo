import React from "react";
import "../Delivery.css"

export default function FormationStatus() {
  return (
    <div className="formation-status card-dark">
      <div className="status-label">Delivery Status</div>
      <div className="status-title">Out for Delivery</div>
      <div className="progress-bar-wrapper">
        <div className="progress-bar-fill" style={{ width: "80%" }}></div>
      </div>
      <div className="status-estimate">
      Estimated Delivery: <br />
        <strong>20–25 mins</strong>
      </div>
      <button className="button-light">Mark Delivered</button>
    </div>
  );
}
