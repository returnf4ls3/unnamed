'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

interface GameRecord {
  id: string;
  player1: string;
  player2: string;
  player1Score?: number;
  player2Score?: number;
  gameTime: string;
  winner: string;
  player1Image?: string;
  player2Image?: string;
}

const MatchManage = () => {
  const [matches, setMatches] = useState<GameRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({
    player1: "",
    player2: "",
    player1Score: undefined,
    player2Score: undefined,
    gameTime: "",
    winner: "",
    player1Image: "",
    player2Image: "",
  });
  const [profileImages, setProfileImages] = useState<string[]>([]);

  const fetchMatches = async () => {
    try {
      const response = await axios.post("/api/match", {});
      setMatches(response.data.data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchProfileImages = async () => {
    try {
      const response = await axios.get("/api/image"); // 선수 프로필 이미지 리스트 요청
      setProfileImages(response.data.images || []);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  const handleAddMatch = async () => {
    try {
      const response = await axios.put("/api/match", {
        ...newMatch,
      });
      if (response.data.success) {
        fetchMatches();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchProfileImages();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/image", formData);
      if (response.data.success) {
        fetchProfileImages();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-custom">
      <div className="w-full max-w-4xl p-6 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">경기 목록 관리</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          경기 추가
        </button>

        <div className="mt-4 space-y-4">
          {matches.length > 0 ? (
            matches.map((match) => (
              <div
                key={match.id}
                className="flex items-center p-4 bg-white rounded-md shadow-sm"
              >
                <div className="flex items-center">
                  {match.player1Image ? (
                    <Image
                      src={match.player1Image}
                      alt={`${match.player1}`}
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <FaUser className="w-12 h-12 text-gray-500" />
                  )}
                  <span className="ml-2 font-medium">{match.player1}</span>
                </div>

                <span className="mx-4 text-lg font-semibold">VS</span>

                <div className="flex items-center">
                  {match.player2Image ? (
                    <Image
                      src={match.player2Image}
                      alt={`${match.player2}`}
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <FaUser className="w-12 h-12 text-gray-500" />
                  )}
                  <span className="ml-2 font-medium">{match.player2}</span>
                </div>

                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(match.gameTime).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <strong>승자:</strong> {match.winner}
                  </p>
                  <p className="text-sm">
                    점수: {match.player1Score || 0} - {match.player2Score || 0}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">경기 기록이 없습니다.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="text-lg font-bold mb-4">새 경기 추가</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="선수 1 이름"
                value={newMatch.player1}
                onChange={(e) =>
                  setNewMatch((prev) => ({ ...prev, player1: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <div>
                <label className="block text-sm mb-2">선수 1 이미지 선택:</label>
                <div className="flex flex-wrap gap-2">
                  {profileImages.map((img) => (
                    <Image
                      key={img}
                      src={img}
                      alt="Profile"
                      width={50}
                      height={50}
                      className={`cursor-pointer rounded-md border ${
                        newMatch.player1Image === img
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() =>
                        setNewMatch((prev) => ({ ...prev, player1Image: img }))
                      }
                    />
                  ))}
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>
              <input
                type="text"
                placeholder="선수 2 이름"
                value={newMatch.player2}
                onChange={(e) =>
                  setNewMatch((prev) => ({ ...prev, player2: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <div>
                <label className="block text-sm mb-2">선수 2 이미지 선택:</label>
                <div className="flex flex-wrap gap-2">
                  {profileImages.map((img) => (
                    <Image
                      key={img}
                      src={img}
                      alt="Profile"
                      width={50}
                      height={50}
                      className={`cursor-pointer rounded-md border ${
                        newMatch.player2Image === img
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() =>
                        setNewMatch((prev) => ({ ...prev, player2Image: img }))
                      }
                    />
                  ))}
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>
              <input
                type="datetime-local"
                value={newMatch.gameTime}
                onChange={(e) =>
                  setNewMatch((prev) => ({ ...prev, gameTime: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <select
                value={newMatch.winner}
                onChange={(e) =>
                  setNewMatch((prev) => ({ ...prev, winner: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">승자 선택</option>
                <option value={newMatch.player1}>{newMatch.player1}</option>
                <option value={newMatch.player2}>{newMatch.player2}</option>
              </select>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleAddMatch}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchManage;
