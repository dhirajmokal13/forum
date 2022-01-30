import  Mongoose  from "mongoose";
const conn = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: "forum",
        };
        await Mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Connected Successfully");
    } catch(err){
        console.log(err);
    }
};

export default conn;