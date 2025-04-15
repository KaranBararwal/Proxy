import bcrypt from "bcrypt"

const hashedPassword = bcrypt.hashSync("test123" , 10)

export const users = [
    {
        id: "1",
        name : "Test User",
        email : "test@example.com",
        password : hashedPassword
    }
]