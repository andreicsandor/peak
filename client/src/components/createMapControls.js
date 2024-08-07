import toastr from "toastr";
import { createActionDropdownItem } from "./createActionDropdown";
import { Modes, setCurrentMode } from "../const/currentModes";
import {
  handleUndo,
  handleRedo,
  handleSave,
  handleUpdate,
  handleImport,
  handleRemoveImport,
  handleAssistant,
} from "../utils/mapUtils";
import {
  activateMapControls,
  deactivateMapControls,
} from "../utils/interfaceUtils";
import { toastrOptions } from "../config/toastrConfig"; 

toastr.options = toastrOptions;

export function addEntityButton(type) {
  const entityButtonContainer = document.querySelector(".entity-container");

  const entityButton = document.createElement("button");
  entityButton.className = "control-button";
  entityButton.innerHTML = type === "create" ? "Create Route" : "Update Route";
  entityButton.dataset.type = type;

  entityButton.addEventListener("click", async () => {
    if (type === "create") {
      await handleSave();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const routeId = urlParams.get("id");
      await handleUpdate(routeId);
    }
  });

  entityButtonContainer.append(entityButton);
}

export function addAssistantButton() {
  const assistantButtonContainer = document.querySelector(".assistant-container");

  const assistantButton = document.createElement("button");
  assistantButton.className = "control-button";
  assistantButton.innerHTML = `<img src="./src/assets/lightbulb-fill.svg" alt="Logo"/>`;

  assistantButton.addEventListener("click", async () => {
      await handleAssistant();
  });

  assistantButtonContainer.append(assistantButton);
}

export function addActionDropdown() {
  const actionDropdownContainer = document.querySelector(".action-container");

  const actionDropdown = createActionDropdownItem();

  actionDropdown.addEventListener("change", () => {
    const value = actionDropdown.value;

    switch (value) {
      case Modes.ADD_WAYPOINT:
        setCurrentMode(Modes.ADD_WAYPOINT);
        actionDropdown.classList.remove("active");
        break;
      case Modes.DUPLICATE_WAYPOINT:
        setCurrentMode(Modes.DUPLICATE_WAYPOINT);
        actionDropdown.classList.add("active");
        break;
      case Modes.DELETE_WAYPOINT:
        setCurrentMode(Modes.DELETE_WAYPOINT);
        actionDropdown.classList.add("active");
        break;
      default:
        console.error("Unknown mode selected:", value);
        toastr.error("Oops, something went wrong.", "Error!");
    }
  });

  actionDropdownContainer.append(actionDropdown);

  const label = document.createElement("h3");
  label.innerText = "Waypoint";
  actionDropdownContainer.appendChild(label);
}

export function addStateButtons() {
  const stateButtonsContainer = document.querySelector(".state-container");

  const undoButton = createButton("Undo");
  const redoButton = createButton("Redo");

  undoButton.addEventListener("click", async () => {
    await handleUndo();
  });

  redoButton.addEventListener("click", async () => {
    await handleRedo();
  });

  stateButtonsContainer.append(undoButton, redoButton);
}

export function addCompareButtons() {
  const compareButtonsContainer = document.querySelector(".compare-container");

  const uploadForm = createUploadForm();
  compareButtonsContainer.append(uploadForm);
}

function createUploadForm() {
  const uploadForm = document.createElement("form");
  uploadForm.id = "uploadForm";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "fileInput";
  fileInput.name = "gpxFile";
  fileInput.accept = ".gpx";
  fileInput.required = true;
  fileInput.style.display = "none";

  const fileInputLabel = document.createElement("label");
  fileInputLabel.htmlFor = "fileInput";
  fileInputLabel.id = "fileInputLabel";

  const img = document.createElement("img");
  img.src = "./src/assets/file-earmark-arrow-up-fill.svg";
  img.alt = "Upload";
  img.style.cursor = "pointer";

  fileInputLabel.appendChild(img);

  const submitButton = createButton("Import Activity");
  submitButton.type = "submit";

  fileInput.addEventListener("change", handleFileInputChange);

  uploadForm.append(fileInput, fileInputLabel, submitButton);
  uploadForm.addEventListener("submit", handleFormSubmit);

  return uploadForm;
}

function handleFileInputChange(event) {
  const fileInput = event.target;
  const fileInputLabel = document.getElementById("fileInputLabel");

  if (fileInput.files.length > 0) {
    fileInputLabel.style.backgroundColor = "#f0f0f0";
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const uploadForm = event.target;
  const compareButtonsContainer = uploadForm.parentElement;
  const fileInputLabel = uploadForm.querySelector("#fileInputLabel");

  const result = await handleImport(event);

  if (result.success) {
    compareButtonsContainer.removeChild(uploadForm);
    const removeButton = createRemoveButton(compareButtonsContainer);
    compareButtonsContainer.append(removeButton);
    deactivateMapControls();
  } else {
    fileInputLabel.style.backgroundColor = "#fee7e7";
  }
}

function createButton(type) {
  const button = document.createElement("button");
  button.className = "control-button";
  button.innerHTML = type;
  button.dataset.type = type;
  return button;
}

export function createRemoveButton(compareButtonsContainer) {
  const removeButton = createButton("Remove Imported Activity");

  removeButton.addEventListener("click", async () => {
    await handleRemoveImport();

    removeButton.remove();
    const newUploadForm = createUploadForm(compareButtonsContainer);
    compareButtonsContainer.append(newUploadForm);
    activateMapControls();
  });

  return removeButton;
}
