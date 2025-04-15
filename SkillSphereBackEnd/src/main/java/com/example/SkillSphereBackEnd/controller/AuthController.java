package com.example.SkillSphereBackEnd.controller;



import com.example.SkillSphereBackEnd.dto.AuthDTO;
import com.example.SkillSphereBackEnd.dto.ResponseDTO;
import com.example.SkillSphereBackEnd.dto.UserDTO;
import com.example.SkillSphereBackEnd.entity.User;
import com.example.SkillSphereBackEnd.service.impl.UserServiceImpl;
import com.example.SkillSphereBackEnd.util.JwtUtil;
import com.example.SkillSphereBackEnd.util.VarList;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userService;
    private final ResponseDTO responseDTO;

    @Autowired
    private ModelMapper modelMapper;

    //constructor injection
    public AuthController(JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserServiceImpl userService, ResponseDTO responseDTO) {
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.responseDTO = responseDTO;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ResponseDTO> authenticate(@RequestBody UserDTO userDTO) {
        try {
            System.out.println("Email: " + userDTO.getEmail());
            System.out.println("Password: " + userDTO.getPassword());

            // Spring Security Authentication
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword())
            );

            // Successfully authenticated, now fetch user details
            User loadedUser = userService.getUserByEmail(userDTO.getEmail());

            if (loadedUser == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ResponseDTO(VarList.Conflict, "Authorization Failure! Please Try Again", null));
            }
            UserDTO loadedUserDTO = modelMapper.map(loadedUser, UserDTO.class);


            // Generate JWT Token
            String token = jwtUtil.generateToken(loadedUserDTO);
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ResponseDTO(VarList.Conflict, "Authorization Failure! Please Try Again", null));
            }

            AuthDTO authDTO = new AuthDTO();
            authDTO.setEmail(loadedUser.getEmail());
            authDTO.setToken(token);
            authDTO.setRole(String.valueOf(loadedUser.getRole()));
            authDTO.setId(loadedUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ResponseDTO(VarList.Created, "Login Successful", authDTO));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDTO(VarList.Unauthorized, "Invalid Credentials", e.getMessage()));
        }
    }

}