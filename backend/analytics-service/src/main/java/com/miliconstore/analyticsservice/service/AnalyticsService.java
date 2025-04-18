package com.miliconstore.analyticsservice.service;

import com.miliconstore.analyticsservice.dto.ProductAnalyticsDto;
import com.miliconstore.analyticsservice.dto.SalesReportDto;
import com.miliconstore.analyticsservice.dto.UserAnalyticsDto;
import com.miliconstore.analyticsservice.entity.OrderEvent;
import com.miliconstore.analyticsservice.entity.ProductView;
import com.miliconstore.analyticsservice.entity.UserActivity;
import com.miliconstore.analyticsservice.repository.OrderEventRepository;
import com.miliconstore.analyticsservice.repository.ProductViewRepository;
import com.miliconstore.analyticsservice.repository.UserActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final OrderEventRepository orderEventRepository;
    private final ProductViewRepository productViewRepository;
    private final UserActivityRepository userActivityRepository;

    @Autowired
    public AnalyticsService(OrderEventRepository orderEventRepository,
            ProductViewRepository productViewRepository,
            UserActivityRepository userActivityRepository) {
        this.orderEventRepository = orderEventRepository;
        this.productViewRepository = productViewRepository;
        this.userActivityRepository = userActivityRepository;
    }

    public void trackProductView(Long productId, Long userId, String productName, String categoryName) {
        ProductView productView = new ProductView();
        productView.setProductId(productId);
        productView.setUserId(userId);
        productView.setProductName(productName);
        productView.setCategoryName(categoryName);
        productView.setViewTime(LocalDateTime.now());

        productViewRepository.save(productView);
    }

    public void trackOrderEvent(Long orderId, Long userId, Double totalAmount, List<String> productNames) {
        OrderEvent orderEvent = new OrderEvent();
        orderEvent.setOrderId(orderId);
        orderEvent.setUserId(userId);
        orderEvent.setTotalAmount(totalAmount);
        orderEvent.setProductNames(String.join(",", productNames));
        orderEvent.setOrderTime(LocalDateTime.now());

        orderEventRepository.save(orderEvent);
    }

    public void trackUserActivity(Long userId, String activityType, String details) {
        UserActivity userActivity = new UserActivity();
        userActivity.setUserId(userId);
        userActivity.setActivityType(activityType);
        userActivity.setDetails(details);
        userActivity.setActivityTime(LocalDateTime.now());

        userActivityRepository.save(userActivity);
    }

    public List<ProductAnalyticsDto> getTopViewedProducts(int limit) {
        LocalDateTime startDate = LocalDateTime.now().minus(30, ChronoUnit.DAYS);

        return productViewRepository.findTopViewedProductsSince(startDate, limit)
                .stream()
                .map(result -> {
                    ProductAnalyticsDto dto = new ProductAnalyticsDto();
                    dto.setProductId((Long) result[0]);
                    dto.setProductName((String) result[1]);
                    dto.setViewCount(((Number) result[2]).intValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<ProductAnalyticsDto> getTopSellingProducts(int limit) {
        LocalDateTime startDate = LocalDateTime.now().minus(30, ChronoUnit.DAYS);

        return orderEventRepository.findTopSellingProductsSince(startDate, limit)
                .stream()
                .map(result -> {
                    ProductAnalyticsDto dto = new ProductAnalyticsDto();
                    dto.setProductId((Long) result[0]);
                    dto.setProductName((String) result[1]);
                    dto.setSalesCount(((Number) result[2]).intValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public SalesReportDto getSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<OrderEvent> orders = orderEventRepository.findByOrderTimeBetween(startDateTime, endDateTime);

        SalesReportDto report = new SalesReportDto();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setTotalOrders(orders.size());
        report.setTotalSales(orders.stream().mapToDouble(OrderEvent::getTotalAmount).sum());

        // Calculate daily sales
        Map<LocalDate, Double> dailySales = new HashMap<>();
        for (OrderEvent order : orders) {
            LocalDate orderDate = order.getOrderTime().toLocalDate();
            dailySales.put(orderDate, dailySales.getOrDefault(orderDate, 0.0) + order.getTotalAmount());
        }

        report.setDailySales(dailySales);

        // Calculate category distribution
        Map<String, Integer> categorySales = new HashMap<>();
        for (OrderEvent order : orders) {
            String[] products = order.getProductNames().split(",");
            for (String product : products) {
                String category = productViewRepository.findCategoryByProductName(product);
                if (category != null) {
                    categorySales.put(category, categorySales.getOrDefault(category, 0) + 1);
                }
            }
        }

        report.setCategorySales(categorySales);

        return report;
    }

    public List<UserAnalyticsDto> getActiveUsers(int limit) {
        LocalDateTime startDate = LocalDateTime.now().minus(30, ChronoUnit.DAYS);

        return userActivityRepository.findMostActiveUsersSince(startDate, limit)
                .stream()
                .map(result -> {
                    UserAnalyticsDto dto = new UserAnalyticsDto();
                    dto.setUserId((Long) result[0]);
                    dto.setActivityCount(((Number) result[1]).intValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}