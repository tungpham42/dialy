import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button, Container, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faStar,
  faRedo,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import questions from "../data/questions";

const ClickMarker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

const Game = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPos, setSelectedPos] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); // For correct/incorrect status

  const currentQuestion = questions[questionIndex];

  const checkAnswer = () => {
    if (!selectedPos) return;

    const { lat, lng } = selectedPos;
    const [ansLat, ansLng] = currentQuestion.answer;
    const distance = Math.sqrt((lat - ansLat) ** 2 + (lng - ansLng) ** 2);

    // New difficulty adjustments
    const maxDistance = 0.5; // Reduced threshold for correctness (more difficult)
    const scoreMultiplier = Math.max(0, 2 - distance); // Higher multiplier for closer answers

    // If the distance is smaller than the threshold, increment the score with a multiplier
    if (distance < maxDistance) {
      setScore((prevScore) => prevScore + Math.floor(scoreMultiplier));
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }

    setShowResult(true);
  };

  const formatGeoLocationWithDirection = (latitude, longitude) => {
    const latDirection = latitude >= 0 ? "Bắc" : "Nam";
    const lonDirection = longitude >= 0 ? "Đông" : "Tây";

    return `${Math.abs(latitude).toFixed(4)}° ${latDirection}, ${Math.abs(
      longitude
    ).toFixed(4)}° ${lonDirection}`;
  };

  const nextQuestion = () => {
    setSelectedPos(null);
    setShowResult(false);
    setAnswerStatus(null); // Reset answer status for next question
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setQuestionIndex(0);
    setScore(0);
    setGameOver(false);
    setAnswerStatus(null); // Reset answer status
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h3>
            <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
            {currentQuestion.question}
          </h3>
          <p>
            <FontAwesomeIcon icon={faStar} className="me-2" />
            Điểm: {score}
          </p>

          {gameOver && (
            <Alert variant="success">
              Trò chơi kết thúc! Điểm của bạn là:{" "}
              <b>
                {score}/{questions.length}
              </b>
              <Button variant="primary" className="ms-2" onClick={resetGame}>
                <FontAwesomeIcon icon={faRedo} className="me-2" />
                Chơi lại
              </Button>
            </Alert>
          )}

          {!gameOver && (
            <>
              <MapContainer
                center={[16.5, 107.5]}
                zoom={5}
                style={{ height: "420px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ClickMarker onSelect={setSelectedPos} />
                {selectedPos && <Marker position={selectedPos} />}
              </MapContainer>

              {showResult ? (
                <>
                  <Alert
                    variant={answerStatus === "correct" ? "success" : "danger"}
                  >
                    {answerStatus === "correct"
                      ? "Đáp án đúng!"
                      : "Đáp án sai!"}{" "}
                    Đáp án là:{" "}
                    {formatGeoLocationWithDirection(
                      currentQuestion.answer[0],
                      currentQuestion.answer[1]
                    )}
                  </Alert>
                  <Button onClick={nextQuestion} variant="success">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                    Câu tiếp theo
                  </Button>
                </>
              ) : (
                <Button
                  onClick={checkAnswer}
                  disabled={!selectedPos}
                  className="my-3"
                >
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Kiểm tra đáp án
                </Button>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Game;
