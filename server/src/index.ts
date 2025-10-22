import dotEnv from 'dotenv'
import app from './app';

dotEnv.config();

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
