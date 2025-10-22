import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const hashPassword = (plain: string) => {
    try {
        return bcrypt.hash(plain, SALT_ROUNDS)
    } catch (error) {
        console.error("Error hashing pasword")
        return null
    }
}

export const compare = (plain: string, hash: string | null) => {
    try {
        if (!hash) throw new Error("Password is null")
        return bcrypt.compare(plain, hash)
    } catch (error) {
        console.error("Error comparing password")
        return null
    }
}