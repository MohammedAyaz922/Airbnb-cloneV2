import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ listingId: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { listingId } = await params; 
        if (!listingId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        let favoriteIds = [...(currentUser.favoriteIds || [])];

        if (!favoriteIds.includes(listingId)) {
            favoriteIds.push(listingId);
        }

        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: { favoriteIds },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("POST /api/favorites/[listingId] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ listingId: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { listingId } = await params;  
        if (!listingId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        let favoriteIds = [...(currentUser.favoriteIds || [])];
        favoriteIds = favoriteIds.filter((id) => id !== listingId);

        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: { favoriteIds },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("DELETE /api/favorites/[listingId] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
