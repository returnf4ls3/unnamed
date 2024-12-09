'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";

interface GameRecord {
  id: string;
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  gameTime: Date;
  winner: string;
}

const Home = () => {
  const [recentRecords, setRecentRecords] = useState<GameRecord[]>([]);

  const fetchRecentRecords = async () => {
    try {
      const response = await axios.post("/api/match", {
        count: 5,
      });
      setRecentRecords(response.data.data || []);
    } catch (error) {
      console.error("Error fetching recent records:", error);
    }
  };

  useEffect(() => {
    fetchRecentRecords();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-custom">
      <div className="w-full max-w-sm p-6 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">메인 홈</h1>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">최근 경기 기록</h2>
          {recentRecords.length > 0 ? (
            <ul className="space-y-2">
              {recentRecords.map((record) => (
                <li
                  key={record.id}
                  className="flex flex-col p-4 bg-white rounded-md shadow-sm"
                >
                  <span className="text-sm text-gray-500">
                    {new Date(record.gameTime).toLocaleString()}
                  </span>
                  <span className="font-medium">
                    {record.player1} ({record.player1Score}) vs {record.player2} (
                    {record.player2Score})
                  </span>
                  <span>승자: {record.winner}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">최근 기록이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;