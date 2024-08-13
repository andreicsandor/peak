package com.peak.users.dto;

public class BodyMetricsDTO {
    private Integer age;
    private Integer weight;
    private Integer height;
    private Integer weeklyWorkouts;

    public BodyMetricsDTO() {
    }

    public BodyMetricsDTO(Integer age, Integer weight, Integer height, Integer weeklyWorkouts) {
        this.age = age;
        this.weight = weight;
        this.height = height;
        this.weeklyWorkouts = weeklyWorkouts;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
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
