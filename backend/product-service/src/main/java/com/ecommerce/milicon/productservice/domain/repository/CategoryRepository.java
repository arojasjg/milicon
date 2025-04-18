package com.ecommerce.milicon.productservice.domain.repository;

import com.ecommerce.milicons.productservice.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findByName(String name);

    List<Category> findByActiveTrue();

    boolean existsByName(String name);
}