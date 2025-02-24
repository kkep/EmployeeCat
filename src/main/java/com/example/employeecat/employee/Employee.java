package com.example.employeecat.employee;

import com.example.employeecat.cat.Cat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name="employees")
public class Employee {

    @Id
    @JsonProperty(value = "id")
    @Column(name = "id", columnDefinition = "serrial")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;

    @JsonProperty(value = "lastName")
    @Column(name = "last_name")
    public String lastName;

    @JsonProperty(value = "firstName")
    @Column(name = "first_name")
    public String firstName;

    @JsonProperty(value = "cats")
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @SQLRestriction("deleted = false")
    List<Cat> cats = new ArrayList<>();

    public void addCat(Cat cat) {
        cats.add(cat);
        cat.setOwner(this);
    }

    public Collection<Cat> getCats() {
        return this.cats;
    }
}
