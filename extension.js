chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "improveEnglish",
        title: "Improve English",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "improveEnglish") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: improveSelectedText,
            args: [info.selectionText]
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "Generate Image",
        title: "Generate Image",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "Generate Image") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: generateImage,
            args: [info.selectionText]
        });
    }
});

// -------------------THIS IS HOW TO BUILD NEW ITEM IN CONTEXT MENU-------------------
// its ok if we have the yellow underline in the code below, it is just a warning.
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "improveEnglishCreative",
        title: "Improve English - creative",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "improveEnglishCreative") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: improveSelectedTextCreative,
            args: [info.selectionText]
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addCommentsToCode",
        title: "add comments to code",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addCommentsToCode") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: addCommentsToCode,
            args: [info.selectionText]
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeToASingleParagraph",
        title: "Summarize to a single paragraph",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizeToASingleParagraph") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: summarizeToASingleParagraph,
            args: [info.selectionText]
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "AIQuiz",
        title: "AI Quiz",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "AIQuiz") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: AIQuiz,
            args: [info.selectionText]
        });
    }
});

/**
 * TODO:
 *  1. Create a new item in the context menu called "Add comments to the code" - which should add comments to selected code.
 *  2. Build a new function that will add comments to the selected code.
 *  3. Add the comments to the selected code below the selected code, in the format of: comments: 'This is a comment'.
 * **/

// -------------------THIS THE END OF HOW TO BUILD NEW ITEM IN CONTEXT MENU-------------------

// -------------------THIS IS HOW TO IMPROVE SELECTED TEXT USING CHATGPT-------------------
async function improveSelectedText(selectedText) {
    const systemContent = 'You are an english teacher and should improve the following english - response only with the improved text.'; // create a system content
    const conversationItem = [
        {
            role: 'system',
            content: systemContent
        },
        {
            role: 'user',
            content: selectedText
        }
    ]; // create a conversationItem (MUST BE IN THAT FORMAT)
    const response = await queryOpenAI(conversationItem, 0.2); // We must call the chatGPT query function with await since it is an async (it takes time for the response to come back) function.
    // await replaceText(selectedText, response);
    await replaceTextPOP(response);
}
// -------------------THIS THE END OF HOW TO IMPROVE SELECTED TEXT USING CHATGPT-------------------

async function improveSelectedTextCreative(selectedText) {
    const systemContent = 'You are an english teacher and should improve the following english in a crazy and stupid way - response only with the improved text.';
    const conversationItem = [
        {
            role: 'system',
            content: systemContent
        },
        {
            role: 'user',
            content: selectedText
        }
    ];
    const response = await queryOpenAI(conversationItem, 1.2);
    await replaceTextPOP(response);
}
async function queryOpenAiForImageAndLoading(selectedText) {
    await displayLoading();
    const apiKey = 'sk-proj-LyFh8uJ9L105OpQqAgPPT3BlbkFJABdGfuYHtbMSCOezr0vd';
    const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'dall-e-3',
            prompt: `A drawing of a ${selectedText}`,
            n: 1,
            size: '1024x1024'
        })
    })
    const jsonAnswer = await res.json();
    console.log('response from openai: ', jsonAnswer);
    const imgURL = jsonAnswer.data[0].url;
    await hideLoading();
    return imgURL;
}

async function generateImage(selectedText) {
    const imgURL = await queryOpenAiForImageAndLoading(selectedText)
    await displayImg(imgURL);
}

async function displayImg(imgURL) {
    let modal = document.getElementById('ImgModel');
    if (!modal) {
        // Create modal container
        modal = document.createElement('div');
        modal.id = 'ImgModel';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40%;
            max-width: 600px;
            height: auto;
            max-height: 80%;
            z-index: 10000;
            background-color: #fff;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
        `;
        // Create modal content container
        let modalContent = document.createElement('img');
        modalContent.id = 'imgToDisplay';
        modalContent.src = imgURL;
        modalContent.style.cssText = 'width: 100%; height: 100%;';

        // Create close button for modal
        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        modal.appendChild(modalContent);
        modal.appendChild(closeButton);

        document.body.appendChild(modal);
    } else {
        // If modal already exists, just update the content and make sure it's visible
        let modalContent = document.getElementById('imgToDisplay');
        modalContent.src = imgURL;
        modal.style.display = 'block';
    }
}


async function addCommentsToCode(selectedText) {
    const systemContent = 'You should provide a comment to add to the selected code. - response only with the comment';
    const conversationItem = [
        {
            role: 'system',
            content: systemContent
        },
        {
            role: 'user',
            content: selectedText
        }
    ];
    const response = await queryOpenAI(conversationItem, 0.2);
    const commentToAdd = response;
    //comment in the specified format
    const comment = `\n// comments: '${commentToAdd}'`;
    // Append the comment to the selected text
    const newText = `${selectedText}${comment}`;
    await replaceText(selectedText, newText);
}

async function summarizeToASingleParagraph(selectedText) {
    const systemContent = 'You are an english teacher and should summarize the following english to a ONE paragraph - response only with the summarized paragraph.';
    const conversationItem = [
        {
            role: 'system',
            content: systemContent
        },
        {
            role: 'user',
            content: selectedText
        }
    ];
    const response = await queryOpenAIWithLoading(conversationItem, 0.2)
    await replaceTextPOP(response);
}

async function AIQuiz(selectedText) {
    const systemContent = 'you are a trivia maker';
    const jsonFormatForQuiz = {
        questions: [
            {
                question: 'What is the capital of France?',
                answers: ['Paris', 'London', 'Berlin', 'Madrid'],
                correct_answer: 'Paris'
            },
            {
                question: 'What is the capital of Germany?',
                answers: ['Paris', 'London', 'Berlin', 'Madrid'],
                correct_answer: 'Berlin'
            }
        ]
    }
    const stringifierJsonFormatForQuiz = JSON.stringify(jsonFormatForQuiz);
    const conversationItem = [
        {
            role: 'system',
            content: systemContent
        },
        {
            role: 'user',
            content:`based on this text generate me 10 multiple choice questions with 4 possible answers where 1 answer is actually right(randomly placing the correct answer withing the 4 options) and mark it so we know which one it is - respond with the questions only: ${selectedText}. You MUST give me this is this json format: ${stringifierJsonFormatForQuiz}.`
        }
    ]; // create a conversationItem (MUST BE IN THAT FORMAT)
    const response = await queryOpenAIWithLoading(conversationItem, 0.7);
    const responseJson = JSON.parse(response);
    console.log('responseJson: ', responseJson);
    await displayQuiz(responseJson);
    await displayQuiz1(responseJson);
}

async function displayQuiz1(quizContent) {
    const modalContent = document.getElementById('quizModal');
    modalContent.innerHTML = '';
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.onclick = function() {
        modalContent.style.display = 'none';
    }
    exitButton.id = 'exitButton';
    exitButton.style.cssText = 'position: absolute; top: 10px; right: 10px; padding: 5px 10px; font-size: 16px; border: none; background-color: #ff6347; color: white; cursor: pointer; border-radius: 5px;';

    exitButton.onmouseover = function() {
        exitButton.style.backgroundColor = '#e53e3e';
    };
    exitButton.onmouseout = function() {
        exitButton.style.backgroundColor = '#ff6347';
    };
    let correctAnswers = 0;

    async function displayQuestion(question) {
        modalContent.innerHTML = '';
        modalContent.appendChild(exitButton)
        let questionElement = document.createElement('div');
        questionElement.textContent = question.question;
        questionElement.style.cssText = 'font-size: 20px; margin-bottom: 20px; padding: inherit;';
        modalContent.appendChild(questionElement);

        question.answers.forEach((answer) => {
            let answerElement = document.createElement('button');
            answerElement.textContent = answer;
            if (answer === question.correct_answer) {
                answerElement.id = 'correctAnswer'
            }
            answerElement.style.cssText = 'display: block; width: 100%; padding: 10px; margin-top: 10px; font-size: 16px; border: 1px solid #ccc; background-color: #f4f4f4; cursor: pointer; transition: background-color 0.3s;';
            answerElement.onclick = async () => {
                const isCorrect = answer === question.correct_answer;
                if (isCorrect) {
                    correctAnswers++;
                }
                paintTheTrueAnswer();
                answerElement.style.backgroundColor = isCorrect ? 'lightgreen' : 'salmon';
                displayResult(isCorrect ? 'Correct Answer!' : 'Wrong Answer!', isCorrect);
                answerElement.removeEventListener('click', this);
            };
            modalContent.appendChild(answerElement);
        });
    }

    function paintTheTrueAnswer() {
        const correctAnswerElement = document.getElementById('correctAnswer');
        correctAnswerElement.style.backgroundColor = 'lightgreen';
    }

    function displayResult(message, isCorrect) {
        let resultElement = document.getElementById('result') || document.createElement('div');
        resultElement.id = 'result';
        resultElement.textContent = message;
        resultElement.style.cssText = `font-size: 18px; margin-top: 20px; color: ${isCorrect ? 'green' : 'red'}; text-align: center;`;
        if (!document.getElementById('result')) {
            modalContent.appendChild(resultElement);
        }
    }

    for (let i = 0; i < quizContent.questions.length; i++) {
        console.log('Displaying question:', quizContent.questions[i].question);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 500 ms delay
        modalContent.style.display = 'block';
        await displayQuestion(quizContent.questions[i]);

        await new Promise(resolve => {
            const buttons = modalContent.querySelectorAll('button:not(#exitButton)');
            buttons.forEach(button => button.addEventListener('click', resolve, { once: true }));
        });
    }

    modalContent.innerHTML = `<div>Quiz Completed! </br> You made ${correctAnswers} correct answers</div>`;
    modalContent.appendChild(exitButton);
    modalContent.style.textAlign = 'center';
}


async function displayLoading() {
    let modal = document.getElementById('loadingModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loadingModal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40%;
            max-width: 600px;
            height: auto;
            max-height: 80%;
            z-index: 10000;
            background-color: #fff;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
        `;
        let modalContent = document.createElement('div');
        modalContent.textContent = 'Loading...';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'block';
    }
}

async function queryOpenAIWithLoading(conversationItem, temp) {
    await displayLoading();
    const response = await queryOpenAI(conversationItem, temp);
    await hideLoading();
    return response;
}

async function hideLoading() {
    let modal = document.getElementById('loadingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}



// -------------------THIS IS HOW TO REPLACE TEXT-------------------
async function replaceText(originalText, improvedText) {
    console.log('originalText: ', originalText);
    console.log('improvedText: ', improvedText);
    document.body.innerHTML = document.body.innerHTML.replace(originalText, improvedText);
}

async function replaceTextPOP(improvedText) {
    let modal = document.getElementById('improvementModal');
    if (!modal) {
        // Create modal container
        modal = document.createElement('div');
        modal.id = 'improvementModal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40%;
            max-width: 600px;
            height: auto;
            max-height: 80%;
            z-index: 10000;
            background-color: #fff;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
        `;
        // Create modal content container
        let modalContent = document.createElement('div');
        modalContent.id = 'improvementModalContent';
        modalContent.textContent = improvedText;
        
        // Create close button for modal
        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };
        
        modal.appendChild(modalContent);
        modal.appendChild(closeButton);
        
        document.body.appendChild(modal);
    } else {
        // If modal already exists, just update the content and make sure it's visible
        let modalContent = document.getElementById('improvementModalContent');
        modalContent.textContent = improvedText;
        modal.style.display = 'block';
    }
}
async function displayQuiz() {
    let modal = document.getElementById('quizModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quizModal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            max-width: 800px;
            height: auto;
            max-height: 90%;
            z-index: 10000;
            background-color: #fff;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
        `;
        modal.style.display = 'none';
        document.body.appendChild(modal);
    } else {
        // modal.style.display = 'block';
    }
}



// -------------------THIS THE END OF HOW TO REPLACE TEXT-------------------


async function queryOpenAI(conversationItem, temp) {
    const apiKey = 'sk-proj-LyFh8uJ9L105OpQqAgPPT3BlbkFJABdGfuYHtbMSCOezr0vd';
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: conversationItem,
            temperature: temp
        })
    })
    const jsonAnswer = await res.json();
    console.log('response from openai: ', jsonAnswer);
    return jsonAnswer.choices[0].message.content;
}
// -------------------THIS THE END OF HOW TO QUERY OPENAI-------------------

