// This file should be removed or renamed to avoid duplication
// If we can't delete it, we can make it a placeholder that delegates to the real implementation
package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * @deprecated This class is deprecated. Use
 *             {@link com.ecommerce.milicons.productservice.application.service.impl.ProductServiceImpl}
 *             instead.
 */
@Deprecated
@Service("legacyProductServiceImpl")
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final com.ecommerce.milicons.productservice.application.service.impl.ProductServiceImpl delegate;

    @Override
    public ProductResponse updateProduct(UUID id, ProductUpdateRequest updateRequest) {
        return delegate.updateProduct(id, updateRequest);
    }

    @Override
    public ProductResponse createProduct(ProductUpdateRequest createRequest) {
        return delegate.createProduct(createRequest);
    }
}