package com.example.SkillSphereBackEnd.controller;

import com.example.SkillSphereBackEnd.dto.AuthDTO;
import com.example.SkillSphereBackEnd.dto.ResponseDTO;
import com.example.SkillSphereBackEnd.dto.UserDTO;
import com.example.SkillSphereBackEnd.entity.User;
import com.example.SkillSphereBackEnd.enums.UserRole;
import com.example.SkillSphereBackEnd.service.UserService;
import com.example.SkillSphereBackEnd.util.JwtUtil;
import com.example.SkillSphereBackEnd.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    private final JwtUtil jwtUtil;

    // Constructor Injection
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(value = "/register")
    public ResponseEntity<ResponseDTO> registerUser(
            @RequestBody UserDTO userDTO,
            @RequestParam("role") UserRole role) { // Role passed as query parameter

        try {
            // Save user and get the result code (int)
            int res = userService.registerUser(userDTO, role); // Returns an int (e.g., Created, Not_Acceptable, etc.)

            switch (res) {
                case VarList.Created -> {
                    // Generate JWT token
                    String token = jwtUtil.generateToken(userDTO);
                    AuthDTO authDTO = new AuthDTO();
                    authDTO.setEmail(userDTO.getEmail());
                    authDTO.setToken(token);

                    // Return success response
                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(new ResponseDTO(VarList.Created, "Registration Successful", authDTO));
                }
                case VarList.Not_Acceptable -> {
                    return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                            .body(new ResponseDTO(VarList.Not_Acceptable, "Email Already Used", null));
                }
                default -> {
                    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                            .body(new ResponseDTO(VarList.Bad_Gateway, "Error", null));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO(VarList.Internal_Server_Error, e.getMessage(), null));
        }
    }


    // Get user by email
    @GetMapping("/email")
    public User getUserByEmail(@RequestParam String email) {
        User userDTO = userService.getUserByEmail(email);
        return userDTO;
    }

    // Update user details
    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(userId, userDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a user
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
