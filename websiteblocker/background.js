let blockedSites = [];

// Load initial blocked sites from storage
chrome.storage.local.get("blockedSites", (data) => {
  blockedSites = data.blockedSites || [];
  updateBlockingRules();
});

// Listen for updates from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBlockedSites") {
    // Update the blocked sites based on user input
    blockedSites = message.blockedSites || [];
    chrome.storage.local.set({ blockedSites }, () => {
      updateBlockingRules(); // Update the blocking rules when sites are updated
      sendResponse({ status: "updated" }); // Send response after updating rules
    });
    return true; // Return true to indicate sendResponse will be called asynchronously
  }
});

// Update blocking rules using declarativeNetRequest
function updateBlockingRules() {
  // Prepare the blocking rules from blockedSites
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,  // Ensure unique rule IDs
    priority: 1,
    action: {
      type: "block"  // Block the request
    },
    condition: {
      urlFilter: `*://*.${site}/*`,  // Match the domains
      resourceTypes: ["main_frame"]  // Block only the main page load
    }
  }));

  // Log the rules for debugging
  console.log('Updating blocking rules with sites:', rules);

  // Use declarativeNetRequest to update the rules
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: rules,  // Add new blocking rules
      removeRuleIds: []  // Optionally, you can remove old rules if needed
    },
    () => {
      // Handle callback success
      console.log("Blocking rules updated!");
    }
  );

  // Optional: Add error handling for the updateDynamicRules
  chrome.runtime.lastError && console.error("Error updating blocking rules:", chrome.runtime.lastError);
}
