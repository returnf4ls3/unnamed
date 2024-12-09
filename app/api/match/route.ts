import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { count } = body || {};

    const matches = await prisma.gameRecord.findMany({
      orderBy: { createdAt: "desc" },
      take: count || undefined,
    });

    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch matches" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
      const body = await req.json();

      const { player1, player2, gameTime } = body;
      if (!player1 || !player2 || !gameTime) {
          return NextResponse.json(
              { success: false, error: "Missing required fields" },
              { status: 400 }
          );
      }

      const lastGame = await prisma.gameRecord.findFirst({
        orderBy: { gameId: "desc" },
      });
      const nextGameId = lastGame ? lastGame.gameId + 1 : 1;

      const newMatch = await prisma.gameRecord.create({
          data: {
              player1,
              player2,
              gameId: nextGameId,
              gameTime: new Date(gameTime),
              winner: body.winner || null,
              player1Score: body.player1Score || 0,
              player2Score: body.player2Score || 0,
              player1Image: body.player1Image || null,
              player2Image: body.player2Image || null,
          },
      });

      return NextResponse.json({ success: true, data: newMatch });
  } catch (error) {
      const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error adding match:", errorMessage);

      return NextResponse.json(
          { success: false, error: "Failed to add match" },
          { status: 500 }
      );
  }
}

export async function UPDATE(req: NextRequest) {
  try {
    const { gameId, player1Score, player2Score, winner, isCompleted, player1Votes, player2Votes } = await req.json();

    if (!gameId || player1Score === undefined || player2Score === undefined || !winner || isCompleted === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existingGame = await prisma.gameRecord.findUnique({
      where: { gameId },
    });

    if (!existingGame) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    const updatedGame = await prisma.gameRecord.update({
      where: { gameId },
      data: {
        player1Score,
        player2Score,
        winner,
        isCompleted,
        player1Votes,
        player2Votes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: updatedGame });
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json({ success: false, error: "Failed to update match" }, { status: 500 });
  }
}