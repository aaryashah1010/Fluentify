import moduleAdminRepository from '../repositories/moduleAdminRepository.js';

class ModuleAdminService {
  // ==================== Language Operations ====================
  
  /**
   * Get all unique languages
   */
  async getLanguages() {
    const languages = await moduleAdminRepository.getLanguages();
    return {
      success: true,
      data: languages
    };
  }

  /**
   * Get all courses for a specific language
   */
  async getCoursesByLanguage(language) {
    if (!language) {
      throw new Error('Language parameter is required');
    }

    const courses = await moduleAdminRepository.getCoursesByLanguage(language);
    return {
      success: true,
      data: courses
    };
  }

  // ==================== Course (Module) Operations ====================
  
  /**
   * Create a new course
   */
  async createCourse(adminId, courseData) {
    // Validate required fields
    if (!courseData.title || !courseData.language) {
      throw new Error('Title and language are required');
    }

    if (!courseData.level) {
      throw new Error('Level is required (e.g., Beginner, Intermediate, Advanced)');
    }

    // Prepare course data
    const course = {
      admin_id: adminId,
      language: courseData.language,
      level: courseData.level,
      title: courseData.title,
      description: courseData.description || '',
      thumbnail_url: courseData.thumbnail_url || null,
      estimated_duration: courseData.estimated_duration || null,
      is_published: courseData.is_published || false
    };

    const newCourse = await moduleAdminRepository.createCourse(course);
    
    return {
      success: true,
      message: 'Course created successfully',
      data: newCourse
    };
  }

  /**
   * Get course details with units and lessons
   */
  async getCourseDetails(courseId) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    const course = await moduleAdminRepository.getCourseDetails(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    return {
      success: true,
      data: course
    };
  }

  /**
   * Update a course
   */
  async updateCourse(courseId, courseData) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Check if course exists
    const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    const updatedCourse = await moduleAdminRepository.updateCourse(courseId, courseData);
    
    return {
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    };
  }

  /**
   * Delete a course
   */
  async deleteCourse(courseId) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Check if course exists
    const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    const deletedCourse = await moduleAdminRepository.deleteCourse(courseId);
    
    return {
      success: true,
      message: 'Course deleted successfully',
      data: deletedCourse
    };
  }

  // ==================== Unit Operations ====================
  
  /**
   * Create a new unit
   */
  async createUnit(courseId, unitData) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    if (!unitData.title) {
      throw new Error('Unit title is required');
    }

    // Verify course exists
    const course = await moduleAdminRepository.getCourseDetails(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Prepare unit data
    const unit = {
      module_id: courseId,
      title: unitData.title,
      description: unitData.description || '',
      difficulty: unitData.difficulty || 'Beginner',
      estimated_time: unitData.estimated_time || 0
    };

    const newUnit = await moduleAdminRepository.createUnit(unit);
    
    return {
      success: true,
      message: 'Unit created successfully',
      data: newUnit
    };
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    // Check if unit exists
    const existingUnit = await moduleAdminRepository.getUnitById(unitId);
    if (!existingUnit) {
      throw new Error('Unit not found');
    }

    const updatedUnit = await moduleAdminRepository.updateUnit(unitId, unitData);
    
    return {
      success: true,
      message: 'Unit updated successfully',
      data: updatedUnit
    };
  }

  /**
   * Delete a unit
   */
  async deleteUnit(unitId) {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    // Check if unit exists
    const existingUnit = await moduleAdminRepository.getUnitById(unitId);
    if (!existingUnit) {
      throw new Error('Unit not found');
    }

    const deletedUnit = await moduleAdminRepository.deleteUnit(unitId);
    
    return {
      success: true,
      message: 'Unit deleted successfully',
      data: deletedUnit
    };
  }

  // ==================== Lesson Operations ====================
  
  /**
   * Create a new lesson
   */
  async createLesson(unitId, lessonData) {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }

    if (!lessonData.title || !lessonData.content_type) {
      throw new Error('Lesson title and content type are required');
    }

    // Verify unit exists
    const unit = await moduleAdminRepository.getUnitById(unitId);
    if (!unit) {
      throw new Error('Unit not found');
    }

    // Prepare lesson data
    const lesson = {
      unit_id: unitId,
      title: lessonData.title,
      content_type: lessonData.content_type,
      description: lessonData.description || '',
      media_url: lessonData.media_url || null,
      key_phrases: lessonData.key_phrases || [],
      vocabulary: lessonData.vocabulary || {},
      grammar_points: lessonData.grammar_points || {},
      exercises: lessonData.exercises || {},
      xp_reward: lessonData.xp_reward || 0
    };

    const newLesson = await moduleAdminRepository.createLesson(lesson);
    
    return {
      success: true,
      message: 'Lesson created successfully',
      data: newLesson
    };
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    if (!lessonId) {
      throw new Error('Lesson ID is required');
    }

    // Check if lesson exists
    const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
    if (!existingLesson) {
      throw new Error('Lesson not found');
    }

    const updatedLesson = await moduleAdminRepository.updateLesson(lessonId, lessonData);
    
    return {
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson
    };
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    if (!lessonId) {
      throw new Error('Lesson ID is required');
    }

    // Check if lesson exists
    const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
    if (!existingLesson) {
      throw new Error('Lesson not found');
    }

    const deletedLesson = await moduleAdminRepository.deleteLesson(lessonId);
    
    return {
      success: true,
      message: 'Lesson deleted successfully',
      data: deletedLesson
    };
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   */
  async getPublishedLanguages() {
    const languages = await moduleAdminRepository.getPublishedLanguages();
    return {
      success: true,
      data: languages
    };
  }

  /**
   * Get published courses for a specific language for learners
   */
  async getPublishedCoursesByLanguage(language) {
    if (!language) {
      throw new Error('Language parameter is required');
    }

    const courses = await moduleAdminRepository.getPublishedCoursesByLanguage(language);
    return {
      success: true,
      data: courses
    };
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    const course = await moduleAdminRepository.getPublishedCourseDetails(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    return {
      success: true,
      data: course
    };
  }
}

export default new ModuleAdminService();
