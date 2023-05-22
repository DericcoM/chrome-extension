chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "addWordContextMenu",
    title: "Добавить в расширение",
    contexts: ["selection"],
  });
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "addWordContextMenu") {
    const userId = parseInt(localStorage.getItem("userId"), 10);
    handleSubmitWord(info.selectionText, userId);
  }
});

async function handleSubmitWord(word, userId) {
  const apiBaseUrl = "http://localhost:4200/api";

  try {
    const response = await fetch(`${apiBaseUrl}/entry/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: word, userId }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при добавлении слова");
    } else {
      alert(`Слово успешно добалено!`);
    }

    return response.json();
  } catch (error) {
    alert(`Ошибка при добавлении слова: ${error.message}`);
  }
}
