package com.example.employeecat.cat;

import com.example.employeecat.employee.Employee;
import com.example.employeecat.employee.EmployeeRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.Nonnull;
import com.vaadin.hilla.Nullable;
import com.vaadin.hilla.crud.JpaFilterConverter;
import com.vaadin.hilla.crud.ListService;
import com.vaadin.hilla.crud.filter.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

@BrowserCallable
@AnonymousAllowed
public class CatService implements ListService<CatDTO> {
    private final CatRepository catRepository;
    private final EmployeeRepository employeeRepository;

    public CatService(CatRepository catRepository, EmployeeRepository employeeRepository) {
        this.catRepository = catRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Сохранение модели кошки
     *
     * @return Cat
     */
    public Cat save(Cat cat, Long ownerId) {
        Optional<Employee> owner = employeeRepository.findById(ownerId);
        owner.ifPresent(cat::setOwner);

        return this.catRepository.save(cat);
    }

    public void delete(Long id) {
        this.catRepository.deleteById(id);
    }

    @Override
    @Nonnull
    public List<CatDTO> list(Pageable pageable, @Nullable Filter filter) {
        Specification<Cat> spec = filter != null
                ? JpaFilterConverter.toSpec(filter, Cat.class).and(CatSpecifications.isNotDeleted())
                : Specification.anyOf();
        // Query the JPA repository
        Page<Cat> cats = catRepository.findAll(spec, pageable);
        // Map entities to DTOs and return result
        return cats.stream().map(CatDTO::fromEntity).toList();
    }
}
