import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username } = await request.json();
        
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const userAcceptMessage = user.isAcceptingMessage;
        return Response.json(
            { success: true, message: "User accept message", userAcceptMessage },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Make sure to export the handler to support the route properly
export default function handler(req: Request, res: Response) {
    if (req.method === 'POST') {
        return POST(req);
    }
    // } else {
    //     res.setHeader('Allow', ['POST']);
    //     return res.status(405).end(`Method ${req.method} Not Allowed`);
    // }
}
