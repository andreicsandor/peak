export class StateManager {
  constructor() {
    this.actionStack = [];
    this.redoStack = [];
  }

  registerAdd(marker) {
    this.actionStack.push({ type: "add", marker });
    this.clearRedoStack();
  }

  registerDelete(marker, previousMarker) {
    this.actionStack.push({
      type: "delete",
      marker: marker,
      previousMarker: previousMarker,
    });
    this.clearRedoStack();
  }

  registerMoved(marker) {
    const previousCoordinates = marker.userData.previousCoordinates;
    const newCoordinates = marker.getLngLat();

    this.actionStack.push({
      type: "move",
      marker: marker,
      from: previousCoordinates,
      to: newCoordinates,
    });
    this.clearRedoStack();
  }

  undoAction() {
    if (this.actionStack.length > 0) {
      const action = this.actionStack.pop();
      this.redoStack.push(action);
      return action;
    }
    return null;
  }

  redoAction() {
    if (this.redoStack.length > 0) {
      const action = this.redoStack.pop();
      this.actionStack.push(action);
      return action;
    }
    return null;
  }

  clearRedoStack() {
    this.redoStack = [];
  }
}
