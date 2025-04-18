package com.ecommerce.sports.userservice.domain.model;

// Enum para roles de usuarios
// Le puse ROLE_ al principio para q funcione spring security
// TODO: agregar rol de VENDEDOR para la proxima version
public enum Role {
    ROLE_USER, // cliente normal
    ROLE_ADMIN, // administradores
    ROLE_SUPPORT // gente de atencion al cliente (lo agregue para el helpdesk)
}