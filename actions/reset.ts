"use server";
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/app/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
export const reset=async(values:z.infer<typeof ResetSchema>)=>{
    const validatedFields=ResetSchema.safeParse(values);
    if(!validatedFields.success){
        return{error:"Invalid Fields"};
    }
    const {email}=validatedFields.data;
    const existingUser=await getUserByEmail(email);
    if(!existingUser){
        return{error:"User not found"};
    }
    const passwordResetToken=await generatePasswordResetToken(email);
    await sendPasswordResetEmail({email:passwordResetToken.email,token:passwordResetToken.token});

    return{success:"Email Sent"}

}