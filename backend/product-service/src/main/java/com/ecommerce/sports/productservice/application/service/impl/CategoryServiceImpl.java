package com.ecommerce.milicons.productservice.application.service.impl;

import com.ecommerce.milicons.productservice.application.dto.category.CategoryRequest;
import com.ecommerce.milicons.productservice.application.dto.category.CategoryResponse;
import com.ecommerce.milicons.productservice.application.exception.CategoryAlreadyExistsException;
import com.ecommerce.milicons.productservice.application.exception.CategoryNotFoundException;
import com.ecommerce.milicons.productservice.application.exception.CategoryWithProductsException;
import com.ecommerce.milicons.productservice.application.mapper.CategoryMapper;
import com.ecommerce.milicons.productservice.application.service.CategoryService;
import com.ecommerce.milicons.productservice.domain.model.Category;
import com.ecommerce.milicons.productservice.domain.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new CategoryAlreadyExistsException("La categoría ya existe con el nombre: " + request.getName());
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID id) {
        Category category = findCategoryEntityById(id);
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = findCategoryEntityById(id);

        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByName(request.getName())) {
            throw new CategoryAlreadyExistsException("La categoría ya existe con el nombre: " + request.getName());
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = findCategoryEntityById(id);

        if (!category.getProducts().isEmpty()) {
            throw new CategoryWithProductsException(
                    "No se puede eliminar la categoría porque tiene productos asociados");
        }

        categoryRepository.delete(category);
    }

    @Override
    @Transactional(readOnly = true)
    public Category findCategoryEntityById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Categoría no encontrada con ID: " + id));
    }
}