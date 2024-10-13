import React from "react";
import "./popup.scss";
import Icons from "../icons/Icons";


const ConnectPhonePopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
        <div className="popup-container">
            <div className="popup-left">
                <div className="qr-code-placeholder">
                    <img src={Icons.qr} alt="icon" className="qr" />
                </div>
                <p>Просканируйте QR через камеру для авторизации</p>
                <button onClick={onClose}>Закрыть</button>
                <span className="triangle-icon"></span>
            </div>
            <div className="popup-right">
                <h2>DH55FV52</h2>
                <p>Введите код на мобильной версии веб-сайта</p>
                <button onClick={onClose}>Закрыть</button>
                <span className="triangle-icon"></span>
            </div>
        </div>
    </div>
  );
};

export default ConnectPhonePopup;