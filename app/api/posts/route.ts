import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/shared/firebaseConfig";
import {
    collection,
    query,
    orderBy,
    limit,
    where,
    getDocs,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    startAfter,
} from "firebase/firestore";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limitNum = parseInt(searchParams.get("limit") || "10");
        const page = parseInt(searchParams.get("page") || "1");
        const zipCode = searchParams.get("zipCode");

        // Create base query
        let q = query(
            collection(firestore, "posts"),
            orderBy("createdAt", "desc"),
            limit(limitNum)
        );

        // Add zip code filter if provided
        if (zipCode) {
            q = query(q, where("zip", "==", zipCode));
        }

        // Handle pagination
        if (page > 1) {
            const lastVisible = await getDocs(
                query(
                    collection(firestore, "posts"),
                    orderBy("createdAt", "desc"),
                    limit((page - 1) * limitNum)
                )
            );
            const lastDoc = lastVisible.docs[lastVisible.docs.length - 1];
            q = query(q, startAfter(lastDoc));
        }

        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Get total count for pagination
        const totalSnapshot = await getDocs(collection(firestore, "posts"));
        const total = totalSnapshot.size;

        return NextResponse.json({
            posts,
            pagination: {
                total,
                pages: Math.ceil(total / limitNum),
                current: page,
            },
        });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.title || !data.location) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Add metadata
        const post = {
            ...data,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        // Create post
        const docRef = await addDoc(collection(firestore, "posts"), post);

        return NextResponse.json({
            id: docRef.id,
            ...post,
        });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json(
            { error: errorMessage },
            { status: errorMessage === "Unauthorized" ? 401 : 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
        }

        // Verify ownership
        const postRef = doc(firestore, "posts", id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Update post
        await updateDoc(postRef, {
            ...updateData,
            updatedAt: Date.now(),
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json(
            { error: errorMessage },
            { status: errorMessage === "Unauthorized" ? 401 : 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
        }

        // Verify ownership
        const postRef = doc(firestore, "posts", id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Delete post
        await deleteDoc(postRef);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json(
            { error: errorMessage },
            { status: errorMessage === "Unauthorized" ? 401 : 500 }
        );
    }
}
