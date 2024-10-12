import React, { useState, useRef, useEffect } from "react";
import "./index.css"; // Add this line to import the CSS

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (showTimer && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setShowTimer(false);
      setShowResult(true);
    }
    return () => clearInterval(interval);
  }, [showTimer, time]);

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowTimer(true);
        setTime(10);
        setShowResult(false); // Hide the result container
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <h1 style={styles.greeting}>Hello, What is your floorplan?</h1>
        <div style={styles.card}>
          <div style={styles.imageContainer} onClick={handleContainerClick}>
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" style={styles.image} />
            ) : (
              <p style={styles.placeholderText}>Click to select an image</p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={styles.hiddenInput}
            />
          </div>
          {showTimer && <div style={styles.timer}>{time}</div>}
          {showResult && (
            <div style={styles.resultContainer}>
              <p style={styles.resultTitle}>Характеристики планировки</p>
              <p style={styles.resultItem}>5 комнат</p>
              <p style={styles.resultItem}>55 м²</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f5f3ef",
  },
  contentContainer: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  greeting: {
    fontSize: "2rem",
    fontWeight: "normal",
    color: "#333",
    margin: "2rem 0", // Changed marginBottom to margin
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    width: "100%",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  question: {
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "1rem",
    textAlign: "center",
  },
  imageContainer: {
    width: "300px",
    height: "200px",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholderText: {
    color: "#666",
    textAlign: "center",
  },
  hiddenInput: {
    display: "none",
  },
  timer: {
    fontSize: "1.5rem",
    marginTop: "1rem",
  },
  resultContainer: {
    width: "300px", // Match the width of imageContainer
    padding: "1rem",
    marginTop: "1rem",
    fontSize: "1rem",
    borderRadius: "8px", // Match the borderRadius of imageContainer
    backgroundColor: "#f0f0f0",
    fontFamily: "'Raleway', sans-serif",
    textAlign: "center",
    color: "#333",
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  resultItem: {
    margin: "0.25rem 0",
  },
};
