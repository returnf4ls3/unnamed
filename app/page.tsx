'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

interface GameRecord {
  id: string;
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  gameTime: Date;
  winner?: string;
  isCompleted: boolean;
  player1Image?: string;
  player2Image?: string;
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        {record.player1Image ? (
                          <Image
                            src={record.player1Image}
                            alt={`${record.player1} profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="w-full h-full text-gray-400" />
                        )}
                      </div>
                      <span className="font-medium">{record.player1}</span>
                    </div>

                    <span className="font-bold text-gray-600">VS</span>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        {record.player2Image ? (
                          <Image
                            src={record.player2Image}
                            alt={`${record.player2} profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="w-full h-full text-gray-400" />
                        )}
                      </div>
                      <span className="font-medium">{record.player2}</span>
                    </div>
                  </div>

                  <span className="text-sm text-gray-500">
                    {new Date(record.gameTime).toLocaleString()}
                  </span>

                  <span className="font-medium text-lg">
                    {record.player1Score} : {record.player2Score}
                  </span>

                  <span className="text-sm">
                    승자: {record.winner || "데이터 없음"}
                  </span>

                  <span className="text-sm text-gray-600">
                    경기 상태: {record.isCompleted ? "완료됨" : "진행 중"}
                  </span>
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