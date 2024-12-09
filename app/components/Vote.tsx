"use client";

import React, { useState } from "react";
import axios from "axios";

interface VoteProps {
    gameId: number;
    player1: string;
    player2: string;
    isCompleted: boolean;
  }

const Vote = ({ gameId, player1, player2, isCompleted }: VoteProps) => {
  const [message, setMessage] = useState<string | null>(null);

    const handleVote = async (player: "player1" | "player2") => {
        try {
            const response = await axios.post("/api/vote", { gameId, player });
        if (response.data.success) {
            setMessage(`투표 성공! ${player === "player1" ? player1 : player2}에게 투표했습니다.`);
        } else {
            setMessage("투표에 실패했습니다. 다시 시도해주세요.");
        }
        } catch (error) {
            console.error("Error voting:", error);
            setMessage("투표 중 에러가 발생했습니다.");
        }
    };

    return (
        <div className="p-6 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">투표하기</h2>
            <div className="flex justify-between">
            <button
                onClick={() => handleVote("player1")}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isCompleted}
            >
                {player1} 투표
            </button>
            <button
                onClick={() => handleVote("player2")}
                className={`px-4 py-2 bg-red-500 text-white rounded-md ${isCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isCompleted}
            >
                {player2} 투표
            </button>
            </div>
            {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default Vote;
