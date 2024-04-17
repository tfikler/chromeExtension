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
    const apiKey = 'YOUR_OPENAI_API_KEY';  // Replace YOUR_OPENAI_API_KEY with your actual OpenAI API key

     const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-proj-LyFh8uJ9L105OpQqAgPPT3BlbkFJABdGfuYHtbMSCOezr0vd`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: [{ role: 'system', content: 'You are an english teacher and should improve the following english.' }, { role: 'user', content: selectedText }],
        })
    })
    const json = await res.json();
    const response = json.choices[0].message.content;
    console.log(response);
    console.log('calling replaceText')
    await replaceText(selectedText, response);
    console.log('replaced text');
}

// Content script
async function replaceText(originalText, improvedText) {
    console.log('Replacing text');
    console.log(document.body.innerHTML)
    document.body.innerHTML = document.body.innerHTML.replace(originalText, improvedText);
}