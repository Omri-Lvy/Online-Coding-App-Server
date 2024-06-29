import { io as Client } from "socket.io-client";


describe("socket.io tests", () => {

    const PORT: string | number = process.env.PORT || 3000;

    test("should connect and handle joining a code block", done => {
        const clientSocket = Client(`http://localhost:${PORT}`);
        const clientSocket2 = Client(`http://localhost:${PORT}`);
        const codeBlockId = "123";
        clientSocket.on("connect", () => {
            clientSocket.emit("joinCodeBlock", codeBlockId);

            clientSocket.on("role", (role) => {
                expect(role).toBe("mentor"); // Expect the first connection to be assigned as mentor
                clientSocket2.on("connect", () => {
                    clientSocket2.emit("joinCodeBlock", codeBlockId);

                    clientSocket2.on("role", (role) => {
                        expect(role).toBe("student"); // Expect the second connection to be assigned as student
                    });
                });
                clientSocket2.close();
                clientSocket.close();
                done();
            });
        });
    });

    test("should handle code changes and update other clients", done => {
        const codeBlockId = "123";
        const clientSocket = Client(`http://localhost:${PORT}`);
        const clientSocket2 = Client(`http://localhost:${PORT}`);

        clientSocket.on("connect", () => {
            clientSocket.emit("joinCodeBlock", codeBlockId);
        });

        clientSocket2.on("connect", () => {
            clientSocket2.emit("joinCodeBlock", codeBlockId);

            clientSocket2.on("role", (role) => {
                if (role === "student") {
                    clientSocket2.emit("codeChange", { codeBlockId, code: "new code" });

                    clientSocket.on("codeUpdate", (data) => {
                        expect(data.code).toBe("new code");
                        clientSocket2.close();
                        clientSocket.close();
                        done();
                    });
                }
            });
        });
    });

    test("student should be disconnected if mentor disconnects", (done) => {
        const codeBlockId = "123";
        const mentor = Client(`http://localhost:${PORT}`);
        const student = Client(`http://localhost:${PORT}`);

        mentor.on("connect", () => {
            mentor.emit("joinCodeBlock", codeBlockId);
        });

        student.on("connect", () => {
            student.emit("joinCodeBlock", codeBlockId);

            student.on("role", (role) => {
                if (role === "student") {
                    mentor.disconnect();
                    console.log("Mentor disconnected", "student connection status: ", student.connected);
                }
            });
        });

        student.on("disconnect", () => {
            mentor.close();
            student.close();
        });

        setTimeout(() => {
            expect(student.connected).toBe(false);
            done();
        }, 1000);
    });
});
