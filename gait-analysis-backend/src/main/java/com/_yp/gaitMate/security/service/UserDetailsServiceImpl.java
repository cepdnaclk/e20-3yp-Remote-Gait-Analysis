package com._yp.gaitMate.security.service;

import com._yp.gaitMate.security.model.User;
import com._yp.gaitMate.security.model.UserDetailsImpl;
import com._yp.gaitMate.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // fetch the user from the database (Application User)
        User user = userRepository.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("User not found with username: " + username));

        // spring security expects the user in UserDetails format
        // convert the user into a UserDetails object and return
        return UserDetailsImpl.build(user);
    }
}
