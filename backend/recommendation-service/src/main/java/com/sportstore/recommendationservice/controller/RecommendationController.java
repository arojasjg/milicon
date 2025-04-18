package com.miliconstore.recommendationservice.controller;

import com.miliconstore.recommendationservice.dto.InteractionDto;
import com.miliconstore.recommendationservice.dto.RecommendationDto;
import com.miliconstore.recommendationservice.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/track")
    public ResponseEntity<Void> trackInteraction(@RequestBody InteractionDto interactionDto) {
        recommendationService.trackUserInteraction(
                interactionDto.getUserId(),
                interactionDto.getProductId(),
                interactionDto.getInteractionType(),
                interactionDto.getValue());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationDto>> getPersonalizedRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        List<RecommendationDto> recommendations = recommendationService.getPersonalizedRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<RecommendationDto>> getPopularProducts(
            @RequestParam(defaultValue = "5") int limit) {
        List<RecommendationDto> recommendations = recommendationService.getPopularProducts(limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/similar/{productId}")
    public ResponseEntity<List<RecommendationDto>> getSimilarProducts(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "5") int limit) {
        List<RecommendationDto> recommendations = recommendationService.getSimilarProducts(productId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/frequently-bought-together/{productId}")
    public ResponseEntity<List<RecommendationDto>> getFrequentlyBoughtTogether(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "5") int limit) {
        List<RecommendationDto> recommendations = recommendationService.getFrequentlyBoughtTogether(productId, limit);
        return ResponseEntity.ok(recommendations);
    }
}