const fs = require('fs');
const path = require('path');

// Generate 100 Spot Error questions
function generateSpotErrorQuestions() {
    const questions = [];
    const concepts = [
        { category: 'Basics', difficulty: 'Easy' },
        { category: 'Ownership', difficulty: 'Medium' },
        { category: 'Borrowing', difficulty: 'Medium' },
        { category: 'Lifetimes', difficulty: 'Hard' },
        { category: 'Structs', difficulty: 'Easy' },
        { category: 'Enums', difficulty: 'Medium' },
        { category: 'Traits', difficulty: 'Medium' },
        { category: 'Generics', difficulty: 'Hard' },
        { category: 'Error Handling', difficulty: 'Medium' },
        { category: 'Concurrency', difficulty: 'Hard' }
    ];

    for (let i = 1; i <= 100; i++) {
        const concept = concepts[Math.floor(Math.random() * concepts.length)];
        const question = generateSpotErrorQuestion(i, concept);
        questions.push(question);
    }
    return questions;
}

// Generate 100 Predict Output questions
function generatePredictOutputQuestions() {
    const questions = [];
    const concepts = [
        { category: 'Basics', difficulty: 'Easy' },
        { category: 'Ownership', difficulty: 'Medium' },
        { category: 'Borrowing', difficulty: 'Medium' },
        { category: 'Lifetimes', difficulty: 'Hard' },
        { category: 'Structs', difficulty: 'Easy' },
        { category: 'Enums', difficulty: 'Medium' },
        { category: 'Traits', difficulty: 'Medium' },
        { category: 'Generics', difficulty: 'Hard' },
        { category: 'Error Handling', difficulty: 'Medium' },
        { category: 'Concurrency', difficulty: 'Hard' }
    ];

    for (let i = 1; i <= 100; i++) {
        const concept = concepts[Math.floor(Math.random() * concepts.length)];
        const question = generatePredictOutputQuestion(i, concept);
        questions.push(question);
    }
    return questions;
}

// Generate 100 Fix Syntax questions
function generateFixSyntaxQuestions() {
    const questions = [];
    const concepts = [
        { category: 'Basics', difficulty: 'Easy' },
        { category: 'Ownership', difficulty: 'Medium' },
        { category: 'Borrowing', difficulty: 'Medium' },
        { category: 'Lifetimes', difficulty: 'Hard' },
        { category: 'Structs', difficulty: 'Easy' },
        { category: 'Enums', difficulty: 'Medium' },
        { category: 'Traits', difficulty: 'Medium' },
        { category: 'Generics', difficulty: 'Hard' },
        { category: 'Error Handling', difficulty: 'Medium' },
        { category: 'Concurrency', difficulty: 'Hard' }
    ];

    for (let i = 1; i <= 100; i++) {
        const concept = concepts[Math.floor(Math.random() * concepts.length)];
        const question = generateFixSyntaxQuestion(i, concept);
        questions.push(question);
    }
    return questions;
}

// Generate individual spot error question
function generateSpotErrorQuestion(id, concept) {
    const errors = [
        { line: 3, error: "Use of moved value", reason: "value used here after move" },
        { line: 4, error: "Cannot borrow as mutable", reason: "cannot borrow as mutable" },
        { line: 2, error: "Mismatched types", reason: "mismatched types" },
        { line: 3, error: "Expected struct", reason: "expected struct" },
        { line: 4, error: "Borrowed value does not live long enough", reason: "borrowed value does not live long enough" },
        { line: 2, error: "Missing lifetime specifier", reason: "missing lifetime specifier" },
        { line: 3, error: "Cannot mutate immutable variable", reason: "cannot mutate immutable variable" },
        { line: 4, error: "Trait bound not satisfied", reason: "trait bound not satisfied" },
        { line: 2, error: "Expected identifier", reason: "expected identifier" },
        { line: 3, error: "Cannot borrow immutable variable as mutable", reason: "cannot borrow immutable variable as mutable" }
    ];

    const error = errors[Math.floor(Math.random() * errors.length)];
    const codeVariations = [
        `fn main() { let x = 5; let y = x; println!("{}", x); }`,
        `fn main() { let mut s = String::from("hello"); let r = &s; r.push_str(" world"); }`,
        `fn main() { let x = 42; let y = &x as *const i32; unsafe { println!("{}", *y); } }`,
        `fn main() { let s1 = String::from("test"); let s2 = s1; println!("{}", s1); }`,
        `fn main() { let x = 10; let y = &mut x; println!("{}", x); }`,
        `fn main() { let x = 5; let y = &x; println!("{}", y); }`,
        `fn main() { let x = 42; let y = &x; println!("{}", *y); }`,
        `fn main() { let s = String::from("hello"); let r = &s; drop(s); println!("{}", r); }`,
        `fn main() { let x = 10; let y = &x; let z = &mut x; println!("{}", x); }`,
        `fn main() { let x = 5; let y = &x; println!("{}", *y); }`
    ];

    const code = codeVariations[Math.floor(Math.random() * codeVariations.length)];
    const lines = code.split('\n').map(line => line.trim());

    return {
        id: `rust_spot_${id.toString().padStart(3, '0')}`,
        version: 1,
        difficulty: concept.difficulty,
        category: concept.category,
        date_added: new Date().toISOString(),
        code_snippet: lines,
        question_type: 'spot_error',
        correct_line_index: error.line - 1,
        explanation: `Error on line ${error.line}: ${error.reason}`,
        choices: [
            `Line ${error.line}: ${error.error}`,
            `Line ${error.line + 1}: Unexpected token`,
            `Line ${error.line - 1}: Invalid syntax`,
            `Line ${error.line}: ${error.reason}`
        ]
    };
}

// Generate individual predict output question
function generatePredictOutputQuestion(id, concept) {
    const outputs = ['42', '"hello"', 'Some(10)', 'None', 'true', 'false', '5', '10', 'Panic', 'Error'];
    const codeVariations = [
        `fn main() { let x = 5; let y = x + 5; println!("{}", y); }`,
        `fn main() { let s = String::from("hello"); println!("{}", s); }`,
        `fn main() { let x = Some(10); println!("{:?}", x); }`,
        `fn main() { let x = 42; println!("{}", x); }`,
        `fn main() { let x = 5; let y = &x; println!("{}", *y); }`,
        `fn main() { let s = String::from("test"); let r = &s; println!("{}", r); }`,
        `fn main() { let x = 10; let y = x * 2; println!("{}", y); }`,
        `fn main() { let x = true; println!("{}", x); }`,
        `fn main() { let x = None; println!("{:?}", x); }`,
        `fn main() { let x = 3; let y = x.pow(2); println!("{}", y); }`
    ];

    const code = codeVariations[Math.floor(Math.random() * codeVariations.length)];
    const lines = code.split('\n').map(line => line.trim());
    const correctOutput = outputs[Math.floor(Math.random() * outputs.length)];

    return {
        id: `rust_predict_${id.toString().padStart(3, '0')}`,
        version: 1,
        difficulty: concept.difficulty,
        category: concept.category,
        date_added: new Date().toISOString(),
        code_snippet: lines,
        question_type: 'predict_output',
        correct_answer: Math.floor(Math.random() * 4),
        correct_output: correctOutput,
        choices: [
            `Option A: ${correctOutput}`,
            `Option B: ${outputs[Math.floor(Math.random() * outputs.length)]}`,
            `Option C: ${outputs[Math.floor(Math.random() * outputs.length)]}`,
            `Option D: ${outputs[Math.floor(Math.random() * outputs.length)]}`
        ]
    };
}

// Generate individual fix syntax question
function generateFixSyntaxQuestion(id, concept) {
    const fixes = ['&mut', '&', '*', 'ref', 'clone()', 'to_string()', 'as_str()', 'into()'];
    const codeVariations = [
        `fn main() { let x = 5; let y = &x; println!("{}", *y); }`,
        `fn main() { let mut s = String::from("hello"); let r = &s; r.push_str(" world"); }`,
        `fn main() { let x = 42; let y = &x as *const i32; unsafe { println!("{}", *y); } }`,
        `fn main() { let s1 = String::from("test"); let s2 = s1; println!("{}", s2); }`,
        `fn main() { let x = 10; let y = &mut x; println!("{}", x); }`,
        `fn main() { let x = 5; let y = &x; println!("{}", y); }`,
        `fn main() { let x = 42; let y = &x; println!("{}", *y); }`,
        `fn main() { let s = String::from("hello"); let r = &s; drop(s); println!("{}", r); }`,
        `fn main() { let x = 10; let y = &x; let z = &mut x; println!("{}", x); }`,
        `fn main() { let x = 5; let y = &x; println!("{}", *y); }`
    ];

    const code = codeVariations[Math.floor(Math.random() * codeVariations.length)];
    const lines = code.split('\n').map(line => line.trim());
    const correctFix = fixes[Math.floor(Math.random() * fixes.length)];

    return {
        id: `rust_fix_${id.toString().padStart(3, '0')}`,
        version: 1,
        difficulty: concept.difficulty,
        category: concept.category,
        date_added: new Date().toISOString(),
        code_snippet: lines,
        question_type: 'fix_syntax',
        correct_answer: Math.floor(Math.random() * 4),
        correct_fix: correctFix,
        choices: [
            fixes[0],
            fixes[1],
            fixes[2],
            fixes[3]
        ]
    };
}

// Generate all questions
function generateAllQuestions() {
    const spotErrorQuestions = generateSpotErrorQuestions();
    const predictOutputQuestions = generatePredictOutputQuestions();
    const fixSyntaxQuestions = generateFixSyntaxQuestions();
    
    return [...spotErrorQuestions, ...predictOutputQuestions, ...fixSyntaxQuestions];
}

// Save questions to file
function saveQuestions() {
    const questions = generateAllQuestions();
    const filePath = path.join(__dirname, 'data', 'questions.json');
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
    console.log(`Generated ${questions.length} questions and saved to ${filePath}`);
}

// Run the generator
saveQuestions();