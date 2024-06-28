import { io as Client } from "socket.io-client";
import { io as IoServer, httpServer, shutdown } from "../app"; // Ensure correct path



describe("socket.io tests", () => {

    beforeAll(() => {
        IoServer.attach(httpServer);
    });

    afterAll(() => {
        shutdown();
    })

    test("should connect and handle joining a code block", done => {
        console.log("PORT: ", (httpServer.address() as any).port);
        const clientSocket = Client(`http://localhost:${(httpServer.address() as any).port}`);
        const clientSocket2 = Client(`http://localhost:${(httpServer.address() as any).port}`);
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
        const clientSocket = Client(`http://localhost:${(httpServer.address() as any).port}`);
        const clientSocket2 = Client(`http://localhost:${(httpServer.address() as any).port}`);

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
        const mentor = Client(`http://localhost:${(httpServer.address() as any).port}`);
        const student = Client(`http://localhost:${(httpServer.address() as any).port}`);

        mentor.on("connect", () => {
            mentor.emit("joinCodeBlock", codeBlockId);
        });

        student.on("connect", () => {
            student.emit("joinCodeBlock", codeBlockId);

            student.on("role", (role) => {
                if (role === "student") {
                    mentor.disconnect();
                    console.log("Mentor disconnected", "student connection status: ", student.connected);
                    expect(student.connected).toBe(false);
                }
            });
        });

        student.on("disconnect", () => {
            mentor.close();
            student.close();
            done();
        });
    });










});
