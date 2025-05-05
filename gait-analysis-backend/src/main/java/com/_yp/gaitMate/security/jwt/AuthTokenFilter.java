package com._yp.gaitMate.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    private static final Logger log = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        log.debug("AuthTokenFilter called for URI: {}", request.getRequestURI());

        try {
            // get the token from the header
            String jwt = jwtUtils.getJwtFromHeader(request);
            log.info("AuthTokenFilter.java: {}", jwt);

            // check the validity of the token
            if (jwt != null && jwtUtils.validateJwtToken(jwt)){
                // extract the username
                String username = jwtUtils.getUsernameFromToken(jwt);

                // extract the userDetails
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // create an authentication object (UsernamePasswordAuthenticationToken)
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                // attach the request details to the authentication obj
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // set the authentication object in the security context to mark the request as authenticated
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                log.info("AuthTokenFilter.java: Authenticated the user successfully");
                log.info("Roles from JWT: {}", userDetails.getAuthorities());
            }

        } catch (Exception e){
            log.error("AuthTokenFilter.java: cannot set user authentication: {}", e.getMessage());
        }

        // now the custom filter is done, pass the control to the spring security filter chain
        filterChain.doFilter(request, response);
    }
}
