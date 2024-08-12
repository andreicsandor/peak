package com.peak.users.dto;

import java.util.Date;

public class PersonDTO {
    private String personId;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private Date birthdate;
    private String gender;
    private Integer weight;
    private Integer height;
    private Integer weeklyWorkouts;

    public PersonDTO() {
    }

    public PersonDTO(String personId, String username, String password, String firstName, String lastName, Date birthdate, String gender, Integer weight, Integer height, Integer weeklyWorkouts) {
        this.personId = personId;
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

    // Getters and Setters
    public String getPersonId() {
        return personId;
    }

    public void setPersonId(String personId) {
        this.personId = personId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getWeeklyWorkouts() {
        return weeklyWorkouts;
    }

    public void setWeeklyWorkouts(Integer weeklyWorkouts) {
        this.weeklyWorkouts = weeklyWorkouts;
    }
}
