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
    await replaceText(selectedText, response);
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
    await replaceText(selectedText, response);
}

// -------------------THIS IS HOW TO REPLACE TEXT-------------------
async function replaceText(originalText, improvedText) {
    console.log('originalText: ', originalText);
    console.log('improvedText: ', improvedText);
    document.body.innerHTML = document.body.innerHTML.replace(originalText, improvedText);
}
// -------------------THIS THE END OF HOW TO REPLACE TEXT-------------------

// -------------------THIS IS HOW TO QUERY OPENAI-------------------
// You should use conversationItem as an array of objects with role and content properties.
// example: conversationItem = [
//     {
//         role: 'system',
//         content: '--Write here the system content (what type of chatGPT person you are talking with)--'
//     },
//     {
//         role: 'user',
//         content: '--Write here the user content (what you want to ask chatGPT)--'
//     }
// ];
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

async function openIframeWithContent() {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('popup.html');
    iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;width:20%;height:20%;z-index:9999;';
    document.body.appendChild(iframe);
}