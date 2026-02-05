import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { sendMessageSchema, paginationSchema } from '@/lib/validations';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/messages/[conversationId] - Get messages in a conversation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { conversationId } = await params;
    const searchParams = req.nextUrl.searchParams;

    const pagination = paginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    });

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
    });

    if (!participant) {
      return forbiddenResponse('You are not a participant in this conversation');
    }

    // Get messages
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          conversationId,
          deletedAt: null,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.message.count({
        where: {
          conversationId,
          deletedAt: null,
        },
      }),
    ]);

    // Mark messages as read
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return paginatedResponse(
      messages.reverse(), // Return in chronological order
      {
        page: pagination.page,
        limit: pagination.limit,
        total,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/messages/[conversationId] - Send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { conversationId } = await params;
    const body = await req.json();

    const validatedFields = sendMessageSchema.safeParse({
      conversationId,
      ...body,
    });

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const { content, type, attachments } = validatedFields.data;

    // Verify conversation exists and user is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      return notFoundResponse('Conversation not found');
    }

    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.user.id
    );

    if (!isParticipant) {
      return forbiddenResponse('You are not a participant in this conversation');
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content,
        type,
        attachments,
        readBy: [session.user.id],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    });

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Update sender's last read
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      data: { lastReadAt: new Date() },
    });

    // Create notifications for other participants
    const otherParticipants = conversation.participants.filter(
      (p) => p.userId !== session.user.id
    );

    if (otherParticipants.length > 0) {
      await prisma.notification.createMany({
        data: otherParticipants.map((p) => ({
          userId: p.userId,
          type: 'NEW_MESSAGE' as const,
          title: 'New Message',
          message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          actionUrl: `/messages/${conversationId}`,
          data: { conversationId, messageId: message.id },
        })),
      });
    }

    return createdResponse(message);
  } catch (error) {
    return handleApiError(error);
  }
}
