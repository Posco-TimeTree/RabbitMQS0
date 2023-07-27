import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  padding: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
`;

const TitleText = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const InputLabel = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
`;

const InputField = styled.input`
  width: 100%;
  height: 40px;
  font-size: 16px;
  padding: 8px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
`;
function MainPage() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);
  const [userName, setUserName] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [rankings, setRankings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleMultiply = () => {
    axios.post("/api/multiply", { num1, num2 })
      .then((response) => {
        const result = response.data.result;
        setResult(result);
      })
      .catch((error) => {
        console.error("Failed to perform multiplication:", error);
      });
  };

//   const handleCheckAnswer = () => {
//     // AJAX 통신으로 백엔드로 사용자의 이름과 답을 보냄
//     // 여기서는 실제 백엔드와 통신하지 않고, 답을 간단히 체크하여 결과를 출력
//     axios.post("http://localhost:8080/bpp1/answer", { userName, userAnswer })
//     .then((response) => {
//       const message = response.data;
//       setMessage(message);
//       alert(message)
//     })
//     .catch((error) => {
//       console.error("Failed to check answer:", error);
//     });
//   };
const handleCheckAnswer = () => {
    // AJAX 통신을 사용하여 사용자의 이름, 답, 그리고 문제 값들을 백엔드로 보냄
    // 여기서는 실제 백엔드와 통신하지 않고, 답을 간단히 체크하여 결과를 출력
    const multiplication = {
        factorA: num1, // 상태에서 factorA 값을 보냄
        factorB: num2, // 상태에서 factorB 값을 보냄
      };
    axios.post("http://192.168.0.97:8080/api/s1/quiz", {
    username: userName,
    multiplication: multiplication,
    userAnswer: userAnswer, // 상태에서 factorB 값을 보냄
    })
      .then((response) => {
        const message = response.data;
        setMessage(message);
        if(message)
            alert("정답입니다!");
        else{
            alert("다시 풀어보세요")
        }
      })
      .catch((error) => {
        console.error("Failed to check answer:", error);
      });
  };//test
  
  const handleGenerateProblem = () => {
    // Fetch the problem data from the URL
    axios.get("http://192.168.0.97:8080/api/s1/quiz")
      .then((response) => {
        const { factorA, factorB } = response.data;
        setNum1(factorA);
        setNum2(factorB);
        setResult(0);
        setUserAnswer("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Failed to generate problem:", error);
      });
  };
  const fetchRankings = () => {
    axios.get("http://192.168.0.74:8080/ranking/all")
      .then((response) => {
        setRankings(response.data);
        console.log(response)
      })
      .catch((error) => {
        console.error("Failed to fetch rankings:", error);
      });
  };

  useEffect(() => {
    if(showModal)
        fetchRankings();
  }, [showModal]);
  const RankingButton = styled(Button)`
  background-color: #28a745;
`;
    const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: ${props => (props.show ? "block" : "none")};
    z-index: 999;
    `;
    const ModalContent = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 16px;
    max-width: 480px;
    width: 100%;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  `;
  const toggleModal = () => {
    console.log(showModal);
    setShowModal(prev => !prev);
  };
  const handleModalClose = (e) => {
    e.stopPropagation(); // Prevent event propagation to the parent (modal overlay)
    setShowModal(false);
  };
  const sortedRankings = rankings.sort((a, b) => b.score - a.score);

  return (
    <Wrapper>
      <Container>
        <TitleText>구구단을 외우자</TitleText>
        <InputLabel>첫 번째 숫자</InputLabel>
        <InputField
          type="number"
          value={num1}
          onChange={(e) => setNum1(parseInt(e.target.value))}
        />
        <InputLabel>두 번째 숫자</InputLabel>
        <InputField
          type="number"
          value={num2}
          onChange={(e) => setNum2(parseInt(e.target.value))}
        />
        <Button onClick={handleGenerateProblem}>문제 주세요!</Button>
        <TitleText>정답 확인</TitleText>
        <InputLabel>이름</InputLabel>
        <InputField
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <InputLabel>답</InputLabel>
        <InputField
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(parseInt(e.target.value))}
        />
        <Button onClick={handleCheckAnswer}>정답 확인</Button>
        <p>{message}</p>
        <RankingButton onClick={toggleModal}>랭킹 확인</RankingButton>
        <ModalOverlay show={showModal} onClick={toggleModal}>
  <ModalContent>
    <TitleText>랭킹</TitleText>
    <ul>
      {sortedRankings.map((rank, index) => (
        <li key={index} style={{listStyle: "none", fontSize:20, lineHeight: 1.5}}>
          {`${index + 1}. ${rank.username} - ${rank.score}`}
        </li>
      ))}
    </ul>
    <Button onClick={handleModalClose}>닫기</Button>

  </ModalContent>
</ModalOverlay>
      </Container>
    </Wrapper>
  );
}

export default MainPage;
