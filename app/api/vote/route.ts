import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const { gameId, player } = await req.json();

    if (!gameId || !player || (player !== "player1" && player !== "player2")) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const gameRecord = await prisma.gameRecord.findUnique({
        where: { gameId },
    });

    if (!gameRecord) {
        return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    if (gameRecord.isCompleted) {
        return NextResponse.json({ success: false, error: "Voting is not allowed for completed games" }, { status: 400 });
      }

    const updatedGame = await prisma.gameRecord.update({
      where: { gameId },
      data: {
        [player === "player1" ? "player1Votes" : "player2Votes"]: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedGame });
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json({ success: false, error: "Failed to vote" }, { status: 500 });
  }
}
