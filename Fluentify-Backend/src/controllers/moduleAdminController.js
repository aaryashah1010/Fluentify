import moduleAdminService from '../services/moduleAdminService.js';

class ModuleAdminController {
  // ==================== Language Operations ====================
  
  /**
   * Get all unique languages
   * GET /api/admin/languages
   */
  async getLanguages(req, res, next) {
    try {
      const result = await moduleAdminService.getLanguages();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all courses for a specific language
   * GET /api/admin/languages/:lang/courses
   */
  async getCoursesByLanguage(req, res, next) {
    try {
      const { lang } = req.params;
      const result = await moduleAdminService.getCoursesByLanguage(lang);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Course (Module) Operations ====================
  
  /**
   * Create a new course
   * POST /api/admin/courses
   */
  async createCourse(req, res, next) {
    try {
      const adminId = req.user.id; // From auth middleware
      const result = await moduleAdminService.createCourse(adminId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course details with units and lessons
   * GET /api/admin/courses/:courseId
   */
  async getCourseDetails(req, res, next) {
    try {
      const { courseId } = req.params;
      const result = await moduleAdminService.getCourseDetails(courseId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a course
   * PUT /api/admin/courses/:courseId
   */
  async updateCourse(req, res, next) {
    try {
      const { courseId } = req.params;
      const result = await moduleAdminService.updateCourse(courseId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a course
   * DELETE /api/admin/courses/:courseId
   */
  async deleteCourse(req, res, next) {
    try {
      const { courseId } = req.params;
      const result = await moduleAdminService.deleteCourse(courseId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Unit Operations ====================
  
  /**
   * Create a new unit
   * POST /api/admin/courses/:courseId/units
   */
  async createUnit(req, res, next) {
    try {
      const { courseId } = req.params;
      const result = await moduleAdminService.createUnit(courseId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a unit
   * PUT /api/admin/units/:unitId
   */
  async updateUnit(req, res, next) {
    try {
      const { unitId } = req.params;
      const result = await moduleAdminService.updateUnit(unitId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a unit
   * DELETE /api/admin/units/:unitId
   */
  async deleteUnit(req, res, next) {
    try {
      const { unitId } = req.params;
      const result = await moduleAdminService.deleteUnit(unitId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ==================== Lesson Operations ====================
  
  /**
   * Create a new lesson
   * POST /api/admin/units/:unitId/lessons
   */
  async createLesson(req, res, next) {
    try {
      const { unitId } = req.params;
      const result = await moduleAdminService.createLesson(unitId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a lesson
   * PUT /api/admin/lessons/:lessonId
   */
  async updateLesson(req, res, next) {
    try {
      const { lessonId } = req.params;
      const result = await moduleAdminService.updateLesson(lessonId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a lesson
   * DELETE /api/admin/lessons/:lessonId
   */
  async deleteLesson(req, res, next) {
    try {
      const { lessonId } = req.params;
      const result = await moduleAdminService.deleteLesson(lessonId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ModuleAdminController();
