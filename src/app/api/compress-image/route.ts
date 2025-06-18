// src/app/api/compress-image/route.ts
import { NextRequest, NextResponse } from "next/server";

import { Collections } from "@/helpers/firestore/collections";
import admin from "firebase-admin";
import tinifySdk from "tinify/lib/tinify";
import tinifyType from "tinify";

// Firebase Admin initialization
interface ServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

if (!admin.apps.length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.GOOGLE_PROJECT_ID!,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL!,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Tinify configuration
tinifyType.key = process.env.TINIFY_API_KEY!;

export async function POST(req: NextRequest) {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers":
      "Authorization, Content-Type, X-Firebase-AppCheck",
  });

  try {
    // Verify Firebase Auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers,
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Verify user exists in Firestore
    const userEmail = decodedToken.email;
    if (!userEmail) {
      return new NextResponse(
        JSON.stringify({ error: "Email not found in token" }),
        { status: 401, headers }
      );
    }

    const userDoc = await admin
      .firestore()
      .collection(Collections.Usuarios)
      .doc(userEmail)
      .get();

    if (!userDoc.exists) {
      return new NextResponse(
        JSON.stringify({ error: "User not registered" }),
        { status: 403, headers }
      );
    }

    // Process file upload
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const source = tinifySdk.fromBuffer(buffer);
    const compressedBuffer = await source.toBuffer();

    headers.set("Content-Type", file.type);
    headers.set(
      "Content-Disposition",
      `inline; filename="compressed-${file.name}"`
    );

    return new NextResponse(compressedBuffer, { status: 200, headers });
  } catch (error: unknown) {
    console.error("Processing error:", error);

    // Handle specific errors
    if (error instanceof tinifyType.AccountError) {
      return new NextResponse(
        JSON.stringify({ error: "Tinify authentication failed" }),
        { status: 500 }
      );
    }
    if (error instanceof tinifyType.ClientError) {
      return new NextResponse(JSON.stringify({ error: "Invalid image file" }), {
        status: 400,
      });
    }
    if (error instanceof tinifyType.ServerError) {
      return new NextResponse(
        JSON.stringify({ error: "Tinify service unavailable" }),
        { status: 503 }
      );
    }

    // Handle Firebase errors
    if (error instanceof Error) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/id-token-expired") {
        return new NextResponse(JSON.stringify({ error: "Session expired" }), {
          status: 401,
        });
      }
      if (firebaseError.code === "auth/argument-error") {
        return new NextResponse(
          JSON.stringify({ error: "Invalid authentication" }),
          { status: 401 }
        );
      }
    }

    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
