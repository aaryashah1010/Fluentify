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
    if (stryMutAct_9fa48("3384")) {
      {}
    } else {
      stryCov_9fa48("3384");
      const languages = await moduleAdminRepository.getLanguages();
      return stryMutAct_9fa48("3385") ? {} : (stryCov_9fa48("3385"), {
        success: stryMutAct_9fa48("3386") ? false : (stryCov_9fa48("3386"), true),
        data: languages
      });
    }
  }

  /**
   * Get all courses for a specific language
   */
  async getCoursesByLanguage(language) {
    if (stryMutAct_9fa48("3387")) {
      {}
    } else {
      stryCov_9fa48("3387");
      if (stryMutAct_9fa48("3390") ? false : stryMutAct_9fa48("3389") ? true : stryMutAct_9fa48("3388") ? language : (stryCov_9fa48("3388", "3389", "3390"), !language)) {
        if (stryMutAct_9fa48("3391")) {
          {}
        } else {
          stryCov_9fa48("3391");
          throw new Error(stryMutAct_9fa48("3392") ? "" : (stryCov_9fa48("3392"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getCoursesByLanguage(language);
      return stryMutAct_9fa48("3393") ? {} : (stryCov_9fa48("3393"), {
        success: stryMutAct_9fa48("3394") ? false : (stryCov_9fa48("3394"), true),
        data: courses
      });
    }
  }

  // ==================== Course (Module) Operations ====================

  /**
   * Create a new course
   */
  async createCourse(adminId, courseData) {
    if (stryMutAct_9fa48("3395")) {
      {}
    } else {
      stryCov_9fa48("3395");
      // Validate required fields
      if (stryMutAct_9fa48("3398") ? !courseData.title && !courseData.language : stryMutAct_9fa48("3397") ? false : stryMutAct_9fa48("3396") ? true : (stryCov_9fa48("3396", "3397", "3398"), (stryMutAct_9fa48("3399") ? courseData.title : (stryCov_9fa48("3399"), !courseData.title)) || (stryMutAct_9fa48("3400") ? courseData.language : (stryCov_9fa48("3400"), !courseData.language)))) {
        if (stryMutAct_9fa48("3401")) {
          {}
        } else {
          stryCov_9fa48("3401");
          throw new Error(stryMutAct_9fa48("3402") ? "" : (stryCov_9fa48("3402"), 'Title and language are required'));
        }
      }
      if (stryMutAct_9fa48("3405") ? false : stryMutAct_9fa48("3404") ? true : stryMutAct_9fa48("3403") ? courseData.level : (stryCov_9fa48("3403", "3404", "3405"), !courseData.level)) {
        if (stryMutAct_9fa48("3406")) {
          {}
        } else {
          stryCov_9fa48("3406");
          throw new Error(stryMutAct_9fa48("3407") ? "" : (stryCov_9fa48("3407"), 'Level is required (e.g., Beginner, Intermediate, Advanced)'));
        }
      }

      // Prepare course data
      const course = stryMutAct_9fa48("3408") ? {} : (stryCov_9fa48("3408"), {
        admin_id: adminId,
        language: courseData.language,
        level: courseData.level,
        title: courseData.title,
        description: stryMutAct_9fa48("3411") ? courseData.description && '' : stryMutAct_9fa48("3410") ? false : stryMutAct_9fa48("3409") ? true : (stryCov_9fa48("3409", "3410", "3411"), courseData.description || (stryMutAct_9fa48("3412") ? "Stryker was here!" : (stryCov_9fa48("3412"), ''))),
        thumbnail_url: stryMutAct_9fa48("3415") ? courseData.thumbnail_url && null : stryMutAct_9fa48("3414") ? false : stryMutAct_9fa48("3413") ? true : (stryCov_9fa48("3413", "3414", "3415"), courseData.thumbnail_url || null),
        estimated_duration: stryMutAct_9fa48("3418") ? courseData.estimated_duration && null : stryMutAct_9fa48("3417") ? false : stryMutAct_9fa48("3416") ? true : (stryCov_9fa48("3416", "3417", "3418"), courseData.estimated_duration || null),
        is_published: stryMutAct_9fa48("3421") ? courseData.is_published && false : stryMutAct_9fa48("3420") ? false : stryMutAct_9fa48("3419") ? true : (stryCov_9fa48("3419", "3420", "3421"), courseData.is_published || (stryMutAct_9fa48("3422") ? true : (stryCov_9fa48("3422"), false)))
      });
      const newCourse = await moduleAdminRepository.createCourse(course);
      return stryMutAct_9fa48("3423") ? {} : (stryCov_9fa48("3423"), {
        success: stryMutAct_9fa48("3424") ? false : (stryCov_9fa48("3424"), true),
        message: stryMutAct_9fa48("3425") ? "" : (stryCov_9fa48("3425"), 'Course created successfully'),
        data: newCourse
      });
    }
  }

  /**
   * Get course details with units and lessons
   */
  async getCourseDetails(courseId) {
    if (stryMutAct_9fa48("3426")) {
      {}
    } else {
      stryCov_9fa48("3426");
      if (stryMutAct_9fa48("3429") ? false : stryMutAct_9fa48("3428") ? true : stryMutAct_9fa48("3427") ? courseId : (stryCov_9fa48("3427", "3428", "3429"), !courseId)) {
        if (stryMutAct_9fa48("3430")) {
          {}
        } else {
          stryCov_9fa48("3430");
          throw new Error(stryMutAct_9fa48("3431") ? "" : (stryCov_9fa48("3431"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3434") ? false : stryMutAct_9fa48("3433") ? true : stryMutAct_9fa48("3432") ? course : (stryCov_9fa48("3432", "3433", "3434"), !course)) {
        if (stryMutAct_9fa48("3435")) {
          {}
        } else {
          stryCov_9fa48("3435");
          throw new Error(stryMutAct_9fa48("3436") ? "" : (stryCov_9fa48("3436"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("3437") ? {} : (stryCov_9fa48("3437"), {
        success: stryMutAct_9fa48("3438") ? false : (stryCov_9fa48("3438"), true),
        data: course
      });
    }
  }

  /**
   * Update a course
   */
  async updateCourse(courseId, courseData) {
    if (stryMutAct_9fa48("3439")) {
      {}
    } else {
      stryCov_9fa48("3439");
      if (stryMutAct_9fa48("3442") ? false : stryMutAct_9fa48("3441") ? true : stryMutAct_9fa48("3440") ? courseId : (stryCov_9fa48("3440", "3441", "3442"), !courseId)) {
        if (stryMutAct_9fa48("3443")) {
          {}
        } else {
          stryCov_9fa48("3443");
          throw new Error(stryMutAct_9fa48("3444") ? "" : (stryCov_9fa48("3444"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3447") ? false : stryMutAct_9fa48("3446") ? true : stryMutAct_9fa48("3445") ? existingCourse : (stryCov_9fa48("3445", "3446", "3447"), !existingCourse)) {
        if (stryMutAct_9fa48("3448")) {
          {}
        } else {
          stryCov_9fa48("3448");
          throw new Error(stryMutAct_9fa48("3449") ? "" : (stryCov_9fa48("3449"), 'Course not found'));
        }
      }
      const updatedCourse = await moduleAdminRepository.updateCourse(courseId, courseData);
      return stryMutAct_9fa48("3450") ? {} : (stryCov_9fa48("3450"), {
        success: stryMutAct_9fa48("3451") ? false : (stryCov_9fa48("3451"), true),
        message: stryMutAct_9fa48("3452") ? "" : (stryCov_9fa48("3452"), 'Course updated successfully'),
        data: updatedCourse
      });
    }
  }

  /**
   * Delete a course
   */
  async deleteCourse(courseId) {
    if (stryMutAct_9fa48("3453")) {
      {}
    } else {
      stryCov_9fa48("3453");
      if (stryMutAct_9fa48("3456") ? false : stryMutAct_9fa48("3455") ? true : stryMutAct_9fa48("3454") ? courseId : (stryCov_9fa48("3454", "3455", "3456"), !courseId)) {
        if (stryMutAct_9fa48("3457")) {
          {}
        } else {
          stryCov_9fa48("3457");
          throw new Error(stryMutAct_9fa48("3458") ? "" : (stryCov_9fa48("3458"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3461") ? false : stryMutAct_9fa48("3460") ? true : stryMutAct_9fa48("3459") ? existingCourse : (stryCov_9fa48("3459", "3460", "3461"), !existingCourse)) {
        if (stryMutAct_9fa48("3462")) {
          {}
        } else {
          stryCov_9fa48("3462");
          throw new Error(stryMutAct_9fa48("3463") ? "" : (stryCov_9fa48("3463"), 'Course not found'));
        }
      }
      const deletedCourse = await moduleAdminRepository.deleteCourse(courseId);
      return stryMutAct_9fa48("3464") ? {} : (stryCov_9fa48("3464"), {
        success: stryMutAct_9fa48("3465") ? false : (stryCov_9fa48("3465"), true),
        message: stryMutAct_9fa48("3466") ? "" : (stryCov_9fa48("3466"), 'Course deleted successfully'),
        data: deletedCourse
      });
    }
  }

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   */
  async createUnit(courseId, unitData) {
    if (stryMutAct_9fa48("3467")) {
      {}
    } else {
      stryCov_9fa48("3467");
      if (stryMutAct_9fa48("3470") ? false : stryMutAct_9fa48("3469") ? true : stryMutAct_9fa48("3468") ? courseId : (stryCov_9fa48("3468", "3469", "3470"), !courseId)) {
        if (stryMutAct_9fa48("3471")) {
          {}
        } else {
          stryCov_9fa48("3471");
          throw new Error(stryMutAct_9fa48("3472") ? "" : (stryCov_9fa48("3472"), 'Course ID is required'));
        }
      }
      if (stryMutAct_9fa48("3475") ? false : stryMutAct_9fa48("3474") ? true : stryMutAct_9fa48("3473") ? unitData.title : (stryCov_9fa48("3473", "3474", "3475"), !unitData.title)) {
        if (stryMutAct_9fa48("3476")) {
          {}
        } else {
          stryCov_9fa48("3476");
          throw new Error(stryMutAct_9fa48("3477") ? "" : (stryCov_9fa48("3477"), 'Unit title is required'));
        }
      }

      // Verify course exists
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3480") ? false : stryMutAct_9fa48("3479") ? true : stryMutAct_9fa48("3478") ? course : (stryCov_9fa48("3478", "3479", "3480"), !course)) {
        if (stryMutAct_9fa48("3481")) {
          {}
        } else {
          stryCov_9fa48("3481");
          throw new Error(stryMutAct_9fa48("3482") ? "" : (stryCov_9fa48("3482"), 'Course not found'));
        }
      }

      // Prepare unit data
      const unit = stryMutAct_9fa48("3483") ? {} : (stryCov_9fa48("3483"), {
        module_id: courseId,
        title: unitData.title,
        description: stryMutAct_9fa48("3486") ? unitData.description && '' : stryMutAct_9fa48("3485") ? false : stryMutAct_9fa48("3484") ? true : (stryCov_9fa48("3484", "3485", "3486"), unitData.description || (stryMutAct_9fa48("3487") ? "Stryker was here!" : (stryCov_9fa48("3487"), ''))),
        difficulty: stryMutAct_9fa48("3490") ? unitData.difficulty && 'Beginner' : stryMutAct_9fa48("3489") ? false : stryMutAct_9fa48("3488") ? true : (stryCov_9fa48("3488", "3489", "3490"), unitData.difficulty || (stryMutAct_9fa48("3491") ? "" : (stryCov_9fa48("3491"), 'Beginner'))),
        estimated_time: stryMutAct_9fa48("3494") ? unitData.estimated_time && 0 : stryMutAct_9fa48("3493") ? false : stryMutAct_9fa48("3492") ? true : (stryCov_9fa48("3492", "3493", "3494"), unitData.estimated_time || 0)
      });
      const newUnit = await moduleAdminRepository.createUnit(unit);
      return stryMutAct_9fa48("3495") ? {} : (stryCov_9fa48("3495"), {
        success: stryMutAct_9fa48("3496") ? false : (stryCov_9fa48("3496"), true),
        message: stryMutAct_9fa48("3497") ? "" : (stryCov_9fa48("3497"), 'Unit created successfully'),
        data: newUnit
      });
    }
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    if (stryMutAct_9fa48("3498")) {
      {}
    } else {
      stryCov_9fa48("3498");
      if (stryMutAct_9fa48("3501") ? false : stryMutAct_9fa48("3500") ? true : stryMutAct_9fa48("3499") ? unitId : (stryCov_9fa48("3499", "3500", "3501"), !unitId)) {
        if (stryMutAct_9fa48("3502")) {
          {}
        } else {
          stryCov_9fa48("3502");
          throw new Error(stryMutAct_9fa48("3503") ? "" : (stryCov_9fa48("3503"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3506") ? false : stryMutAct_9fa48("3505") ? true : stryMutAct_9fa48("3504") ? existingUnit : (stryCov_9fa48("3504", "3505", "3506"), !existingUnit)) {
        if (stryMutAct_9fa48("3507")) {
          {}
        } else {
          stryCov_9fa48("3507");
          throw new Error(stryMutAct_9fa48("3508") ? "" : (stryCov_9fa48("3508"), 'Unit not found'));
        }
      }
      const updatedUnit = await moduleAdminRepository.updateUnit(unitId, unitData);
      return stryMutAct_9fa48("3509") ? {} : (stryCov_9fa48("3509"), {
        success: stryMutAct_9fa48("3510") ? false : (stryCov_9fa48("3510"), true),
        message: stryMutAct_9fa48("3511") ? "" : (stryCov_9fa48("3511"), 'Unit updated successfully'),
        data: updatedUnit
      });
    }
  }

  /**
   * Delete a unit
   */
  async deleteUnit(unitId) {
    if (stryMutAct_9fa48("3512")) {
      {}
    } else {
      stryCov_9fa48("3512");
      if (stryMutAct_9fa48("3515") ? false : stryMutAct_9fa48("3514") ? true : stryMutAct_9fa48("3513") ? unitId : (stryCov_9fa48("3513", "3514", "3515"), !unitId)) {
        if (stryMutAct_9fa48("3516")) {
          {}
        } else {
          stryCov_9fa48("3516");
          throw new Error(stryMutAct_9fa48("3517") ? "" : (stryCov_9fa48("3517"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3520") ? false : stryMutAct_9fa48("3519") ? true : stryMutAct_9fa48("3518") ? existingUnit : (stryCov_9fa48("3518", "3519", "3520"), !existingUnit)) {
        if (stryMutAct_9fa48("3521")) {
          {}
        } else {
          stryCov_9fa48("3521");
          throw new Error(stryMutAct_9fa48("3522") ? "" : (stryCov_9fa48("3522"), 'Unit not found'));
        }
      }
      const deletedUnit = await moduleAdminRepository.deleteUnit(unitId);
      return stryMutAct_9fa48("3523") ? {} : (stryCov_9fa48("3523"), {
        success: stryMutAct_9fa48("3524") ? false : (stryCov_9fa48("3524"), true),
        message: stryMutAct_9fa48("3525") ? "" : (stryCov_9fa48("3525"), 'Unit deleted successfully'),
        data: deletedUnit
      });
    }
  }

  // ==================== Lesson Operations ====================

  /**
   * Create a new lesson
   */
  async createLesson(unitId, lessonData) {
    if (stryMutAct_9fa48("3526")) {
      {}
    } else {
      stryCov_9fa48("3526");
      if (stryMutAct_9fa48("3529") ? false : stryMutAct_9fa48("3528") ? true : stryMutAct_9fa48("3527") ? unitId : (stryCov_9fa48("3527", "3528", "3529"), !unitId)) {
        if (stryMutAct_9fa48("3530")) {
          {}
        } else {
          stryCov_9fa48("3530");
          throw new Error(stryMutAct_9fa48("3531") ? "" : (stryCov_9fa48("3531"), 'Unit ID is required'));
        }
      }
      if (stryMutAct_9fa48("3534") ? !lessonData.title && !lessonData.content_type : stryMutAct_9fa48("3533") ? false : stryMutAct_9fa48("3532") ? true : (stryCov_9fa48("3532", "3533", "3534"), (stryMutAct_9fa48("3535") ? lessonData.title : (stryCov_9fa48("3535"), !lessonData.title)) || (stryMutAct_9fa48("3536") ? lessonData.content_type : (stryCov_9fa48("3536"), !lessonData.content_type)))) {
        if (stryMutAct_9fa48("3537")) {
          {}
        } else {
          stryCov_9fa48("3537");
          throw new Error(stryMutAct_9fa48("3538") ? "" : (stryCov_9fa48("3538"), 'Lesson title and content type are required'));
        }
      }

      // Verify unit exists
      const unit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3541") ? false : stryMutAct_9fa48("3540") ? true : stryMutAct_9fa48("3539") ? unit : (stryCov_9fa48("3539", "3540", "3541"), !unit)) {
        if (stryMutAct_9fa48("3542")) {
          {}
        } else {
          stryCov_9fa48("3542");
          throw new Error(stryMutAct_9fa48("3543") ? "" : (stryCov_9fa48("3543"), 'Unit not found'));
        }
      }

      // Prepare lesson data
      const lesson = stryMutAct_9fa48("3544") ? {} : (stryCov_9fa48("3544"), {
        unit_id: unitId,
        title: lessonData.title,
        content_type: lessonData.content_type,
        description: stryMutAct_9fa48("3547") ? lessonData.description && '' : stryMutAct_9fa48("3546") ? false : stryMutAct_9fa48("3545") ? true : (stryCov_9fa48("3545", "3546", "3547"), lessonData.description || (stryMutAct_9fa48("3548") ? "Stryker was here!" : (stryCov_9fa48("3548"), ''))),
        media_url: stryMutAct_9fa48("3551") ? lessonData.media_url && null : stryMutAct_9fa48("3550") ? false : stryMutAct_9fa48("3549") ? true : (stryCov_9fa48("3549", "3550", "3551"), lessonData.media_url || null),
        key_phrases: stryMutAct_9fa48("3554") ? lessonData.key_phrases && [] : stryMutAct_9fa48("3553") ? false : stryMutAct_9fa48("3552") ? true : (stryCov_9fa48("3552", "3553", "3554"), lessonData.key_phrases || (stryMutAct_9fa48("3555") ? ["Stryker was here"] : (stryCov_9fa48("3555"), []))),
        vocabulary: stryMutAct_9fa48("3558") ? lessonData.vocabulary && {} : stryMutAct_9fa48("3557") ? false : stryMutAct_9fa48("3556") ? true : (stryCov_9fa48("3556", "3557", "3558"), lessonData.vocabulary || {}),
        grammar_points: stryMutAct_9fa48("3561") ? lessonData.grammar_points && {} : stryMutAct_9fa48("3560") ? false : stryMutAct_9fa48("3559") ? true : (stryCov_9fa48("3559", "3560", "3561"), lessonData.grammar_points || {}),
        exercises: stryMutAct_9fa48("3564") ? lessonData.exercises && {} : stryMutAct_9fa48("3563") ? false : stryMutAct_9fa48("3562") ? true : (stryCov_9fa48("3562", "3563", "3564"), lessonData.exercises || {}),
        xp_reward: stryMutAct_9fa48("3567") ? lessonData.xp_reward && 0 : stryMutAct_9fa48("3566") ? false : stryMutAct_9fa48("3565") ? true : (stryCov_9fa48("3565", "3566", "3567"), lessonData.xp_reward || 0)
      });
      const newLesson = await moduleAdminRepository.createLesson(lesson);
      return stryMutAct_9fa48("3568") ? {} : (stryCov_9fa48("3568"), {
        success: stryMutAct_9fa48("3569") ? false : (stryCov_9fa48("3569"), true),
        message: stryMutAct_9fa48("3570") ? "" : (stryCov_9fa48("3570"), 'Lesson created successfully'),
        data: newLesson
      });
    }
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    if (stryMutAct_9fa48("3571")) {
      {}
    } else {
      stryCov_9fa48("3571");
      if (stryMutAct_9fa48("3574") ? false : stryMutAct_9fa48("3573") ? true : stryMutAct_9fa48("3572") ? lessonId : (stryCov_9fa48("3572", "3573", "3574"), !lessonId)) {
        if (stryMutAct_9fa48("3575")) {
          {}
        } else {
          stryCov_9fa48("3575");
          throw new Error(stryMutAct_9fa48("3576") ? "" : (stryCov_9fa48("3576"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("3579") ? false : stryMutAct_9fa48("3578") ? true : stryMutAct_9fa48("3577") ? existingLesson : (stryCov_9fa48("3577", "3578", "3579"), !existingLesson)) {
        if (stryMutAct_9fa48("3580")) {
          {}
        } else {
          stryCov_9fa48("3580");
          throw new Error(stryMutAct_9fa48("3581") ? "" : (stryCov_9fa48("3581"), 'Lesson not found'));
        }
      }
      const updatedLesson = await moduleAdminRepository.updateLesson(lessonId, lessonData);
      return stryMutAct_9fa48("3582") ? {} : (stryCov_9fa48("3582"), {
        success: stryMutAct_9fa48("3583") ? false : (stryCov_9fa48("3583"), true),
        message: stryMutAct_9fa48("3584") ? "" : (stryCov_9fa48("3584"), 'Lesson updated successfully'),
        data: updatedLesson
      });
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    if (stryMutAct_9fa48("3585")) {
      {}
    } else {
      stryCov_9fa48("3585");
      if (stryMutAct_9fa48("3588") ? false : stryMutAct_9fa48("3587") ? true : stryMutAct_9fa48("3586") ? lessonId : (stryCov_9fa48("3586", "3587", "3588"), !lessonId)) {
        if (stryMutAct_9fa48("3589")) {
          {}
        } else {
          stryCov_9fa48("3589");
          throw new Error(stryMutAct_9fa48("3590") ? "" : (stryCov_9fa48("3590"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("3593") ? false : stryMutAct_9fa48("3592") ? true : stryMutAct_9fa48("3591") ? existingLesson : (stryCov_9fa48("3591", "3592", "3593"), !existingLesson)) {
        if (stryMutAct_9fa48("3594")) {
          {}
        } else {
          stryCov_9fa48("3594");
          throw new Error(stryMutAct_9fa48("3595") ? "" : (stryCov_9fa48("3595"), 'Lesson not found'));
        }
      }
      const deletedLesson = await moduleAdminRepository.deleteLesson(lessonId);
      return stryMutAct_9fa48("3596") ? {} : (stryCov_9fa48("3596"), {
        success: stryMutAct_9fa48("3597") ? false : (stryCov_9fa48("3597"), true),
        message: stryMutAct_9fa48("3598") ? "" : (stryCov_9fa48("3598"), 'Lesson deleted successfully'),
        data: deletedLesson
      });
    }
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   */
  async getPublishedLanguages() {
    if (stryMutAct_9fa48("3599")) {
      {}
    } else {
      stryCov_9fa48("3599");
      const languages = await moduleAdminRepository.getPublishedLanguages();
      return stryMutAct_9fa48("3600") ? {} : (stryCov_9fa48("3600"), {
        success: stryMutAct_9fa48("3601") ? false : (stryCov_9fa48("3601"), true),
        data: languages
      });
    }
  }

  /**
   * Get published courses for a specific language for learners
   */
  async getPublishedCoursesByLanguage(language) {
    if (stryMutAct_9fa48("3602")) {
      {}
    } else {
      stryCov_9fa48("3602");
      if (stryMutAct_9fa48("3605") ? false : stryMutAct_9fa48("3604") ? true : stryMutAct_9fa48("3603") ? language : (stryCov_9fa48("3603", "3604", "3605"), !language)) {
        if (stryMutAct_9fa48("3606")) {
          {}
        } else {
          stryCov_9fa48("3606");
          throw new Error(stryMutAct_9fa48("3607") ? "" : (stryCov_9fa48("3607"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getPublishedCoursesByLanguage(language);
      return stryMutAct_9fa48("3608") ? {} : (stryCov_9fa48("3608"), {
        success: stryMutAct_9fa48("3609") ? false : (stryCov_9fa48("3609"), true),
        data: courses
      });
    }
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("3610")) {
      {}
    } else {
      stryCov_9fa48("3610");
      if (stryMutAct_9fa48("3613") ? false : stryMutAct_9fa48("3612") ? true : stryMutAct_9fa48("3611") ? courseId : (stryCov_9fa48("3611", "3612", "3613"), !courseId)) {
        if (stryMutAct_9fa48("3614")) {
          {}
        } else {
          stryCov_9fa48("3614");
          throw new Error(stryMutAct_9fa48("3615") ? "" : (stryCov_9fa48("3615"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getPublishedCourseDetails(courseId);
      if (stryMutAct_9fa48("3618") ? false : stryMutAct_9fa48("3617") ? true : stryMutAct_9fa48("3616") ? course : (stryCov_9fa48("3616", "3617", "3618"), !course)) {
        if (stryMutAct_9fa48("3619")) {
          {}
        } else {
          stryCov_9fa48("3619");
          throw new Error(stryMutAct_9fa48("3620") ? "" : (stryCov_9fa48("3620"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("3621") ? {} : (stryCov_9fa48("3621"), {
        success: stryMutAct_9fa48("3622") ? false : (stryCov_9fa48("3622"), true),
        data: course
      });
    }
  }
}
export default new ModuleAdminService();