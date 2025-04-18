package com.miliconstore.recommendationservice.service;

import com.miliconstore.recommendationservice.dto.ProductDto;
import com.miliconstore.recommendationservice.dto.RecommendationDto;
import com.miliconstore.recommendationservice.entity.UserProductInteraction;
import com.miliconstore.recommendationservice.repository.UserProductInteractionRepository;
import com.miliconstore.recommendationservice.client.ProductServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final UserProductInteractionRepository interactionRepository;
    private final ProductServiceClient productServiceClient;

    @Autowired
    public RecommendationService(UserProductInteractionRepository interactionRepository,
            ProductServiceClient productServiceClient) {
        this.interactionRepository = interactionRepository;
        this.productServiceClient = productServiceClient;
    }

    public void trackUserInteraction(Long userId, Long productId, String interactionType, Double value) {
        UserProductInteraction interaction = new UserProductInteraction();
        interaction.setUserId(userId);
        interaction.setProductId(productId);
        interaction.setInteractionType(interactionType);
        interaction.setValue(value);
        interaction.setTimestamp(LocalDateTime.now());

        interactionRepository.save(interaction);
    }

    public List<RecommendationDto> getPersonalizedRecommendations(Long userId, int limit) {
        // Get user's past interactions
        List<UserProductInteraction> userInteractions = interactionRepository.findByUserId(userId);

        if (userInteractions.isEmpty()) {
            // If no interactions, return popular products
            return getPopularProducts(limit);
        }

        // Extract product categories the user has interacted with
        Set<String> userCategories = userInteractions.stream()
                .map(interaction -> {
                    ProductDto product = productServiceClient.getProductById(interaction.getProductId());
                    return product != null ? product.getCategory().getName() : null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Get products from those categories
        List<ProductDto> categoryProducts = new ArrayList<>();
        for (String category : userCategories) {
            categoryProducts.addAll(productServiceClient.getProductsByCategory(category));
        }

        // Filter out products the user has already interacted with
        Set<Long> interactedProductIds = userInteractions.stream()
                .map(UserProductInteraction::getProductId)
                .collect(Collectors.toSet());

        List<ProductDto> recommendedProducts = categoryProducts.stream()
                .filter(product -> !interactedProductIds.contains(product.getId()))
                .collect(Collectors.toList());

        // Sort by rating and limit
        recommendedProducts.sort(Comparator.comparing(ProductDto::getAverageRating).reversed());

        List<ProductDto> limitedRecommendations = recommendedProducts.stream()
                .limit(limit)
                .collect(Collectors.toList());

        // If we don't have enough recommendations, add some popular products
        if (limitedRecommendations.size() < limit) {
            List<RecommendationDto> popularProducts = getPopularProducts(limit - limitedRecommendations.size());

            List<RecommendationDto> result = limitedRecommendations.stream()
                    .map(product -> new RecommendationDto(product, "Based on your interests"))
                    .collect(Collectors.toList());

            result.addAll(popularProducts);
            return result;
        }

        return limitedRecommendations.stream()
                .map(product -> new RecommendationDto(product, "Based on your interests"))
                .collect(Collectors.toList());
    }

    public List<RecommendationDto> getPopularProducts(int limit) {
        // Get most viewed products
        List<Object[]> popularProductIds = interactionRepository.findMostPopularProducts(limit);

        List<ProductDto> products = popularProductIds.stream()
                .map(result -> productServiceClient.getProductById((Long) result[0]))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return products.stream()
                .map(product -> new RecommendationDto(product, "Popular product"))
                .collect(Collectors.toList());
    }

    public List<RecommendationDto> getSimilarProducts(Long productId, int limit) {
        ProductDto product = productServiceClient.getProductById(productId);

        if (product == null) {
            return Collections.emptyList();
        }

        // Get products from the same category
        List<ProductDto> categoryProducts = productServiceClient.getProductsByCategory(product.getCategory().getName());

        // Filter out the current product
        List<ProductDto> similarProducts = categoryProducts.stream()
                .filter(p -> !p.getId().equals(productId))
                .collect(Collectors.toList());

        // Sort by rating and limit
        similarProducts.sort(Comparator.comparing(ProductDto::getAverageRating).reversed());

        return similarProducts.stream()
                .limit(limit)
                .map(p -> new RecommendationDto(p, "Similar product"))
                .collect(Collectors.toList());
    }

    public List<RecommendationDto> getFrequentlyBoughtTogether(Long productId, int limit) {
        // Find users who interacted with this product
        List<Long> userIds = interactionRepository.findUsersByProductId(productId);

        if (userIds.isEmpty()) {
            return Collections.emptyList();
        }

        // Find other products these users interacted with
        Map<Long, Integer> productCounts = new HashMap<>();

        for (Long userId : userIds) {
            List<UserProductInteraction> interactions = interactionRepository.findByUserIdAndInteractionType(userId,
                    "purchase");

            for (UserProductInteraction interaction : interactions) {
                if (!interaction.getProductId().equals(productId)) {
                    productCounts.put(interaction.getProductId(),
                            productCounts.getOrDefault(interaction.getProductId(), 0) + 1);
                }
            }
        }

        // Sort by frequency
        List<Map.Entry<Long, Integer>> sortedProducts = new ArrayList<>(productCounts.entrySet());
        sortedProducts.sort(Map.Entry.<Long, Integer>comparingByValue().reversed());

        // Get top products
        List<ProductDto> frequentlyBoughtProducts = sortedProducts.stream()
                .limit(limit)
                .map(entry -> productServiceClient.getProductById(entry.getKey()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return frequentlyBoughtProducts.stream()
                .map(p -> new RecommendationDto(p, "Frequently bought together"))
                .collect(Collectors.toList());
    }
}