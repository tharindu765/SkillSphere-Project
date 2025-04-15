// CourseCategoryController.java
package com.example.SkillSphereBackEnd.controller;

import com.example.SkillSphereBackEnd.enums.CourseCategory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "*")
public class CourseCategoryController {

    @GetMapping
    public ResponseEntity<CourseCategory[]> getAllCategories() {
        return ResponseEntity.ok(CourseCategory.values());
    }
}
