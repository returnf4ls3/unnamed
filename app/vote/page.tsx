'use client';

import { useEffect, useState } from "react";
import Vote from "../components/Vote";
import axios from "axios";

interface GameRecord {
    id: string;
    gameId: number;
    player1: string;
    player2: string;
    player1Score?: number;
    player2Score?: number;
    gameTime: string;
    winner: string;
    player1Image?: string;
    player2Image?: string;
    isCompleted: boolean;
}

const VotePage = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
            const response = await axios.post("/api/match", {});
            if (response.data.success) {
                setGames(response.data.data);
            } else {
                console.error("Failed to fetch games");
            }
            } catch (error) {
            console.error("Error fetching games:", error);
            }
        };
        fetchGames();
    }, []);

return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-custom">
        <div className="w-full max-w-sm p-6 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">게임 투표</h1>
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">최근 경기 목록</h2>
                {games.length > 0 ? (
                <ul className="space-y-4">
                    {games.map((game: GameRecord) => (
                    <li
                        key={game.gameId}
                        className="flex flex-col p-4 bg-white rounded-md shadow-sm"
                    >
                        <h3 className="font-semibold">{game.player1} vs {game.player2}</h3>
                        <Vote
                            gameId={game.gameId}
                            player1={game.player1}
                            player2={game.player2}
                            isCompleted={game.isCompleted}
                        />
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-gray-500">최근 게임이 없습니다.</p>
                )}
            </div>
        </div>
    </div>
    );
};

export default VotePage;
