import dotenv from 'dotenv';
import {connectDB, disconnectDB} from '../config/db';
import CodeBlock from '../models/CodeBlockModel';

dotenv.config();

const createCodeBlocks = async () => {
    try {
        await connectDB('codeblocks');

        const codeBlocks = [
            {
                title: "data-types",
                code: `// Your code here`,
                solution: `const pi = 3.14; \nlet person = "John Doe";`,
                instructions: "Declare a constant 'pi' and set it to 3.14. Also, declare a variable 'person' and initialize it with the string 'John Doe'."
            },
            {
                title: "arithmetic-operators",
                code: `let x = 10; \nlet y = 2;`,
                solution: `let x = 10; \nlet y = 2; \nlet add = x + y; \nlet subtract = x - y; \nlet multiply = x * y; \nlet divide = x / y;`,
                instructions: "Declare two variables 'x' and 'y' and initialize them with 10 and 2, respectively. Perform addition, subtraction, multiplication, and division, storing each result in new variables 'add', 'subtract', 'multiply', and 'divide'."
            },
            {
                title: "creating-an-array",
                code: `// Your code here`,
                solution: `const cars = ["Saab", "Volvo", "BMW"];`,
                instructions: "Declare a constant 'cars' and initialize it with an array containing the strings 'Saab', 'Volvo', and 'BMW'."
            },
            {
                title: "for-loop",
                code: `// Your code here`,
                solution: `// Your code here\nfor (let i = 0; i < 5; i++) {\nconsole.log(i)\n}`,
                instructions: "Write a for loop that iterates from 0 to 4. Inside the loop, use console.log to print each number."
            },
            {
                title: "object-destructuring",
                code: `const person = {\nfirstName: "John",\nlastName: "Doe"};\n // Your code here`,
                solution: `const person = {\nfirstName: "John",\nlastName: "Doe"};\n let {lastName, firstName} = person;`,
                instructions: "Use object destructuring to extract 'firstName' and 'lastName' from the 'person' object."
            },
            {
                title: "using-template-literals",
                code: `const firstName = "John";\n const lastName = "Doe";\n // Your code here`,
                solution: "const fullName = `${firstName} ${lastName}`;\nconsole.log(fullName);",
                instructions: "Declare a variable 'fullName' and use template literals to combine 'firstName' and 'lastName' into a single string."
            },
            {
                title: "arrow-functions",
                code: `// Your code here`,
                solution: `const square = x => x * x;`,
                instructions: "Define an arrow function named 'square' that accepts one parameter and returns the square of that parameter."
            },
            {
                title: "using-fetch-to-load-data",
                code: `async function fetchData() {\n // Your code here\n}`,
                solution: `async function fetchData() {\n 
                    try {
                        const response = await fetch('https://api.example.com/data');
                        const data = await response.json();
                        console.log("Data fetched successfully:", data);
                    } catch (error) {
                        console.error("Failed to fetch data:", error);
                    }
                }
                fetchData();`,
                instructions: "Write an asynchronous function 'fetchData' that uses fetch to retrieve data from 'https://api.example.com/data', parses the JSON response, and logs it. Include error handling to catch and log any errors during the fetch operation."
            }
        ];

        await CodeBlock.insertMany(codeBlocks);
        console.log('Code blocks created!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await disconnectDB();
    }
};

createCodeBlocks();