import { db } from "./db"


const findConversation = async (memberOneId : string, memberTwoId : string) => {
    try {
        return await db.conversation.findFirst({
        where : {
            AND : [
                {memberOneId : memberOneId},
                {memberTwoId : memberTwoId}
            ]
        },
        include : {
            memberOne : {
                include : {
                    profile : true
                }
            },
            memberTwo : {
                include : {
                    profile : true
                }
            }
        }
    });
    }
    catch (error) {
        console.log(`Error while finding conversation ; ${error}`);
    }
}



const createNewConversation = async (memberOneId : string, memberTwoId : string) => {
    try {
        return await db.conversation.create({
            data : {
                memberOneId : memberOneId,
                memberTwoId : memberTwoId
            },
            include : {
                memberOne : {
                    include : {
                        profile : true
                    }
                },
                memberTwo : {
                    include : {
                        profile : true
                    }
                }
            }
        })
    }
    catch (error) {
        console.log(`Error while creating conversation : ${error}`);
        return null;
    }
}



export const getOrCreateConversation = async (memberOneId : string, memberTwoId : string) => {

    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

    if(!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation;
}