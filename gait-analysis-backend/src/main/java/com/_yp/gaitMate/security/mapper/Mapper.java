package com._yp.gaitMate.security.mapper;

import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.model.UserDetailsImpl;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Mapper {
    /**
     * Converts a User entity to UserInfoResponse DTO
     * Note: JWT token is not set in this method and should be set separately
     *
     * @param user The user entity to convert
     * @return UserInfoResponse with user data (without JWT token)
     */
    public UserInfoResponse toUserInfoResponse(User user) {
        UserInfoResponse userInfoResponse = new UserInfoResponse();
        userInfoResponse.setId(user.getUserId());
        userInfoResponse.setEmail(user.getEmail());
        userInfoResponse.setUsername(user.getUsername());
        userInfoResponse.setRoles(user.getRoles());
        return userInfoResponse;
    }

    public UserInfoResponse toUserInfoResponse(UserDetailsImpl userDetails) {

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        UserInfoResponse userInfoResponse = new UserInfoResponse();
        userInfoResponse.setId(userDetails.getId());
        userInfoResponse.setEmail(userDetails.getEmail());
        userInfoResponse.setUsername(userDetails.getUsername());
        userInfoResponse.setRoles(roles);

        return userInfoResponse;
    }
}
