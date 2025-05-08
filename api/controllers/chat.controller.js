// chats.controller.js
import prisma from "../lib/prisma.js";

// GET /api/chats
export const getChats = async (req, res) => {
  const userId = req.userId;
  try {
    // Find all chats where this user is a participant
    const chats = await prisma.chat.findMany({
      where: {
        participants: { some: { userId } }
      },
      include: {
        participants: {
          select: {
            user: { select: { id: true, username: true, avatar: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { from: { select: { id: true, username: true } } }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return res.status(200).json(chats);
  } catch (err) {
    console.error("getChats:", err);
    return res.status(500).json({ message: "Failed to fetch chats." });
  }
};


export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
