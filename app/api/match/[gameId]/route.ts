import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    gameId: number;
}

export async function GET(req: NextRequest, { params }: { params: IParams }) {
    try {
        const gameId = params.gameId;

        const game = await prisma.gameRecord.findUnique({
            where: { gameId: Number(gameId) },
        });

        if (!game) {
            return NextResponse.json(
                { success: false, error: "Game not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: game });
        } catch (error) {
            console.error("Error fetching game:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch game" },
                { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: IParams }) {
    const id = params.gameId;

    console.log(id, req);

    try {
        const body = await req.json();

        const updatedMatch = await prisma.gameRecord.update({
            where: { gameId: Number(id) },
            data: {
                ...body,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true, data: updatedMatch });
    } catch (error) {
        console.error("Error updating match:", error);
        return NextResponse.json({ success: false, error: "Failed to update match" }, { status: 500 });
    }
}
  
export async function DELETE(req: NextRequest, { params }: { params: IParams }) {
try {
    const gameId = params.gameId;

    const game = await prisma.gameRecord.delete({
        where: { gameId: Number(gameId) },
    });

    return NextResponse.json({ success: true, data: game });
} catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
        { success: false, error: "Failed to delete game" },
        { status: 500 }
    );
}
}