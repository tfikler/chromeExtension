chrome.runtime.onInstalled.addListener(function() {
    // add a context menu upon right click
    chrome.contextMenus.create({
        "title": "Highlight Text",
        "contexts": ["selection"],
        "id": "highlightText"
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "highlightText") {
        // Execute script to highlight the selection
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: highlightSelection
        });
    }
});

function highlightSelection() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    range.surroundContents(span);
}