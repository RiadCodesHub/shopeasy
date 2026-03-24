import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { authOptions } from "@/lib/auth";


export const dynamic = 'force-dynamic';

export async function GET(request : NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if(!session) {
            return NextResponse.json(
                {error: 'You must be logged in'},
                {status : 401}
            );
        }

        await connectToDatabase();

        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const orders = await Order.find({userId: session.user.id})
               .sort({createdAt: -1})
               .skip(skip)
               .limit(limit);

        const totalOrders = await Order.countDocuments({userId: session.user.id});

        return NextResponse.json({
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasMore: skip + orders.length < totalOrders
            }
        });
    } catch (error) {
        console.error('Error fetching ordres: ', error)
        return NextResponse.json(
            {error: 'Failed to fetch orders'},
            {status : 500}
        )
    } 
}

export async function POST(request : NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if(!session) {
            return NextResponse.json(
                {error: 'You must be logged in'},
                {status: 401}
            );
        }
        const data = await request.json();
        await connectToDatabase();

        const orderId = `SHOP-${Date.now()}-${Math.random().toString(36).substring(2,9)}`;
        const userId = (session.user as any)?.id;

        if (!userId) {
          return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
           }
        console.log("Creating order for:", userId);


        const order = await Order.create({
            orderId,
            userId: userId,
            ...data,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json(order, {status: 201});
    } catch (error) {
        console.error('Error creating order: ', error)
        return NextResponse.json(
            {error: 'Failed to create order'},
            {status: 500}
        )
    }
}