export class ImportManager {
  constructor() {
    this.importedRoute = null;
    this.removedRoutesStack = [];
    this.percentageSimilarity = null;
  }

  setImportedRoute(route) {
    this.importedRoute = route;
  }

  getImportedRoute() {
    return this.importedRoute;
  }

  clearImportedRoute() {
    if (this.importedRoute) {
      this.removedRoutesStack.push(this.importedRoute);
      this.importedRoute = null;
    }
  }

  getRemovedRoutesStack() {
    return this.removedRoutesStack;
  }

  clearRemovedRoutesStack() {
    this.removedRoutesStack = [];
  }

  popRemovedRoute() {
    return this.removedRoutesStack.pop();
  }

  setPercentageSimilarity(percentageSimilarity) {
    this.percentageSimilarity = percentageSimilarity;
  }

  getPercentageSimilarity() {
    return this.percentageSimilarity;
  }
}
