package com._yp.gaitMate.security.dto;

import com._yp.gaitMate.security.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private Long id;
    private String jwtToken;
    private String email;
    private String username;
    @Setter
    private List<String> roles;

    public void setRolesFromSetOfRoles(Set<Role> roles) {
        this.roles =roles.stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toList());
    }

}