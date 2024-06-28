import dotenv from 'dotenv';
import {connectDB, disconnectDB} from '../config/db';
import CodeBlock from '../models/CodeBlockModel';

dotenv.config();

const createCodeBlocks = async () => {
    try {
        await connectDB('test');

        const codeBlocks = [
            {
                title: 'Hello World',
                code: 'console.log("Hello, World!");',
                instructions: 'Write code that prints "Hello World" to the console.'
            },
            {
                title: 'Variables and Data Types',
                code: 'let name = "John";\nlet age = 30;\nlet isStudent = true;',
                instructions: 'Declare variables of different data types: a string, a number, and a boolean. Use the variable names "name", "age", and "isStudent".'
            },
            {
                title: 'Simple Function',
                code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}',
                instructions: 'Write a function named "greet" that takes a name as an argument and returns a greeting message.'
            },
            {
                title: 'Arrow Functions',
                code: 'const add = (a, b) => a + b;',
                instructions: 'Write an arrow function named "add" that takes two numbers as arguments and returns their sum.'
            },
            {
                title: 'For Loop',
                code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
                instructions: 'Write a for loop that prints numbers from 0 to 4 to the console.'
            },
            {
                title: 'Arrays and Objects',
                code: 'const fruits = ["apple", "banana", "cherry"];\nconst person = { name: "Alice", age: 25, city: "Wonderland" };',
                instructions: 'Declare an array named "fruits" and an object named "person" with name, age, and city properties.'
            },
            {
                title: 'Async/Await',
                code: 'async function fetchData(url) {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}',
                instructions: 'Write an async function named "fetchData" that fetches data from a given URL and returns the JSON response.'
            },
            {
                title: 'DOM Manipulation',
                code: 'document.getElementById("myButton").addEventListener("click", function() {\n  document.getElementById("myText").textContent = "Button Clicked!";\n});',
                instructions: 'Write code to add an event listener to a button with ID "myButton" that changes the text of an element with ID "myText" when clicked.'
            },
            {
                title: 'Try/Catch',
                code: 'try {\n  let result = riskyFunction();\n} catch (error) {\n  console.error("An error occurred:", error);\n}',
                instructions: 'Write code that calls a function named "riskyFunction" inside a try block and handles any errors in a catch block.'
            },
            {
                title: 'Class and Inheritance',
                code: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n\n  speak() {\n    console.log(`${this.name} makes a noise.`);\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    console.log(`${this.name} barks.`);\n  }\n}\n\nconst dog = new Dog("Rex");\ndog.speak();',
                instructions: 'Write a class named "Animal" with a "speak" method, and a class named "Dog" that inherits from Animal and overrides the "speak" method.'
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