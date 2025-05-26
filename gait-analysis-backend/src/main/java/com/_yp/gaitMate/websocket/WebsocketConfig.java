package com._yp.gaitMate.websocket;


import com._yp.gaitMate.security.jwt.JwtUtils;
import com._yp.gaitMate.security.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@RequiredArgsConstructor
@Slf4j
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This sets the URL where the frontend connects to the WebSocket.
        // Ex:   ws://localhost:8080/ws
        // client sends this together with the Authorization header
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // ✅ allow all origins
                .withSockJS();

        registry.addEndpoint("/ws").setAllowedOriginPatterns("*");  // ✅ allow all origins; // TODO; set this correctly
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Public channel (broadcast to everyone subscribed)
        registry.enableSimpleBroker("/topic");

        // If the frontend sends a message to a destination like /app/chat,
        // then Spring will look for a method with @MessageMapping("/chat").
        // Prefix for messages sent from frontend to backend
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                log.info("Headers: {}", accessor);

                assert accessor != null;
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {

                    String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
                    assert authorizationHeader != null;
                    String token = authorizationHeader.substring(7);

                    String username = jwtUtils.getUsernameFromToken(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

                    accessor.setUser(usernamePasswordAuthenticationToken); //how Spring knows which WebSocket session belongs to which user
                }

                return message;
            }

        });
    }
}