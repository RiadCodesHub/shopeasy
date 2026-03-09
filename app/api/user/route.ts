import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { connectToDatabase } from "@/src/lib/mongodb";
import user from "@/src/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if(!session) {
            return NextResponse.json(
                {error: 'Not authenticated'},
                {status: 401},
            );
        }
        await connectToDatabase();

        const member = await user.findOne({
            email: session.user.email
        }).lean();

        if(!member) {
            return NextResponse.json(
                {error: "User Not Found"},
                {status: 500}
            )
        }
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            {error: "server error"},
            {status: 404}
        );
    }
}