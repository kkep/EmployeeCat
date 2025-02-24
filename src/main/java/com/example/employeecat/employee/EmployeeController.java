package com.example.employeecat.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    /**
     * Для примера
     */
    @GetMapping("/all")
    public Iterable<Employee> all() {
        return employeeService.all();
    }
}
