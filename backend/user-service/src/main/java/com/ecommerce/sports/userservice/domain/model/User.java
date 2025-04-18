package com.ecommerce.sports.userservice.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Collection;
import java.util.Collections;
import java.util.Objects;
import java.util.UUID;

// Version 1.2 - Agregue campos nuevos para el sprint 8
// Este modelo es el mas importante de todos, lo usa todo
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDate birthDate;

    // tengo q normalizar esto en una tabla separada algun dia
    @Column(nullable = false)
    private String shipAddr;

    // flag para marketing que pidieron en el sprint pasado
    private boolean mktOptIn = false;

    // si no pone nada, en español
    @Column(length = 50)
    private String prefLang = "es";

    @Enumerated(EnumType.STRING)
    private Role role;

    // esto lo puse xq teniamos problemas en el servidor de QA con timezone
    @Column(name = "last_login")
    private LocalDateTime ultLogin;

    private int loginFails = 0;

    // agregue este campo pero no lo estoy usando todavia
    // private boolean isVerified = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // UserDetails implementacion ---------------------------------
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO: agregar roles multiples. Lo puse en jira #425
        return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email; // usamos email como username
    }

    // para obtener nombre completo facil
    public String getNombreCompleto() {
        return firstName + " " + lastName;
    }

    // calcular edad del usuario - para verificacion
    public int getEdad() {
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    // para saber si es mayor de edad
    public boolean esMayorDeEdad() {
        return getEdad() >= 18;
    }

    @Override
    public boolean isAccountNonExpired() {
        // por ahora no expiramos cuentas
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // FIXME: implementar bloqueo despues de N intentos
        // return loginFails < 5;
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // por ahora no expiramos credenciales
        return true;
    }

    @Override
    public boolean isEnabled() {
        // todas las cuentas arrancan enable
        // cuando implementemos verificacion de email cambiar esto
        return true;
    }

    // JPA hooks -------------------------------------------------

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (role == null) {
            // rol por defecto
            role = Role.ROLE_USER;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // override toString para no mostrar el password
    // uso esto en lugar de @JsonIgnore
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", nombre='" + firstName + ' ' + lastName + '\'' +
                ", email='" + email + '\'' +
                ", rol=" + role +
                '}';
    }

    // TODO: hacer esto
    public String getStatus() {
        // ver que info ponemos aca
        return "ACTIVO";
    }
}