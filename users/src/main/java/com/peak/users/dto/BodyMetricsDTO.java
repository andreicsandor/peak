package com.peak.users.dto;

public class BodyMetricsDTO {
    private String personId;
    private String username;
    private Integer weight;
    private Integer height;
    private Integer weeklyWorkouts;

    public BodyMetricsDTO() {
    }

    public BodyMetricsDTO(String personId, String username, Integer weight, Integer height, Integer weeklyWorkouts) {
        this.personId = personId;
        this.username = username;
        this.weight = weight;
        this.height = height;
        this.weeklyWorkouts = weeklyWorkouts;
    }

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
