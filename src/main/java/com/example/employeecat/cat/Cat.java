package com.example.employeecat.cat;

import com.example.employeecat.employee.Employee;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name="cats")
public class Cat {

    @Id
    @JsonProperty(value = "id")
    @Column(name = "id", columnDefinition = "serrial")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @JsonProperty(value = "nickname")
    @Column(name = "nickname")
    String nickname;

    @JsonProperty(value = "deleted")
    @Column(name = "deleted")
    Boolean deleted;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private Employee owner;

    public Employee getOwner() { return owner; }
    public void setOwner(Employee owner) { this.owner = owner; }
}
