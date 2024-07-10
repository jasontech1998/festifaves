import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  initiatePlaylistCreation,
  getPlaylistStatus,
} from "@/lib/optimized-playlist-generation";


export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { artists } = await request.json();
    const jobId = await initiatePlaylistCreation(artists, session.token);
    return NextResponse.json({ jobId });
  } catch (error) {
    console.error("Error initiating playlist creation:", error);
    return NextResponse.json(
      { error: "Failed to initiate playlist creation" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "No jobId provided" }, { status: 400 });
  }

  try {
    const status = await getPlaylistStatus(jobId);
    if (!status) {
      console.error(`No status found for jobId: ${jobId}`);
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error getting playlist status:", error);
    return NextResponse.json(
      { error: "Failed to get playlist status", details: error },
      { status: 500 }
    );
  }
}
