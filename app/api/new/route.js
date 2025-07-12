import _db from "../../../utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await _db();
        return NextResponse.json({ message: "MongoDB connected successfully" });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return NextResponse.json({ error: "MongoDB connection error" }, { status: 500 });
    }
}