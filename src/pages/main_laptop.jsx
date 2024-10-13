import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Icons from "../icons/Icons.jsx";
import "./main_laptop.scss";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ConnectPhonePopup from "../components/ConnectPhonePopup.jsx";

const Main = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleConnectPhone = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  async function sendImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        "http://localhost:5500/upload",
        formData
      );
      console.log(response.data);
      if (response.data && response.data.answer) {
        return response.data.answer;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("ERROR", err);
      throw err;
    }
  }

  const handleDrop = (acceptedFiles) => {
    const imageFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setSelectedImages(imageFiles);
    setLoading(true);
    setShowTable(false);

    Promise.all(imageFiles.map((file) => sendImage(file)))
      .then((results) => {
        setLoading(false);
        if (results[0]) {
          setResponseData(results[0]);
          setShowTable(true);
        } else {
          console.error("Invalid response format:", results[0]);
          setResponseData(null);
        }
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        setLoading(false);
        setResponseData(null);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleDrop,
  });

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo-section">
          <img src={Icons.bi_logo} alt="icon" className="icon" />
        </div>
        <button className="connect-button" onClick={handleConnectPhone}>Connect Phone</button>
      </div>

      <div className="content-container">
        <div className="analysis-container">
          <h2 className="container-title">Анализ</h2>
          <div {...getRootProps({ className: "upload-area" })}>
            <input {...getInputProps()} />
            {selectedImages.length > 0 ? (
              <img
                src={selectedImages[0].preview}
                alt="Uploaded"
                className="uploaded-image"
              />
            ) : (
              <span className="upload-text">Загрузите фото планировки...</span>
            )}
          </div>
          <button
            className="process-button"
            onClick={() =>
              selectedImages.length > 0
                ? handleDrop(selectedImages)
                : handleDrop([])
            }
            disabled={loading}
          >
            {loading ? "Обработка..." : "Обработать"}
          </button>
        </div>

        <div className="table-container">
          <h2 className="container-title">Таблица</h2>
            <div className="table-scroll-container">
                {loading && <div className="processing">Обработка...</div>}
                {showTable && responseData && !loading && (
                    <>
                <table className="data-table">
                    <div className="keys">
                        <div className="row gray">
                            <span className="tit">Кол-во комнат</span>
                            <div className="last">
                                <span className="key">{responseData.first_layer.total_rooms}</span>
                                <ContentCopyIcon className="copy" />
                            </div>
                        </div>
                        <div className="row">
                            <span className="tit">Кол-во жилых комнат</span>
                            <div className="last">
                                <span className="key">{responseData.first_layer.number_of_living_rooms}</span>
                                <ContentCopyIcon className="copy" />
                            </div>
                        </div>
                        <div className="row gray">
                            <span className="tit">Общ. площадь</span>
                            <div className="last">
                                <span className="key">{responseData.first_layer.total_area}</span>
                                <ContentCopyIcon className="copy" />
                            </div>
                        </div>
                        <div className="row">
                            <span className="tit">Жилая площадь</span>
                            <div className="last">
                                <span className="key">{responseData.first_layer.living_area}</span>
                                <ContentCopyIcon className="copy" />
                            </div>
                        </div>
                        <div className="row gray">
                            <span className="tit">Не жилая площадь</span>
                            <div className="last">
                                <span className="key">{responseData.first_layer.total_area - responseData.first_layer.living_area}</span>
                                <ContentCopyIcon className="copy" />
                            </div>
                        </div>
                        <div className="row">
                            <span className="tit">Кол-во санузлов</span>
                            <div className="last">
                                <span className="key">{responseData.second_layer.bathrooms}</span>
                                <ContentCopyIcon className="copy" />
                            </div>
                        </div>
                        <div className="row gray">
                            <span className="tit">Кол-во балконов</span>
                            <div className="last">
                                <span className="key">{responseData.second_layer.balcony}</span>
                                <ContentCopyIcon className="copy" />
                            </div>
                        </div>
                    </div>
                    </table>
                    <div className="room-list">
                        <h3>Список Комнат</h3>
                        <ul>
                            {responseData.first_layer.rooms_list.map((room, index) => (
                                <span className="tit" key={index}>{room}</span>
                            ))}
                        </ul>
                    </div>
                </>
                )}
            </div>
        </div>
      </div>

        <div className="footer">
            <div className="footer-item">
            <span className="footer-text">
                Вы можете загружать фото напрямую с телефона
            </span>
            <button className="footer-button-light">Подключить</button>
            </div>
            <div className="footer-item">
            <span className="footer-text">
                Вы можете менять порядок таблицы и поднимать нужные строки
            </span>
            <button className="footer-button-light">Редактировать</button>
            </div>
            <div className="footer-item">
            <span className="footer-text">
                Оцените качество сайта или расскажите про ошибки
            </span>
            <button className="footer-button-blue">Оценить</button>
            </div>
        </div>

        {showPopup && <ConnectPhonePopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Main;
