import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/profiles");

async function ensureUploadDir() {
    if (!(await fs.stat(uploadDir).catch(() => false))) {
        await fs.mkdir(uploadDir, { recursive: true });
    }
}

export async function POST(req: NextRequest) {
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
        return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.png`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ success: true, path: `/profiles/${filename}` });
}

export async function GET() {
    try {
        await ensureUploadDir();

        const files = await fs.readdir(uploadDir);
        const imagePaths = files.map((file) => `/profiles/${file}`);
        return new Response(JSON.stringify({ images: imagePaths }), { status: 200 });
    } catch (error) {
        console.error("Error reading files:", error);
        return new Response(JSON.stringify({ error: "Failed to read images" }), { status: 500 });
    }
}