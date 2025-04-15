package com.example.SkillSphereBackEnd.service;

import com.example.SkillSphereBackEnd.dto.UserDTO;
import com.example.SkillSphereBackEnd.entity.User;
import com.example.SkillSphereBackEnd.enums.UserRole;

public interface UserService {

    int registerUser(UserDTO userDTO, UserRole role); // Register a new user with a role
    User getUserByEmail(String email); // Get user by email
    UserDTO updateUser(Long userId, UserDTO userDTO); // Update user details
    void deleteUser(Long userId); // Delete a user
}
