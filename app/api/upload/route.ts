import { MAX_FILE_SIZE } from "@/lib/contants";

import { auth } from "@clerk/nextjs/server";

import { handleUpload, HandleUploadBody } from "@vercel/blob/client";

import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth();
        if (!userId) {
          throw new Error("Unauthorized User");
        }
        return {
          allowedContentTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_FILE_SIZE,
          tokenPayload: JSON.stringify({ userId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Uploaded file to Blob Storage:", blob);

        const payload = tokenPayload ? JSON.parse(tokenPayload) : null;
        const userId = payload?.userId;
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    console.error("Error during file upload:", error);
    const clientMessage =
      status === 401
        ? "Unauthorized. Please log in."
        : "File upload failed. Please try again.";
    return NextResponse.json({ error: clientMessage }, { status });
  }
}
