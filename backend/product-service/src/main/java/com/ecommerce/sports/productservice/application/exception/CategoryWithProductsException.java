package com.ecommerce.milicons.productservice.application.exception;

public class CategoryWithProductsException extends RuntimeException {
    public CategoryWithProductsException(String message) {
        super(message);
    }
}