package com.example.employeecat.employee;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Для примера
 * Можно использовать в Vaadin
 */
@Endpoint
@AnonymousAllowed
public class EmployeeEndpoint {

    @Autowired
    EmployeeService employeeService;

    public Iterable<Employee> all() {
        return employeeService.all();
    }
}
