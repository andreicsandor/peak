export class BodyMetrics {
  constructor({
    age = null,
    weight = null,
    height = null,
    weeklyWorkouts = null,
  } = {}) {
    this.age = age;
    this.weight = weight;
    this.height = height;
    this.weeklyWorkouts = weeklyWorkouts;
  }
}
