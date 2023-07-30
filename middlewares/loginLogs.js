import sch from "../models/forum.js";

const addLoginLogs = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            const result = await sch.signup.findByIdAndUpdate(id,
                { $push: { loginLogs: Date.now() } },
                { new: true });
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

export default addLoginLogs;