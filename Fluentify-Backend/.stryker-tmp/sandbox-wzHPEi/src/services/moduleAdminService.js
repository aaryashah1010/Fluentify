// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import moduleAdminRepository from '../repositories/moduleAdminRepository.js';
class ModuleAdminService {
  // ==================== Language Operations ====================

  /**
   * Get all unique languages
   */
  async getLanguages() {
    if (stryMutAct_9fa48("3401")) {
      {}
    } else {
      stryCov_9fa48("3401");
      const languages = await moduleAdminRepository.getLanguages();
      return stryMutAct_9fa48("3402") ? {} : (stryCov_9fa48("3402"), {
        success: stryMutAct_9fa48("3403") ? false : (stryCov_9fa48("3403"), true),
        data: languages
      });
    }
  }

  /**
   * Get all courses for a specific language
   */
  async getCoursesByLanguage(language) {
    if (stryMutAct_9fa48("3404")) {
      {}
    } else {
      stryCov_9fa48("3404");
      if (stryMutAct_9fa48("3407") ? false : stryMutAct_9fa48("3406") ? true : stryMutAct_9fa48("3405") ? language : (stryCov_9fa48("3405", "3406", "3407"), !language)) {
        if (stryMutAct_9fa48("3408")) {
          {}
        } else {
          stryCov_9fa48("3408");
          throw new Error(stryMutAct_9fa48("3409") ? "" : (stryCov_9fa48("3409"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getCoursesByLanguage(language);
      return stryMutAct_9fa48("3410") ? {} : (stryCov_9fa48("3410"), {
        success: stryMutAct_9fa48("3411") ? false : (stryCov_9fa48("3411"), true),
        data: courses
      });
    }
  }

  // ==================== Course (Module) Operations ====================

  /**
   * Create a new course
   */
  async createCourse(adminId, courseData) {
    if (stryMutAct_9fa48("3412")) {
      {}
    } else {
      stryCov_9fa48("3412");
      // Validate required fields
      if (stryMutAct_9fa48("3415") ? !courseData.title && !courseData.language : stryMutAct_9fa48("3414") ? false : stryMutAct_9fa48("3413") ? true : (stryCov_9fa48("3413", "3414", "3415"), (stryMutAct_9fa48("3416") ? courseData.title : (stryCov_9fa48("3416"), !courseData.title)) || (stryMutAct_9fa48("3417") ? courseData.language : (stryCov_9fa48("3417"), !courseData.language)))) {
        if (stryMutAct_9fa48("3418")) {
          {}
        } else {
          stryCov_9fa48("3418");
          throw new Error(stryMutAct_9fa48("3419") ? "" : (stryCov_9fa48("3419"), 'Title and language are required'));
        }
      }
      if (stryMutAct_9fa48("3422") ? false : stryMutAct_9fa48("3421") ? true : stryMutAct_9fa48("3420") ? courseData.level : (stryCov_9fa48("3420", "3421", "3422"), !courseData.level)) {
        if (stryMutAct_9fa48("3423")) {
          {}
        } else {
          stryCov_9fa48("3423");
          throw new Error(stryMutAct_9fa48("3424") ? "" : (stryCov_9fa48("3424"), 'Level is required (e.g., Beginner, Intermediate, Advanced)'));
        }
      }

      // Prepare course data
      const course = stryMutAct_9fa48("3425") ? {} : (stryCov_9fa48("3425"), {
        admin_id: adminId,
        language: courseData.language,
        level: courseData.level,
        title: courseData.title,
        description: stryMutAct_9fa48("3428") ? courseData.description && '' : stryMutAct_9fa48("3427") ? false : stryMutAct_9fa48("3426") ? true : (stryCov_9fa48("3426", "3427", "3428"), courseData.description || (stryMutAct_9fa48("3429") ? "Stryker was here!" : (stryCov_9fa48("3429"), ''))),
        thumbnail_url: stryMutAct_9fa48("3432") ? courseData.thumbnail_url && null : stryMutAct_9fa48("3431") ? false : stryMutAct_9fa48("3430") ? true : (stryCov_9fa48("3430", "3431", "3432"), courseData.thumbnail_url || null),
        estimated_duration: stryMutAct_9fa48("3435") ? courseData.estimated_duration && null : stryMutAct_9fa48("3434") ? false : stryMutAct_9fa48("3433") ? true : (stryCov_9fa48("3433", "3434", "3435"), courseData.estimated_duration || null),
        is_published: stryMutAct_9fa48("3438") ? courseData.is_published && false : stryMutAct_9fa48("3437") ? false : stryMutAct_9fa48("3436") ? true : (stryCov_9fa48("3436", "3437", "3438"), courseData.is_published || (stryMutAct_9fa48("3439") ? true : (stryCov_9fa48("3439"), false)))
      });
      const newCourse = await moduleAdminRepository.createCourse(course);
      return stryMutAct_9fa48("3440") ? {} : (stryCov_9fa48("3440"), {
        success: stryMutAct_9fa48("3441") ? false : (stryCov_9fa48("3441"), true),
        message: stryMutAct_9fa48("3442") ? "" : (stryCov_9fa48("3442"), 'Course created successfully'),
        data: newCourse
      });
    }
  }

  /**
   * Get course details with units and lessons
   */
  async getCourseDetails(courseId) {
    if (stryMutAct_9fa48("3443")) {
      {}
    } else {
      stryCov_9fa48("3443");
      if (stryMutAct_9fa48("3446") ? false : stryMutAct_9fa48("3445") ? true : stryMutAct_9fa48("3444") ? courseId : (stryCov_9fa48("3444", "3445", "3446"), !courseId)) {
        if (stryMutAct_9fa48("3447")) {
          {}
        } else {
          stryCov_9fa48("3447");
          throw new Error(stryMutAct_9fa48("3448") ? "" : (stryCov_9fa48("3448"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3451") ? false : stryMutAct_9fa48("3450") ? true : stryMutAct_9fa48("3449") ? course : (stryCov_9fa48("3449", "3450", "3451"), !course)) {
        if (stryMutAct_9fa48("3452")) {
          {}
        } else {
          stryCov_9fa48("3452");
          throw new Error(stryMutAct_9fa48("3453") ? "" : (stryCov_9fa48("3453"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("3454") ? {} : (stryCov_9fa48("3454"), {
        success: stryMutAct_9fa48("3455") ? false : (stryCov_9fa48("3455"), true),
        data: course
      });
    }
  }

  /**
   * Update a course
   */
  async updateCourse(courseId, courseData) {
    if (stryMutAct_9fa48("3456")) {
      {}
    } else {
      stryCov_9fa48("3456");
      if (stryMutAct_9fa48("3459") ? false : stryMutAct_9fa48("3458") ? true : stryMutAct_9fa48("3457") ? courseId : (stryCov_9fa48("3457", "3458", "3459"), !courseId)) {
        if (stryMutAct_9fa48("3460")) {
          {}
        } else {
          stryCov_9fa48("3460");
          throw new Error(stryMutAct_9fa48("3461") ? "" : (stryCov_9fa48("3461"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3464") ? false : stryMutAct_9fa48("3463") ? true : stryMutAct_9fa48("3462") ? existingCourse : (stryCov_9fa48("3462", "3463", "3464"), !existingCourse)) {
        if (stryMutAct_9fa48("3465")) {
          {}
        } else {
          stryCov_9fa48("3465");
          throw new Error(stryMutAct_9fa48("3466") ? "" : (stryCov_9fa48("3466"), 'Course not found'));
        }
      }
      const updatedCourse = await moduleAdminRepository.updateCourse(courseId, courseData);
      return stryMutAct_9fa48("3467") ? {} : (stryCov_9fa48("3467"), {
        success: stryMutAct_9fa48("3468") ? false : (stryCov_9fa48("3468"), true),
        message: stryMutAct_9fa48("3469") ? "" : (stryCov_9fa48("3469"), 'Course updated successfully'),
        data: updatedCourse
      });
    }
  }

  /**
   * Delete a course
   */
  async deleteCourse(courseId) {
    if (stryMutAct_9fa48("3470")) {
      {}
    } else {
      stryCov_9fa48("3470");
      if (stryMutAct_9fa48("3473") ? false : stryMutAct_9fa48("3472") ? true : stryMutAct_9fa48("3471") ? courseId : (stryCov_9fa48("3471", "3472", "3473"), !courseId)) {
        if (stryMutAct_9fa48("3474")) {
          {}
        } else {
          stryCov_9fa48("3474");
          throw new Error(stryMutAct_9fa48("3475") ? "" : (stryCov_9fa48("3475"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3478") ? false : stryMutAct_9fa48("3477") ? true : stryMutAct_9fa48("3476") ? existingCourse : (stryCov_9fa48("3476", "3477", "3478"), !existingCourse)) {
        if (stryMutAct_9fa48("3479")) {
          {}
        } else {
          stryCov_9fa48("3479");
          throw new Error(stryMutAct_9fa48("3480") ? "" : (stryCov_9fa48("3480"), 'Course not found'));
        }
      }
      const deletedCourse = await moduleAdminRepository.deleteCourse(courseId);
      return stryMutAct_9fa48("3481") ? {} : (stryCov_9fa48("3481"), {
        success: stryMutAct_9fa48("3482") ? false : (stryCov_9fa48("3482"), true),
        message: stryMutAct_9fa48("3483") ? "" : (stryCov_9fa48("3483"), 'Course deleted successfully'),
        data: deletedCourse
      });
    }
  }

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   */
  async createUnit(courseId, unitData) {
    if (stryMutAct_9fa48("3484")) {
      {}
    } else {
      stryCov_9fa48("3484");
      if (stryMutAct_9fa48("3487") ? false : stryMutAct_9fa48("3486") ? true : stryMutAct_9fa48("3485") ? courseId : (stryCov_9fa48("3485", "3486", "3487"), !courseId)) {
        if (stryMutAct_9fa48("3488")) {
          {}
        } else {
          stryCov_9fa48("3488");
          throw new Error(stryMutAct_9fa48("3489") ? "" : (stryCov_9fa48("3489"), 'Course ID is required'));
        }
      }
      if (stryMutAct_9fa48("3492") ? false : stryMutAct_9fa48("3491") ? true : stryMutAct_9fa48("3490") ? unitData.title : (stryCov_9fa48("3490", "3491", "3492"), !unitData.title)) {
        if (stryMutAct_9fa48("3493")) {
          {}
        } else {
          stryCov_9fa48("3493");
          throw new Error(stryMutAct_9fa48("3494") ? "" : (stryCov_9fa48("3494"), 'Unit title is required'));
        }
      }

      // Verify course exists
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3497") ? false : stryMutAct_9fa48("3496") ? true : stryMutAct_9fa48("3495") ? course : (stryCov_9fa48("3495", "3496", "3497"), !course)) {
        if (stryMutAct_9fa48("3498")) {
          {}
        } else {
          stryCov_9fa48("3498");
          throw new Error(stryMutAct_9fa48("3499") ? "" : (stryCov_9fa48("3499"), 'Course not found'));
        }
      }

      // Prepare unit data
      const unit = stryMutAct_9fa48("3500") ? {} : (stryCov_9fa48("3500"), {
        module_id: courseId,
        title: unitData.title,
        description: stryMutAct_9fa48("3503") ? unitData.description && '' : stryMutAct_9fa48("3502") ? false : stryMutAct_9fa48("3501") ? true : (stryCov_9fa48("3501", "3502", "3503"), unitData.description || (stryMutAct_9fa48("3504") ? "Stryker was here!" : (stryCov_9fa48("3504"), ''))),
        difficulty: stryMutAct_9fa48("3507") ? unitData.difficulty && 'Beginner' : stryMutAct_9fa48("3506") ? false : stryMutAct_9fa48("3505") ? true : (stryCov_9fa48("3505", "3506", "3507"), unitData.difficulty || (stryMutAct_9fa48("3508") ? "" : (stryCov_9fa48("3508"), 'Beginner'))),
        estimated_time: stryMutAct_9fa48("3511") ? unitData.estimated_time && 0 : stryMutAct_9fa48("3510") ? false : stryMutAct_9fa48("3509") ? true : (stryCov_9fa48("3509", "3510", "3511"), unitData.estimated_time || 0)
      });
      const newUnit = await moduleAdminRepository.createUnit(unit);
      return stryMutAct_9fa48("3512") ? {} : (stryCov_9fa48("3512"), {
        success: stryMutAct_9fa48("3513") ? false : (stryCov_9fa48("3513"), true),
        message: stryMutAct_9fa48("3514") ? "" : (stryCov_9fa48("3514"), 'Unit created successfully'),
        data: newUnit
      });
    }
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    if (stryMutAct_9fa48("3515")) {
      {}
    } else {
      stryCov_9fa48("3515");
      if (stryMutAct_9fa48("3518") ? false : stryMutAct_9fa48("3517") ? true : stryMutAct_9fa48("3516") ? unitId : (stryCov_9fa48("3516", "3517", "3518"), !unitId)) {
        if (stryMutAct_9fa48("3519")) {
          {}
        } else {
          stryCov_9fa48("3519");
          throw new Error(stryMutAct_9fa48("3520") ? "" : (stryCov_9fa48("3520"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3523") ? false : stryMutAct_9fa48("3522") ? true : stryMutAct_9fa48("3521") ? existingUnit : (stryCov_9fa48("3521", "3522", "3523"), !existingUnit)) {
        if (stryMutAct_9fa48("3524")) {
          {}
        } else {
          stryCov_9fa48("3524");
          throw new Error(stryMutAct_9fa48("3525") ? "" : (stryCov_9fa48("3525"), 'Unit not found'));
        }
      }
      const updatedUnit = await moduleAdminRepository.updateUnit(unitId, unitData);
      return stryMutAct_9fa48("3526") ? {} : (stryCov_9fa48("3526"), {
        success: stryMutAct_9fa48("3527") ? false : (stryCov_9fa48("3527"), true),
        message: stryMutAct_9fa48("3528") ? "" : (stryCov_9fa48("3528"), 'Unit updated successfully'),
        data: updatedUnit
      });
    }
  }

  /**
   * Delete a unit
   */
  async deleteUnit(unitId) {
    if (stryMutAct_9fa48("3529")) {
      {}
    } else {
      stryCov_9fa48("3529");
      if (stryMutAct_9fa48("3532") ? false : stryMutAct_9fa48("3531") ? true : stryMutAct_9fa48("3530") ? unitId : (stryCov_9fa48("3530", "3531", "3532"), !unitId)) {
        if (stryMutAct_9fa48("3533")) {
          {}
        } else {
          stryCov_9fa48("3533");
          throw new Error(stryMutAct_9fa48("3534") ? "" : (stryCov_9fa48("3534"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3537") ? false : stryMutAct_9fa48("3536") ? true : stryMutAct_9fa48("3535") ? existingUnit : (stryCov_9fa48("3535", "3536", "3537"), !existingUnit)) {
        if (stryMutAct_9fa48("3538")) {
          {}
        } else {
          stryCov_9fa48("3538");
          throw new Error(stryMutAct_9fa48("3539") ? "" : (stryCov_9fa48("3539"), 'Unit not found'));
        }
      }
      const deletedUnit = await moduleAdminRepository.deleteUnit(unitId);
      return stryMutAct_9fa48("3540") ? {} : (stryCov_9fa48("3540"), {
        success: stryMutAct_9fa48("3541") ? false : (stryCov_9fa48("3541"), true),
        message: stryMutAct_9fa48("3542") ? "" : (stryCov_9fa48("3542"), 'Unit deleted successfully'),
        data: deletedUnit
      });
    }
  }

  // ==================== Lesson Operations ====================

  /**
   * Create a new lesson
   */
  async createLesson(unitId, lessonData) {
    if (stryMutAct_9fa48("3543")) {
      {}
    } else {
      stryCov_9fa48("3543");
      if (stryMutAct_9fa48("3546") ? false : stryMutAct_9fa48("3545") ? true : stryMutAct_9fa48("3544") ? unitId : (stryCov_9fa48("3544", "3545", "3546"), !unitId)) {
        if (stryMutAct_9fa48("3547")) {
          {}
        } else {
          stryCov_9fa48("3547");
          throw new Error(stryMutAct_9fa48("3548") ? "" : (stryCov_9fa48("3548"), 'Unit ID is required'));
        }
      }
      if (stryMutAct_9fa48("3551") ? !lessonData.title && !lessonData.content_type : stryMutAct_9fa48("3550") ? false : stryMutAct_9fa48("3549") ? true : (stryCov_9fa48("3549", "3550", "3551"), (stryMutAct_9fa48("3552") ? lessonData.title : (stryCov_9fa48("3552"), !lessonData.title)) || (stryMutAct_9fa48("3553") ? lessonData.content_type : (stryCov_9fa48("3553"), !lessonData.content_type)))) {
        if (stryMutAct_9fa48("3554")) {
          {}
        } else {
          stryCov_9fa48("3554");
          throw new Error(stryMutAct_9fa48("3555") ? "" : (stryCov_9fa48("3555"), 'Lesson title and content type are required'));
        }
      }

      // Verify unit exists
      const unit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3558") ? false : stryMutAct_9fa48("3557") ? true : stryMutAct_9fa48("3556") ? unit : (stryCov_9fa48("3556", "3557", "3558"), !unit)) {
        if (stryMutAct_9fa48("3559")) {
          {}
        } else {
          stryCov_9fa48("3559");
          throw new Error(stryMutAct_9fa48("3560") ? "" : (stryCov_9fa48("3560"), 'Unit not found'));
        }
      }

      // Prepare lesson data
      const lesson = stryMutAct_9fa48("3561") ? {} : (stryCov_9fa48("3561"), {
        unit_id: unitId,
        title: lessonData.title,
        content_type: lessonData.content_type,
        description: stryMutAct_9fa48("3564") ? lessonData.description && '' : stryMutAct_9fa48("3563") ? false : stryMutAct_9fa48("3562") ? true : (stryCov_9fa48("3562", "3563", "3564"), lessonData.description || (stryMutAct_9fa48("3565") ? "Stryker was here!" : (stryCov_9fa48("3565"), ''))),
        media_url: stryMutAct_9fa48("3568") ? lessonData.media_url && null : stryMutAct_9fa48("3567") ? false : stryMutAct_9fa48("3566") ? true : (stryCov_9fa48("3566", "3567", "3568"), lessonData.media_url || null),
        key_phrases: stryMutAct_9fa48("3571") ? lessonData.key_phrases && [] : stryMutAct_9fa48("3570") ? false : stryMutAct_9fa48("3569") ? true : (stryCov_9fa48("3569", "3570", "3571"), lessonData.key_phrases || (stryMutAct_9fa48("3572") ? ["Stryker was here"] : (stryCov_9fa48("3572"), []))),
        vocabulary: stryMutAct_9fa48("3575") ? lessonData.vocabulary && {} : stryMutAct_9fa48("3574") ? false : stryMutAct_9fa48("3573") ? true : (stryCov_9fa48("3573", "3574", "3575"), lessonData.vocabulary || {}),
        grammar_points: stryMutAct_9fa48("3578") ? lessonData.grammar_points && {} : stryMutAct_9fa48("3577") ? false : stryMutAct_9fa48("3576") ? true : (stryCov_9fa48("3576", "3577", "3578"), lessonData.grammar_points || {}),
        exercises: stryMutAct_9fa48("3581") ? lessonData.exercises && {} : stryMutAct_9fa48("3580") ? false : stryMutAct_9fa48("3579") ? true : (stryCov_9fa48("3579", "3580", "3581"), lessonData.exercises || {}),
        xp_reward: stryMutAct_9fa48("3584") ? lessonData.xp_reward && 0 : stryMutAct_9fa48("3583") ? false : stryMutAct_9fa48("3582") ? true : (stryCov_9fa48("3582", "3583", "3584"), lessonData.xp_reward || 0)
      });
      const newLesson = await moduleAdminRepository.createLesson(lesson);
      return stryMutAct_9fa48("3585") ? {} : (stryCov_9fa48("3585"), {
        success: stryMutAct_9fa48("3586") ? false : (stryCov_9fa48("3586"), true),
        message: stryMutAct_9fa48("3587") ? "" : (stryCov_9fa48("3587"), 'Lesson created successfully'),
        data: newLesson
      });
    }
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    if (stryMutAct_9fa48("3588")) {
      {}
    } else {
      stryCov_9fa48("3588");
      if (stryMutAct_9fa48("3591") ? false : stryMutAct_9fa48("3590") ? true : stryMutAct_9fa48("3589") ? lessonId : (stryCov_9fa48("3589", "3590", "3591"), !lessonId)) {
        if (stryMutAct_9fa48("3592")) {
          {}
        } else {
          stryCov_9fa48("3592");
          throw new Error(stryMutAct_9fa48("3593") ? "" : (stryCov_9fa48("3593"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("3596") ? false : stryMutAct_9fa48("3595") ? true : stryMutAct_9fa48("3594") ? existingLesson : (stryCov_9fa48("3594", "3595", "3596"), !existingLesson)) {
        if (stryMutAct_9fa48("3597")) {
          {}
        } else {
          stryCov_9fa48("3597");
          throw new Error(stryMutAct_9fa48("3598") ? "" : (stryCov_9fa48("3598"), 'Lesson not found'));
        }
      }
      const updatedLesson = await moduleAdminRepository.updateLesson(lessonId, lessonData);
      return stryMutAct_9fa48("3599") ? {} : (stryCov_9fa48("3599"), {
        success: stryMutAct_9fa48("3600") ? false : (stryCov_9fa48("3600"), true),
        message: stryMutAct_9fa48("3601") ? "" : (stryCov_9fa48("3601"), 'Lesson updated successfully'),
        data: updatedLesson
      });
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    if (stryMutAct_9fa48("3602")) {
      {}
    } else {
      stryCov_9fa48("3602");
      if (stryMutAct_9fa48("3605") ? false : stryMutAct_9fa48("3604") ? true : stryMutAct_9fa48("3603") ? lessonId : (stryCov_9fa48("3603", "3604", "3605"), !lessonId)) {
        if (stryMutAct_9fa48("3606")) {
          {}
        } else {
          stryCov_9fa48("3606");
          throw new Error(stryMutAct_9fa48("3607") ? "" : (stryCov_9fa48("3607"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("3610") ? false : stryMutAct_9fa48("3609") ? true : stryMutAct_9fa48("3608") ? existingLesson : (stryCov_9fa48("3608", "3609", "3610"), !existingLesson)) {
        if (stryMutAct_9fa48("3611")) {
          {}
        } else {
          stryCov_9fa48("3611");
          throw new Error(stryMutAct_9fa48("3612") ? "" : (stryCov_9fa48("3612"), 'Lesson not found'));
        }
      }
      const deletedLesson = await moduleAdminRepository.deleteLesson(lessonId);
      return stryMutAct_9fa48("3613") ? {} : (stryCov_9fa48("3613"), {
        success: stryMutAct_9fa48("3614") ? false : (stryCov_9fa48("3614"), true),
        message: stryMutAct_9fa48("3615") ? "" : (stryCov_9fa48("3615"), 'Lesson deleted successfully'),
        data: deletedLesson
      });
    }
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   */
  async getPublishedLanguages() {
    if (stryMutAct_9fa48("3616")) {
      {}
    } else {
      stryCov_9fa48("3616");
      const languages = await moduleAdminRepository.getPublishedLanguages();
      return stryMutAct_9fa48("3617") ? {} : (stryCov_9fa48("3617"), {
        success: stryMutAct_9fa48("3618") ? false : (stryCov_9fa48("3618"), true),
        data: languages
      });
    }
  }

  /**
   * Get published courses for a specific language for learners
   */
  async getPublishedCoursesByLanguage(language) {
    if (stryMutAct_9fa48("3619")) {
      {}
    } else {
      stryCov_9fa48("3619");
      if (stryMutAct_9fa48("3622") ? false : stryMutAct_9fa48("3621") ? true : stryMutAct_9fa48("3620") ? language : (stryCov_9fa48("3620", "3621", "3622"), !language)) {
        if (stryMutAct_9fa48("3623")) {
          {}
        } else {
          stryCov_9fa48("3623");
          throw new Error(stryMutAct_9fa48("3624") ? "" : (stryCov_9fa48("3624"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getPublishedCoursesByLanguage(language);
      return stryMutAct_9fa48("3625") ? {} : (stryCov_9fa48("3625"), {
        success: stryMutAct_9fa48("3626") ? false : (stryCov_9fa48("3626"), true),
        data: courses
      });
    }
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("3627")) {
      {}
    } else {
      stryCov_9fa48("3627");
      if (stryMutAct_9fa48("3630") ? false : stryMutAct_9fa48("3629") ? true : stryMutAct_9fa48("3628") ? courseId : (stryCov_9fa48("3628", "3629", "3630"), !courseId)) {
        if (stryMutAct_9fa48("3631")) {
          {}
        } else {
          stryCov_9fa48("3631");
          throw new Error(stryMutAct_9fa48("3632") ? "" : (stryCov_9fa48("3632"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getPublishedCourseDetails(courseId);
      if (stryMutAct_9fa48("3635") ? false : stryMutAct_9fa48("3634") ? true : stryMutAct_9fa48("3633") ? course : (stryCov_9fa48("3633", "3634", "3635"), !course)) {
        if (stryMutAct_9fa48("3636")) {
          {}
        } else {
          stryCov_9fa48("3636");
          throw new Error(stryMutAct_9fa48("3637") ? "" : (stryCov_9fa48("3637"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("3638") ? {} : (stryCov_9fa48("3638"), {
        success: stryMutAct_9fa48("3639") ? false : (stryCov_9fa48("3639"), true),
        data: course
      });
    }
  }
}
export default new ModuleAdminService();