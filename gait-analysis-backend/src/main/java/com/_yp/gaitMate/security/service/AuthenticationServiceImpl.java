package com._yp.gaitMate.security.service;

import com._yp.gaitMate.exception.ApiException;
import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.SignupRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.jwt.JwtUtils;
import com._yp.gaitMate.security.model.AppRole;
import com._yp.gaitMate.security.model.Role;
import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.model.UserDetailsImpl;
import com._yp.gaitMate.security.repository.RoleRepository;
import com._yp.gaitMate.security.repository.UserRepository;
import com._yp.gaitMate.security.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

//    private ModelMapper modelMapper;
    private final AuthUtil authUtil;


    @Override
    public UserInfoResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication;
//        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//        } catch (AuthenticationException exception) {
//            throw new APIException("Bad credentials");
//        }
        // TODO: check the need for a try catch

        // once the user is authenticated with username and password,
        // the authentication object is put into security context for future references of the request
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // get the user details from the authentication object
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(), jwtToken, userDetails.getEmail(), userDetails.getUsername(), roles);
        return response;

    }

    @Override
    public UserInfoResponse registerUserAndLogin(SignupRequest signupRequest) {
        registerUser(signupRequest);
        // Login just after registering
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPassword(signupRequest.getPassword());
        loginRequest.setUsername(signupRequest.getUsername());

        return authenticateUser(loginRequest);
    }

    @Override
    public User registerUser(SignupRequest signupRequest) {
        // check the availability of the username and email
        if (userRepository.existsByUsername(signupRequest.getUsername())){
            throw new ApiException("username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())){
            throw new ApiException("Email is already in use!");
        }

        // create a new user account
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));


        // assigning the roles*******************************************
        Set<String> strRoles = signupRequest.getRoles();

        if (strRoles==null){
            throw new ApiException("Provide the roles!");
        }
        // Actual roles of Role class
        Set<Role> roles = new HashSet<>();



        Role patientRole = roleRepository.findByRoleName(AppRole.ROLE_PATIENT)
                .orElseThrow(() -> new ApiException("Role is not found"));

        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                .orElseThrow(() -> new ApiException("Role is not found"));

        Role clinicRole = roleRepository.findByRoleName(AppRole.ROLE_CLINIC)
                .orElseThrow(() -> new ApiException("Role is not found"));

        strRoles.forEach(role -> {
            switch (role) {
                case "ROLE_PATIENT":
                    roles.add(patientRole);
                    break;
                case "ROLE_ADMIN":
                    roles.add(adminRole);
                    break;
                case "ROLE_CLINIC":
                    roles.add(clinicRole);
                    break;
                default:
                    throw new ApiException("Invalid role!");
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return user;
    }


    @Override
    public UserInfoResponse getUserDetails(Authentication authentication) {
        return authUtil.loggedInUserResponse();
    }
}
