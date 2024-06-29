import { httpServer } from "../server";

module.exports = async () => {
    if (httpServer.listening) {
        await new Promise<void>((resolve, reject) => {
            httpServer.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
};