document.addEventListener("DOMContentLoaded", () => {
  const siteList = document.getElementById("site-list");
  const saveButton = document.getElementById("save");

  // Load blocked sites from storage
  chrome.storage.local.get("blockedSites", (data) => {
    siteList.value = data.blockedSites ? data.blockedSites.join("\n") : "";
  });

  // Save blocked sites to storage
  saveButton.addEventListener("click", () => {
    const sites = siteList.value.split("\n").map((site) => site.trim()).filter((site) => site);
    
    // Save the updated list of blocked sites to storage
    chrome.storage.local.set({ blockedSites: sites }, () => {
      alert("Blocked sites updated!");
    });

    // Send the updated list of blocked sites to the background script
    chrome.runtime.sendMessage({
      action: "updateBlockedSites",
      blockedSites: sites
    });
  });
});
