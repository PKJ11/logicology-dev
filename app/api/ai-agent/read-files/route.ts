import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/**
 * Read files from a directory and return their content
 * GET /api/ai-agent/read-files?dir=path/to/directory
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dirPath = searchParams.get("dir");

    if (!dirPath) {
      return NextResponse.json({ error: "Directory path is required" }, { status: 400 });
    }

    // Validate path - only allow reads from specific directories for security
    const allowedPaths = ["D:\\Downloads\\ai project", "D:/Downloads/ai project"];

    const normalizedPath = path.normalize(dirPath);
    const isAllowed = allowedPaths.some((allowed) =>
      normalizedPath.toLowerCase().includes(path.normalize(allowed).toLowerCase())
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Access to this directory is not allowed" },
        { status: 403 }
      );
    }

    // Check if directory exists
    if (!fs.existsSync(normalizedPath)) {
      return NextResponse.json({ error: "Directory not found" }, { status: 404 });
    }

    // Read all files from directory
    const files = fs.readdirSync(normalizedPath);
    const fileContents: Record<string, string> = {};

    for (const file of files) {
      const filePath = path.join(normalizedPath, file);
      const stats = fs.statSync(filePath);

      // Only read files, not directories
      if (stats.isFile()) {
        try {
          // Support common text file formats
          const ext = path.extname(file).toLowerCase();
          if (
            [
              ".txt",
              ".md",
              ".json",
              ".csv",
              ".xml",
              ".html",
              ".js",
              ".ts",
              ".py",
              ".java",
            ].includes(ext)
          ) {
            const content = fs.readFileSync(filePath, "utf-8");
            fileContents[file] = content;
          }
        } catch (err) {
          console.error(`Error reading file ${file}:`, err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      directory: normalizedPath,
      files: Object.keys(fileContents),
      contents: fileContents,
      count: Object.keys(fileContents).length,
    });
  } catch (error: any) {
    console.error("Error reading files:", error);
    return NextResponse.json({ error: error.message || "Failed to read files" }, { status: 500 });
  }
}
