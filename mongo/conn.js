import mongoose from "mongoose";

const connectionString =
    "mongodb+srv://yutira-admin:sNrmMV4MO18f9YFT@yutira-2025.t5adc.mongodb.net/?retryWrites=true&w=majority";
    //"mongodb+srv://yutira-admin:yHSsegdj6EdTj9q3@cluster0.cthev.mongodb.net/?retryWrites=true&w=majority"
export const connectToServer = (callback) => {
    mongoose
        .connect(connectionString, {})
        .then(() => {
            console.log("Connected to MongoDB");
            return callback();
        })
        .catch((err) => {
            console.log(err);
            return callback(err);
        });
};



//mongodb+srv://admin:admin@psg-kriya-express.nupjb5g.mongodb.net/?retryWrites=true&w=majority
