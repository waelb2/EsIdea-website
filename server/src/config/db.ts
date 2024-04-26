
import mongoose, { ConnectOptions } from 'mongoose';

export const connectDB = (uri: string) => {
    return mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions
    )
}

