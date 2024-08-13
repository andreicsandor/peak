export class Person {
  constructor({
    id = null,
    username = "",
    password = "",
    firstName = "",
    lastName = "",
    birthdate = "",
    gender = "",
    weight = 0,
    height = 0,
    weeklyWorkouts = 0,
  } = {}) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.gender = gender;
    this.weight = weight;
    this.height = height;
    this.weeklyWorkouts = weeklyWorkouts;
  }
}
