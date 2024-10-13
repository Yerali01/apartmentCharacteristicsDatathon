import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./index.css";
import biLogo from "./bi_logo.png";
import copyIcon from "./copy.png"; // Make sure to add this image to your project
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// New component for room list
const RoomList = ({ rooms }) => (
  <ul className="room-list">
    {rooms.map((room, index) => (
      <li key={index}>{room}</li>
    ))}
  </ul>
);

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [showPopups, setShowPopups] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [responseData, setResponseData] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([
    { id: "total_rooms", label: "Кол-во комнат", key: "total_rooms" },
    { id: "area", label: "Общ. площадь", key: "area" },
    { id: "area", label: "Жилая площадь", key: "area" },
    {
      id: "non_living_area",
      label: "Не жилая площадь",
      key: "non_living_area",
    },
    { id: "bathrooms_count", label: "Кол-во санузлов", key: "bathrooms_count" },
    { id: "bathrooms_count", label: "Кол-во балконов", key: "balcony_count" },
    { id: "kitchen_studio", label: "Кухня-студия", key: "kitchen_studio" },
  ]);

  async function sendImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        "http://localhost:5500/upload",
        formData
      );
      if (
        response.data &&
        response.data.answer &&
        response.data.answer.first_layer
      ) {
        setResponseData(response.data.answer.first_layer);
        return response.data;
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
    setShowResult(false);
    setShowTable(false);
    setTimer(7); // Changed from 10 to 7

    Promise.all(imageFiles.map((file) => sendImage(file)))
      .then((results) => {
        setLoading(false);
        setShowResult(true);
        if (results[0] && results[0].answer && results[0].answer.first_layer) {
          setResult(results[0]);
          setResponseData(results[0].answer.first_layer);
        } else {
          console.error("Invalid response format:", results[0]);
          setResult(null);
          setResponseData(null);
        }
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        setLoading(false);
        setResult(null);
        setResponseData(null);
      });
  };

  useEffect(() => {
    let interval;
    if (timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowTable(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleDrop,
  });

  const handleConnectPhoneClick = () => {
    setShowPopups(true);
  };

  const handleClosePopups = () => {
    setShowPopups(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(tableData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTableData(items);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Optionally, you can show a tooltip or some feedback that the text was copied
        console.log("Copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo-section">
          <img src={biLogo} alt="BI Group Logo" className="logo" />
          {/* <button className="layout-button">Layout Reader</button> */}
        </div>
        <button className="connect-button">Connect Phone</button>
      </div>
      {showPopups && (
        <div className="popup-container">
          <div className="popup-left">
            <img src="path_to_qr_code.png" alt="QR Code" className="qr-code" />
            <div className="bottom-content">
              <p className="popup-text-left">
                Просканируйте QR через камеру для авторизации
              </p>
              <button className="close-button-left" onClick={handleClosePopups}>
                Закрыть <span className="arrow-icon">▶</span>
              </button>
            </div>
          </div>
          <div className="popup-right">
            <h2 className="code-text">DH55FV52</h2>
            <div className="bottom-content">
              <p className="popup-text-right">
                Введите код на мобильной версии веб-сайта
              </p>
              <button
                className="close-button-right"
                onClick={handleClosePopups}
              >
                Закрыть <span className="arrow-icon">▶</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
          {timer !== null && timer > 0 && (
            <div className="timer">Обработка... {timer}с</div>
          )}
          <div className="table-scroll-container">
            {showTable && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="table">
                  {(provided) => (
                    <table
                      className="table"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <tbody>
                        {tableData.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${
                                  index % 2 === 0 ? "even-row" : "odd-row"
                                } ${snapshot.isDragging ? "dragging" : ""}`}
                              >
                                <td className="label-cell">{item.label}</td>
                                <td className="copy-cell">
                                  <img
                                    src={copyIcon}
                                    alt="Copy"
                                    className="copy-icon"
                                    onClick={() =>
                                      copyToClipboard(
                                        responseData
                                          ? responseData[item.key] || ""
                                          : ""
                                      )
                                    }
                                  />
                                </td>
                                <td className="value-cell">
                                  <input
                                    type="text"
                                    className="table-input"
                                    readOnly
                                    value={
                                      responseData
                                        ? responseData[item.key] || ""
                                        : ""
                                    }
                                    placeholder="------------------------"
                                  />
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
          {responseData && responseData.rooms_list && (
            <div className="room-list-container">
              <h3>Список комнат</h3>
              <div className="room-list-scroll">
                <RoomList rooms={responseData.rooms_list} />
              </div>
            </div>
          )}
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
