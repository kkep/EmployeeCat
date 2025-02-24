package com.example.employeecat.cat;

import org.springframework.data.jpa.domain.Specification;

public class CatSpecifications {
    public static Specification<Cat> isNotDeleted() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("deleted"), false);
    }
}
