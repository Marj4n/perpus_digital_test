import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLogin } from "@/lib/utils";
import { favoriteCreationSchema } from "@/schemas/favorite";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const favorite = await prisma.favorite.findMany({
        where: {
          userId: Number(userId),
        },
      });

      return NextResponse.json(
        {
          favorite,
        },
        {
          status: 200,
        }
      );
    }

    const favorites = await prisma.favorite.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        book: true,
      },
    });
    return NextResponse.json(
      {
        favorites,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting favorites:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isLogin(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const body = await req.json();
    const { userId, bookId } = favoriteCreationSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });
    if (!book) {
      return NextResponse.json(
        {
          error: "Book not found.",
        },
        {
          status: 404,
        }
      );
    }

    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        bookId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        {
          error: "Favorite already exists.",
        },
        {
          status: 400,
        }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        bookId,
      },
    });

    return NextResponse.json(
      {
        favorite,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating favorite:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isLogin(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const favoriteId = searchParams.get("id");
    const favorite = await prisma.favorite.findUnique({
      where: {
        id: Number(favoriteId),
      },
    });

    if (!favorite) {
      return NextResponse.json(
        {
          error: "Favorite not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.favorite.delete({
      where: {
        id: Number(favoriteId),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "favorite deleted.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}
