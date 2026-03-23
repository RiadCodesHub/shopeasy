
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { authOptions } from '@/lib/auth'


export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context : { params: Promise<{ orderId: string }>}
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    await connectToDatabase();

    const order = await Order.findOne({
      orderId: orderId,
      userId: session.user.id
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

     return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}