package com.ecommerce.milicon.productservice.application.exception;

public class CategoryWithProductsException extends RuntimeException {
    public CategoryWithProductsException(String message) {
        super(message);
    }
}