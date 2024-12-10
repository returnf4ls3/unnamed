'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import Button from "../components/Button";

interface GameRecord {
  id: string;
  gameId: number;
  player1: string;
  player2: string;
  player1Score?: number;
  player2Score?: number;
  player1Votes?: number;
  player2Votes?: number;
  isCompleted?: boolean;
  gameTime: string;
  winner?: string;
  player1Image?: string;
  player2Image?: string;
};

const MatchManage = () => {
  const [matches, setMatches] = useState<GameRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMatch, setEditMatch] = useState<GameRecord | null>(null);
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
      const response = await axios.get("/api/image");
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

  const handleEditMatch = async () => {
    if (!editMatch) return;

    try {
      const updatedData = {
        player1: editMatch.player1,
        player2: editMatch.player2,
        gameTime: editMatch.gameTime,
        winner: editMatch.winner,
        isCompleted: editMatch.isCompleted,
        ...(editMatch.player1Score || editMatch.player1Score === 0) && { player1Score: editMatch.player1Score },
        ...(editMatch.player2Score || editMatch.player2Score === 0) && { player2Score: editMatch.player2Score },
        ...(editMatch.player1Votes || editMatch.player1Votes === 0) && { player1Votes: editMatch.player1Votes },
        ...(editMatch.player2Votes || editMatch.player2Votes === 0) && { player2Votes: editMatch.player2Votes },
      };
  
      const response = await axios.put(`/api/match/${editMatch.gameId}`, updatedData);
      if (response.data.success) {
        fetchMatches();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding match:", error);
    }

    try {
      const response = await axios.put(`/api/match/${editMatch.gameId}`, {
        ...editMatch,
      });
      if (response.data.success) {
        fetchMatches();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error editing match:", error);
    }
  };

  const handleDeleteMatch = async (gameId: number) => {
    try {
      const response = await axios.delete(`/api/match/${gameId}`);
      if (response.data.success) {
        setMatches((prev) => prev.filter((match) => match.gameId !== gameId));
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting match:", error);
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

        <Button label="경기 추가" onClick={() => setIsModalOpen(true)} size="medium" className="mb-6" />

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
                    <strong>승자:</strong> {match.winner || "미정"}
                  </p>
                  <p className="text-sm">
                    점수: {match.player1Score || 0} - {match.player2Score || 0}
                  </p>
                  <Button 
                    label="수정" 
                    onClick={() => {
                      setEditMatch(match);
                      setIsEditModalOpen(true);
                    }}
                    size="small"
                    className="ml-4 bg-yellow-500 hover:bg-yellow-600"
                  />
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
              <Button label="취소" onClick={() => setIsModalOpen(false)} variant="secondary" size="medium" />
              <Button label="추가" onClick={handleAddMatch} size="medium" />
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editMatch && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="text-lg font-bold mb-4">경기 수정</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="선수 1 이름"
                value={editMatch.player1}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev ? { ...prev, player1: e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="선수 2 이름"
                value={editMatch.player2}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev ? { ...prev, player2: e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="선수 1 점수"
                value={editMatch.player1Score || ""}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev ? { ...prev, player1Score: +e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="선수 2 점수"
                value={editMatch.player2Score || ""}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev ? { ...prev, player2Score: +e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="선수 1 투표"
                value={editMatch.player1Votes || ""}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev ? { ...prev, player1Votes: +e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="선수 2 투표"
                value={editMatch.player2Votes || ""}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev ? { ...prev, player2Votes: +e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              />
              <select
                value={editMatch.winner || ""}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev ? { ...prev, winner: e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">승자 선택</option>
                <option value={editMatch.player1}>{editMatch.player1}</option>
                <option value={editMatch.player2}>{editMatch.player2}</option>
              </select>
              <select
                value={editMatch.isCompleted ? "completed" : "inProgress"}
                onChange={(e) =>
                  setEditMatch((prev) =>
                    prev
                      ? { ...prev, isCompleted: e.target.value === "completed" }
                      : null
                  )
                }
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="inProgress">진행 중</option>
                <option value="completed">완료</option>
              </select>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <Button label="취소" onClick={() => setIsEditModalOpen(false)} variant="secondary" />
              <Button label="수정" onClick={handleEditMatch} />
              <Button label="삭제" onClick={() => handleDeleteMatch(editMatch.gameId)} variant="danger" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchManage;
