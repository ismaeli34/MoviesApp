package com.example.movies_app.auth.services;
import com.example.movies_app.auth.entities.User;
import com.example.movies_app.auth.entities.UserRole;
import com.example.movies_app.auth.repositories.UserRepository;
import com.example.movies_app.auth.utils.AuthResponse;
import com.example.movies_app.auth.utils.LoginRequest;
import com.example.movies_app.auth.utils.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class    AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager  authenticationManager;

    public AuthResponse register(RegisterRequest registerRequest){
        var user = User.builder().name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);
        var accessToken = jwtService.generateToken(savedUser);
        var refreshToken = refreshTokenService.createRefreshToken(savedUser.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getRefreshToken())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .username(savedUser.getUsername())
                .build();
    }


    public AuthResponse login(LoginRequest loginRequest){
        System.out.println("inside login"+ loginRequest);
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
            loginRequest.getPassword()));
    var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new UsernameNotFoundException("User not found !"));
    var accessToken = jwtService.generateToken(user);
    var refreshToken = refreshTokenService.createRefreshToken(loginRequest.getEmail());
    System.out.println("user"+ user);
        System.out.println("accessToken"+ accessToken);
        System.out.println("refreshToken"+ refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getRefreshToken())
                .name(user.getName())
                .email(user.getEmail())
                .username(user.getUsername())
                .build();
    }
}
