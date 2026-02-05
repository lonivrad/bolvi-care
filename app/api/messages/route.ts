import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createConversationSchema, sendMessageSchema, paginationSchema } from '@/lib/validations';
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

// GET /api/messages - List conversations for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const searchParams = req.nextUrl.searchParams;
    const pagination = paginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    // Get conversations where user is a participant
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                  role: true,
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: 'desc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.conversation.count({
        where: {
          participants: {
            some: {
              userId: session.user.id,
            },
          },
        },
      }),
    ]);

    // Calculate unread count for each conversation
    const conversationsWithUnread = conversations.map((conv) => {
      const userParticipant = conv.participants.find(
        (p) => p.userId === session.user.id
      );
      const lastReadAt = userParticipant?.lastReadAt;
      const lastMessage = conv.messages[0];
      const hasUnread = lastMessage && lastReadAt
        ? new Date(lastMessage.createdAt) > new Date(lastReadAt)
        : !!lastMessage;

      return {
        id: conv.id,
        type: conv.type,
        participants: conv.participants
          .filter((p) => p.userId !== session.user.id)
          .map((p) => ({
            id: p.user.id,
            name: p.user.name,
            photo: p.user.photo,
            role: p.user.role,
          })),
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              createdAt: lastMessage.createdAt,
            }
          : null,
        hasUnread,
        lastMessageAt: conv.lastMessageAt,
      };
    });

    return paginatedResponse(conversationsWithUnread, {
      page: pagination.page,
      limit: pagination.limit,
      total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/messages - Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const validatedFields = createConversationSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const { participantIds, type, initialMessage } = validatedFields.data;

    // Verify all participants exist
    const participants = await prisma.user.findMany({
      where: {
        id: {
          in: participantIds,
        },
        status: 'ACTIVE',
      },
    });

    if (participants.length !== participantIds.length) {
      return notFoundResponse('One or more participants not found');
    }

    // For direct messages, check if conversation already exists
    if (type === 'DIRECT' && participantIds.length === 1) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { participants: { some: { userId: session.user.id } } },
            { participants: { some: { userId: participantIds[0] } } },
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                },
              },
            },
          },
        },
      });

      if (existingConversation) {
        return successResponse(existingConversation);
      }
    }

    // Create conversation with all participants including the creator
    const allParticipantIds = [...new Set([session.user.id, ...participantIds])];

    const conversation = await prisma.conversation.create({
      data: {
        type,
        participants: {
          create: allParticipantIds.map((userId) => ({
            userId,
            lastReadAt: userId === session.user.id ? new Date() : null,
          })),
        },
        ...(initialMessage && {
          messages: {
            create: {
              senderId: session.user.id,
              content: initialMessage,
              type: 'TEXT',
            },
          },
          lastMessageAt: new Date(),
        }),
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
          },
        },
        messages: true,
      },
    });

    // If there was an initial message, notify other participants
    if (initialMessage) {
      const notifications = participantIds.map((userId) => ({
        userId,
        type: 'NEW_MESSAGE' as const,
        title: 'New Message',
        message: `You have a new message from ${session.user.name}`,
        actionUrl: `/messages/${conversation.id}`,
        data: { conversationId: conversation.id },
      }));

      await prisma.notification.createMany({
        data: notifications,
      });
    }

    return createdResponse(conversation);
  } catch (error) {
    return handleApiError(error);
  }
}
