import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 🚨 여기에  로드밸런서 주소를 넣으세요! (http:// 필수, 끝에 /api 빼고)
const API_URL = "http://a1174-prod-alb-1539031625.us-east-1.elb.amazonaws.com"; 

function App() {
  const [health, setHealth] = useState("Checking...");
  const [guests, setGuests] = useState([]);
  const [content, setContent] = useState("");

  // 1. 초기 로딩 시 헬스체크 & 방명록 불러오기
  useEffect(() => {
    checkHealth();
    fetchGuests();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/health`);
      setHealth(res.data);
    } catch (err) {
      setHealth("Backend connection failed 😢");
      console.error(err);
    }
  };

  const fetchGuests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/guests`);
      setGuests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;
    try {
      await axios.post(`${API_URL}/api/guests`, { content });
      setContent("");
      fetchGuests(); // 목록 갱신
    } catch (err) {
      alert("Failed to write guestbook");
    }
  };

  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      <h1>☁️ Cloud Infra Guestbook</h1>
      
      <div style={{ padding: "20px", background: "#f0f0f0", borderRadius: "10px" }}>
        <h3>Backend Status:</h3>
        <p style={{ color: health.includes("UP") ? "green" : "red", fontWeight: "bold" }}>
          {health}
        </p>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>✍️ Leave a message</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Hello AWS!"
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Submit</button>
      </form>

      <h3>📜 Messages</h3>
      <ul>
        {guests.map((guest) => (
          <li key={guest.id}>
            <strong>User:</strong> {guest.content} <span style={{fontSize:"0.8em", color:"gray"}}>({guest.createdAt})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;