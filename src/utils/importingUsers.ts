import { clerkClient, createClerkClient } from "@clerk/astro/server";

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userId: string;
}

interface UserData {
  emailAddress: string[];
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

// Helper function for a delay using Promises
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function importingUsers(JSONfile: User[]): Promise<void> {
  try {
    const client = createClerkClient({
      secretKey: import.meta.env.CLERK_SECRET_KEY
    });

    // Use a for...of loop to correctly handle async operations in sequence
    for (const user of JSONfile) {
      const { email, password, firstName, lastName, userId } = user;
      const userData: UserData = {
        emailAddress: [email], // emailAddress is expected to be an array
        password: `${userId}-123`,
        username: userId,
        firstName: firstName,
        lastName: lastName,
      };

      try {
        // Await the user creation directly in the loop
        const response = await client.users.createUser(userData);
        console.log("User created:", response);

        // If you still need a delay BETWEEN users, await the delay function
        await delay(2000); // Example: wait 500ms before creating the next user

      } catch (userCreationError) {
        // Handle errors for this specific user creation
        console.error(`Error creating user ${email}:`, userCreationError);
        // Decide if you want to continue with the next user or stop
        // continue; // To continue with the next user
        // break; // To stop processing further users
      }
    }
    console.log("Finished processing user imports.");

  } catch (overallError) {
    console.error("Overall import process failed:", overallError);
  }
}