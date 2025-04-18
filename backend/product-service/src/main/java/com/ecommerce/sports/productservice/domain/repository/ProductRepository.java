package com.ecommerce.milicons.productservice.domain.repository;

import com.ecommerce.milicons.productservice.domain.model.Category;
import com.ecommerce.milicons.productservice.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Page<Product> findByCategory(Category category, Pageable pageable);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findByCategoryAndNameContainingIgnoreCase(
            Category category, String name, Pageable pageable);

    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByStockGreaterThan(Integer stock, Pageable pageable);

    Page<Product> findByCategoryAndStockGreaterThan(Category category, Integer stock, Pageable pageable);

    Page<Product> findByOrderByAverageRatingDesc(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true")
    Page<Product> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.stock > 0 AND p.active = true")
    Page<Product> findAllInStock(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category = ?1 AND p.stock > 0 AND p.active = true")
    Page<Product> findByCategoryAndInStock(Category category, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.reviews r GROUP BY p ORDER BY AVG(r.rating) DESC")
    Page<Product> findAllOrderByAverageRatingDesc(Pageable pageable);
}