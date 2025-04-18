package com.ecommerce.milicons.userservice.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;

/**
 * Redis cache configuration
 */
@Configuration
@EnableCaching
public class CacheConfig {

        @Bean
        public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
                RedisCacheConfiguration cacheConfig = defaultCacheConfig(Duration.ofMinutes(10))
                                .disableCachingNullValues();

                return RedisCacheManager.builder(connectionFactory)
                                .cacheDefaults(cacheConfig)
                                .withCacheConfiguration("users", defaultCacheConfig(Duration.ofMinutes(5)))
                                .withCacheConfiguration("profiles", defaultCacheConfig(Duration.ofMinutes(5)))
                                .withCacheConfiguration("addresses", defaultCacheConfig(Duration.ofMinutes(5)))
                                .build();
        }

        private RedisCacheConfiguration defaultCacheConfig(Duration duration) {
                return RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(duration)
                                .serializeValuesWith(
                                                RedisSerializationContext.SerializationPair.fromSerializer(
                                                                new GenericJackson2JsonRedisSerializer()));
        }
}