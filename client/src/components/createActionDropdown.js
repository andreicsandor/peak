export function createActionDropdownItem() {
  const dropdown = document.createElement("select");
  dropdown.className = "action-dropdown";
  dropdown.id = "actionDropdown";

  const options = [
    { id: "addWaypoint", text: "Add & Move" },
    { id: "duplicateWaypoint", text: "Insert After" },
    { id: "deleteWaypoint", text: "Delete" },
  ];

  const contentMarkup = options.map(option => `
    <option value="${option.id}" ${option.id === "addWaypoint" ? "selected" : ""}>${option.text}</option>
  `).join("");

  dropdown.innerHTML = contentMarkup;

  attachDropdownEvents(dropdown);

  return dropdown;
}

function attachDropdownEvents(dropdown) {
  dropdown.addEventListener("change", function () {
    const selectedOption = dropdown.value;
  });
}