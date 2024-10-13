import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./index.css";
import biLogo from "./bi_logo.png";

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [showTable, setShowTable] = useState(false);

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
          <img src={biLogo} alt="BI Group Logo" className="logo" />
        </div>
        <button className="connect-button">Connect Phone</button>
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
            {loading && (
              <div className="processing">Обработка...</div>
            )}
            {showTable && responseData && !loading && (
              <div>
                <h3>First Layer</h3>
                <p>
                  <strong>Number of Living Rooms:</strong>{" "}
                  {responseData.first_layer.number_of_living_rooms}
                </p>
                <p>
                  <strong>Total Rooms:</strong>{" "}
                  {responseData.first_layer.total_rooms}
                </p>
                <p>
                  <strong>Total Area:</strong>{" "}
                  {responseData.first_layer.total_area}
                </p>
                <p>
                  <strong>Living Area:</strong>{" "}
                  {responseData.first_layer.living_area}
                </p>

                <h3>Rooms List</h3>
                <ul>
                  {responseData.first_layer.rooms_list.map((room, index) => (
                    <li key={index}>{room}</li>
                  ))}
                </ul>

                <h3>Second Layer</h3>
                <p>
                  <strong>Bathrooms:</strong>{" "}
                  {responseData.second_layer.bathrooms}
                </p>
                <p>
                  <strong>Balcony:</strong>{" "}
                  {responseData.second_layer.balcony}
                </p>
              </div>
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
    </div>
  );
}

export default App;
