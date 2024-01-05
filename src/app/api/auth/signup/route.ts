import AuthService from "@/services/authentication";
import { AuthSignUpSchema } from "@/zod/auth";

export async function POST(request: Request) {
  try {
    const user = await request.json();

    // Check the received payload and if its not valid,
    // throw an error and prevent saving the entry to the database
    const userPayload = AuthSignUpSchema.safeParse({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
      confirm_password: user.confirm_password,
    });

    if (!userPayload.success) {
      return Response.json(
        { error: "Invalid values provided!" },
        { status: 422 }
      );
    }

    // Save the user in the database
    await AuthService.signUp(user);

    return Response.json(
      { message: "User registered successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
