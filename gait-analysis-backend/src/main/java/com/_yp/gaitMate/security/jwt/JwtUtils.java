package com._yp.gaitMate.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.expiration.ms}")
    private int jwtExpirationMs;

    @Value("${jwt.secret}")
    private String jwtSecret;

    // Get JWT from header
    public String getJwtFromHeader(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");

        log.debug("Authorization Header: {}", bearerToken);

        if (bearerToken != null && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7);
        }

        return null;
    }


    // Generate token from username
    public String generateTokenFromUsername(UserDetails userDetails) {

        String username = userDetails.getUsername();

        Date now = Date.from(Instant.now());
        Date expiryDate = Date.from(Instant.now().plusMillis(jwtExpirationMs));

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key())
                .compact(); // return the token in a compact string
    }

    // Get username from JWT token
    public String getUsernameFromToken(String token) {
        return Jwts.parser()                   // 1. Create a parser
                .verifyWith((SecretKey) key()) // 2. Set the verification key
                .build()                       // 3. Build the parser
                .parseSignedClaims(token)      // 4. Parse and verify the token
                .getPayload()                  // 5. Get the payload (claims)
                .getSubject();                 // 6. Extract the username
    }

    // Generate signing key
    public Key key(){
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtSecret) // decode the secret key into bytes
        );
    }

    // validate JWT token
    public boolean validateJwtToken(String authToken) {
        try {
            System.out.println("Validate");
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(authToken);

            // if the previous line works fine, the token is valid
            return true;

        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
