package com.example.SkillSphereBackEnd.service.impl;

import com.example.SkillSphereBackEnd.dto.UserDTO;
import com.example.SkillSphereBackEnd.entity.Instructor;
import com.example.SkillSphereBackEnd.entity.Student;
import com.example.SkillSphereBackEnd.entity.User;
import com.example.SkillSphereBackEnd.enums.UserRole;
import com.example.SkillSphereBackEnd.repo.InstructorRepository;
import com.example.SkillSphereBackEnd.repo.StudentRepository;
import com.example.SkillSphereBackEnd.repo.UserRepository;
import com.example.SkillSphereBackEnd.service.UserService;
import com.example.SkillSphereBackEnd.util.VarList;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private InstructorRepository instructorRepository;


    private Set<SimpleGrantedAuthority> getAuthority(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        String role= String.valueOf(user.getRole());
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthority(user));
    }


    @Override
    public int registerUser(UserDTO userDTO, UserRole role) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return VarList.Not_Acceptable;
        } else {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            userDTO.setRole(role);

            // 👇 Dynamically map to correct subclass
            switch (role) {
                case STUDENT:
                    Student student = modelMapper.map(userDTO, Student.class);
                    studentRepository.save(student);
                    break;
                case INSTRUCTOR:
                    Instructor instructor = modelMapper.map(userDTO, Instructor.class);
                    instructorRepository.save(instructor);
                    break;
                default:
                    // fallback or throw
                    throw new IllegalArgumentException("Invalid role: " + role);
            }

            return VarList.Created;
        }
    }


    @Override
    public User getUserByEmail(String email) {
        // Find user by email
        User user = userRepository.findByEmail(email);
        return user;
    }

    @Override
    public UserDTO updateUser(Long userId, UserDTO userDTO) {
        Optional<User> existingUserOpt = userRepository.findById(userId);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            // Ensure ID is retained to avoid creating a new user
            modelMapper.map(userDTO, existingUser);
            existingUser.setId(userId);

            userRepository.save(existingUser); // Now it updates instead of inserting a new one

            return modelMapper.map(existingUser, UserDTO.class);
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }


    @Override
    public void deleteUser(Long userId) {
        // Delete user by id
        userRepository.deleteById(userId);
    }
}
