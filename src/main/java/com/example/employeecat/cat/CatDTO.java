package com.example.employeecat.cat;

import com.example.employeecat.employee.EmployeeDTO;

public record CatDTO(int id, String nickname, EmployeeDTO employee) {
    public static CatDTO fromEntity(Cat cat) {
        EmployeeDTO employeeDto = EmployeeDTO.fromEntity(cat.getOwner());
        return new CatDTO(cat.id, cat.nickname, employeeDto);
    }
}