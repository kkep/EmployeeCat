package com.example.employeecat.employee;

public record EmployeeDTO(int id, String firstName, String lastName) {

    public static EmployeeDTO fromEntity(Employee employee) {
        return new EmployeeDTO(employee.id, employee.firstName, employee.lastName);
    }
}
