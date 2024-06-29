import { httpServer } from "../server";

module.exports = async () => {
    await new Promise<void>((resolve, reject) => {
        if (!httpServer.listening) {
            httpServer.listen(3000, resolve);
        } else {
            resolve();
        }
    });
};