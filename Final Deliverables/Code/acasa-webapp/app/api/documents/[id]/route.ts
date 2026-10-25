import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { ObjectId, GridFSBucket } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db  = await getDb();
    const resolvedParams = await Promise.resolve(params);
    const fileId = new ObjectId(resolvedParams.id);
    const bucket = new GridFSBucket(db, { bucketName: "documents" });

    // Retrieve file info (for content type and filename)
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    const fileInfo = files[0];

    // Open a download stream from GridFS
    const downloadStream = bucket.openDownloadStream(fileId);

    // Convert the Node.js stream to a web ReadableStream.
    let body: ReadableStream;
    if (typeof (downloadStream as any).toWeb === "function") {
      body = (downloadStream as any).toWeb();
    } else {
      body = new ReadableStream({
        start(controller) {
          downloadStream.on("data", (chunk) => {
            controller.enqueue(chunk);
          });
          downloadStream.on("end", () => {
            controller.close();
          });
          downloadStream.on("error", (err) => {
            console.error("Download stream error", err);
            controller.error(err);
          });
        },
      });
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": fileInfo.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${
          fileInfo.filename || "download"
        }"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/documents/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
