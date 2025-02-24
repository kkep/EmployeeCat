package com.example.employeecat.employee;

import com.example.employeecat.cat.Cat;
import com.example.employeecat.cat.CatSpecifications;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.Nullable;
import com.vaadin.hilla.crud.ListRepositoryService;
import com.vaadin.hilla.crud.filter.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

@BrowserCallable
@AnonymousAllowed
public class EmployeeService extends ListRepositoryService<Employee, Long, EmployeeRepository> {

    /**
     * Сохранение модели сотрудника с его кошками
     *
     * @return Employee
     */
    public Employee save(Employee employee) {
        if (employee.getCats() != null) {
            for (Cat cat : employee.getCats()) {
                if (cat.getOwner() == null) {
                    cat.setOwner(employee); // Manually set owner if missing
                }
            }
        }
        return getRepository().save(employee);
    }

    public void delete(Long id) {
        this.getRepository().deleteById(id);
    }

    public Iterable<Employee> all() {
        return this.getRepository().findAll();
    }
}
