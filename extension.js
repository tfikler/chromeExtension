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

async function improveSelectedText(selectedText) {
    const conversationItem = [
        {
            role: 'system',
            content: 'You are an english teacher and should improve the following english - response only with the improved text.'
        },
        {
            role: 'user',
            content: selectedText
        }
    ];
    const response = await queryOpenAI(conversationItem);
    await replaceText(selectedText, response);
}

// Content script
async function replaceText(originalText, improvedText) {
    console.log('originalText: ', originalText);
    console.log('improvedText: ', improvedText);
    document.body.innerHTML = document.body.innerHTML.replace(originalText, improvedText);
}

async function queryOpenAI(conversationItem) {
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
        })
    })
    const jsonAnswer = await res.json();
    console.log('response from openai: ', jsonAnswer);
    return jsonAnswer.choices[0].message.content;
}