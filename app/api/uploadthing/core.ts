import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
    const {userId} = await auth();
    if(!userId) {
        throw new Error("Unauthorized");
    }
    return {userId : userId};
}


export const ourFileRouter = {
    serverImage : f({ image : {maxFileSize : "8MB", maxFileCount : 1} })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    messageFile : f(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;