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
    if (stryMutAct_9fa48("3730")) {
      {}
    } else {
      stryCov_9fa48("3730");
      const languages = await moduleAdminRepository.getLanguages();
      return stryMutAct_9fa48("3731") ? {} : (stryCov_9fa48("3731"), {
        success: stryMutAct_9fa48("3732") ? false : (stryCov_9fa48("3732"), true),
        data: languages
      });
    }
  }

  /**
   * Get all courses for a specific language
   */
  async getCoursesByLanguage(language) {
    if (stryMutAct_9fa48("3733")) {
      {}
    } else {
      stryCov_9fa48("3733");
      if (stryMutAct_9fa48("3736") ? false : stryMutAct_9fa48("3735") ? true : stryMutAct_9fa48("3734") ? language : (stryCov_9fa48("3734", "3735", "3736"), !language)) {
        if (stryMutAct_9fa48("3737")) {
          {}
        } else {
          stryCov_9fa48("3737");
          throw new Error(stryMutAct_9fa48("3738") ? "" : (stryCov_9fa48("3738"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getCoursesByLanguage(language);
      return stryMutAct_9fa48("3739") ? {} : (stryCov_9fa48("3739"), {
        success: stryMutAct_9fa48("3740") ? false : (stryCov_9fa48("3740"), true),
        data: courses
      });
    }
  }

  // ==================== Course (Module) Operations ====================

  /**
   * Create a new course
   */
  async createCourse(adminId, courseData) {
    if (stryMutAct_9fa48("3741")) {
      {}
    } else {
      stryCov_9fa48("3741");
      // Validate required fields
      if (stryMutAct_9fa48("3744") ? !courseData.title && !courseData.language : stryMutAct_9fa48("3743") ? false : stryMutAct_9fa48("3742") ? true : (stryCov_9fa48("3742", "3743", "3744"), (stryMutAct_9fa48("3745") ? courseData.title : (stryCov_9fa48("3745"), !courseData.title)) || (stryMutAct_9fa48("3746") ? courseData.language : (stryCov_9fa48("3746"), !courseData.language)))) {
        if (stryMutAct_9fa48("3747")) {
          {}
        } else {
          stryCov_9fa48("3747");
          throw new Error(stryMutAct_9fa48("3748") ? "" : (stryCov_9fa48("3748"), 'Title and language are required'));
        }
      }
      if (stryMutAct_9fa48("3751") ? false : stryMutAct_9fa48("3750") ? true : stryMutAct_9fa48("3749") ? courseData.level : (stryCov_9fa48("3749", "3750", "3751"), !courseData.level)) {
        if (stryMutAct_9fa48("3752")) {
          {}
        } else {
          stryCov_9fa48("3752");
          throw new Error(stryMutAct_9fa48("3753") ? "" : (stryCov_9fa48("3753"), 'Level is required (e.g., Beginner, Intermediate, Advanced)'));
        }
      }

      // Prepare course data
      const course = stryMutAct_9fa48("3754") ? {} : (stryCov_9fa48("3754"), {
        admin_id: adminId,
        language: courseData.language,
        level: courseData.level,
        title: courseData.title,
        description: stryMutAct_9fa48("3757") ? courseData.description && '' : stryMutAct_9fa48("3756") ? false : stryMutAct_9fa48("3755") ? true : (stryCov_9fa48("3755", "3756", "3757"), courseData.description || (stryMutAct_9fa48("3758") ? "Stryker was here!" : (stryCov_9fa48("3758"), ''))),
        thumbnail_url: stryMutAct_9fa48("3761") ? courseData.thumbnail_url && null : stryMutAct_9fa48("3760") ? false : stryMutAct_9fa48("3759") ? true : (stryCov_9fa48("3759", "3760", "3761"), courseData.thumbnail_url || null),
        estimated_duration: stryMutAct_9fa48("3764") ? courseData.estimated_duration && null : stryMutAct_9fa48("3763") ? false : stryMutAct_9fa48("3762") ? true : (stryCov_9fa48("3762", "3763", "3764"), courseData.estimated_duration || null),
        is_published: stryMutAct_9fa48("3767") ? courseData.is_published && false : stryMutAct_9fa48("3766") ? false : stryMutAct_9fa48("3765") ? true : (stryCov_9fa48("3765", "3766", "3767"), courseData.is_published || (stryMutAct_9fa48("3768") ? true : (stryCov_9fa48("3768"), false)))
      });
      const newCourse = await moduleAdminRepository.createCourse(course);
      return stryMutAct_9fa48("3769") ? {} : (stryCov_9fa48("3769"), {
        success: stryMutAct_9fa48("3770") ? false : (stryCov_9fa48("3770"), true),
        message: stryMutAct_9fa48("3771") ? "" : (stryCov_9fa48("3771"), 'Course created successfully'),
        data: newCourse
      });
    }
  }

  /**
   * Get course details with units and lessons
   */
  async getCourseDetails(courseId) {
    if (stryMutAct_9fa48("3772")) {
      {}
    } else {
      stryCov_9fa48("3772");
      if (stryMutAct_9fa48("3775") ? false : stryMutAct_9fa48("3774") ? true : stryMutAct_9fa48("3773") ? courseId : (stryCov_9fa48("3773", "3774", "3775"), !courseId)) {
        if (stryMutAct_9fa48("3776")) {
          {}
        } else {
          stryCov_9fa48("3776");
          throw new Error(stryMutAct_9fa48("3777") ? "" : (stryCov_9fa48("3777"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3780") ? false : stryMutAct_9fa48("3779") ? true : stryMutAct_9fa48("3778") ? course : (stryCov_9fa48("3778", "3779", "3780"), !course)) {
        if (stryMutAct_9fa48("3781")) {
          {}
        } else {
          stryCov_9fa48("3781");
          throw new Error(stryMutAct_9fa48("3782") ? "" : (stryCov_9fa48("3782"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("3783") ? {} : (stryCov_9fa48("3783"), {
        success: stryMutAct_9fa48("3784") ? false : (stryCov_9fa48("3784"), true),
        data: course
      });
    }
  }

  /**
   * Update a course
   */
  async updateCourse(courseId, courseData) {
    if (stryMutAct_9fa48("3785")) {
      {}
    } else {
      stryCov_9fa48("3785");
      if (stryMutAct_9fa48("3788") ? false : stryMutAct_9fa48("3787") ? true : stryMutAct_9fa48("3786") ? courseId : (stryCov_9fa48("3786", "3787", "3788"), !courseId)) {
        if (stryMutAct_9fa48("3789")) {
          {}
        } else {
          stryCov_9fa48("3789");
          throw new Error(stryMutAct_9fa48("3790") ? "" : (stryCov_9fa48("3790"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3793") ? false : stryMutAct_9fa48("3792") ? true : stryMutAct_9fa48("3791") ? existingCourse : (stryCov_9fa48("3791", "3792", "3793"), !existingCourse)) {
        if (stryMutAct_9fa48("3794")) {
          {}
        } else {
          stryCov_9fa48("3794");
          throw new Error(stryMutAct_9fa48("3795") ? "" : (stryCov_9fa48("3795"), 'Course not found'));
        }
      }
      const updatedCourse = await moduleAdminRepository.updateCourse(courseId, courseData);
      return stryMutAct_9fa48("3796") ? {} : (stryCov_9fa48("3796"), {
        success: stryMutAct_9fa48("3797") ? false : (stryCov_9fa48("3797"), true),
        message: stryMutAct_9fa48("3798") ? "" : (stryCov_9fa48("3798"), 'Course updated successfully'),
        data: updatedCourse
      });
    }
  }

  /**
   * Delete a course
   */
  async deleteCourse(courseId) {
    if (stryMutAct_9fa48("3799")) {
      {}
    } else {
      stryCov_9fa48("3799");
      if (stryMutAct_9fa48("3802") ? false : stryMutAct_9fa48("3801") ? true : stryMutAct_9fa48("3800") ? courseId : (stryCov_9fa48("3800", "3801", "3802"), !courseId)) {
        if (stryMutAct_9fa48("3803")) {
          {}
        } else {
          stryCov_9fa48("3803");
          throw new Error(stryMutAct_9fa48("3804") ? "" : (stryCov_9fa48("3804"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3807") ? false : stryMutAct_9fa48("3806") ? true : stryMutAct_9fa48("3805") ? existingCourse : (stryCov_9fa48("3805", "3806", "3807"), !existingCourse)) {
        if (stryMutAct_9fa48("3808")) {
          {}
        } else {
          stryCov_9fa48("3808");
          throw new Error(stryMutAct_9fa48("3809") ? "" : (stryCov_9fa48("3809"), 'Course not found'));
        }
      }
      const deletedCourse = await moduleAdminRepository.deleteCourse(courseId);
      return stryMutAct_9fa48("3810") ? {} : (stryCov_9fa48("3810"), {
        success: stryMutAct_9fa48("3811") ? false : (stryCov_9fa48("3811"), true),
        message: stryMutAct_9fa48("3812") ? "" : (stryCov_9fa48("3812"), 'Course deleted successfully'),
        data: deletedCourse
      });
    }
  }

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   */
  async createUnit(courseId, unitData) {
    if (stryMutAct_9fa48("3813")) {
      {}
    } else {
      stryCov_9fa48("3813");
      if (stryMutAct_9fa48("3816") ? false : stryMutAct_9fa48("3815") ? true : stryMutAct_9fa48("3814") ? courseId : (stryCov_9fa48("3814", "3815", "3816"), !courseId)) {
        if (stryMutAct_9fa48("3817")) {
          {}
        } else {
          stryCov_9fa48("3817");
          throw new Error(stryMutAct_9fa48("3818") ? "" : (stryCov_9fa48("3818"), 'Course ID is required'));
        }
      }
      if (stryMutAct_9fa48("3821") ? false : stryMutAct_9fa48("3820") ? true : stryMutAct_9fa48("3819") ? unitData.title : (stryCov_9fa48("3819", "3820", "3821"), !unitData.title)) {
        if (stryMutAct_9fa48("3822")) {
          {}
        } else {
          stryCov_9fa48("3822");
          throw new Error(stryMutAct_9fa48("3823") ? "" : (stryCov_9fa48("3823"), 'Unit title is required'));
        }
      }

      // Verify course exists
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("3826") ? false : stryMutAct_9fa48("3825") ? true : stryMutAct_9fa48("3824") ? course : (stryCov_9fa48("3824", "3825", "3826"), !course)) {
        if (stryMutAct_9fa48("3827")) {
          {}
        } else {
          stryCov_9fa48("3827");
          throw new Error(stryMutAct_9fa48("3828") ? "" : (stryCov_9fa48("3828"), 'Course not found'));
        }
      }

      // Prepare unit data
      const unit = stryMutAct_9fa48("3829") ? {} : (stryCov_9fa48("3829"), {
        module_id: courseId,
        title: unitData.title,
        description: stryMutAct_9fa48("3832") ? unitData.description && '' : stryMutAct_9fa48("3831") ? false : stryMutAct_9fa48("3830") ? true : (stryCov_9fa48("3830", "3831", "3832"), unitData.description || (stryMutAct_9fa48("3833") ? "Stryker was here!" : (stryCov_9fa48("3833"), ''))),
        difficulty: stryMutAct_9fa48("3836") ? unitData.difficulty && 'Beginner' : stryMutAct_9fa48("3835") ? false : stryMutAct_9fa48("3834") ? true : (stryCov_9fa48("3834", "3835", "3836"), unitData.difficulty || (stryMutAct_9fa48("3837") ? "" : (stryCov_9fa48("3837"), 'Beginner'))),
        estimated_time: stryMutAct_9fa48("3840") ? unitData.estimated_time && 0 : stryMutAct_9fa48("3839") ? false : stryMutAct_9fa48("3838") ? true : (stryCov_9fa48("3838", "3839", "3840"), unitData.estimated_time || 0)
      });
      const newUnit = await moduleAdminRepository.createUnit(unit);
      return stryMutAct_9fa48("3841") ? {} : (stryCov_9fa48("3841"), {
        success: stryMutAct_9fa48("3842") ? false : (stryCov_9fa48("3842"), true),
        message: stryMutAct_9fa48("3843") ? "" : (stryCov_9fa48("3843"), 'Unit created successfully'),
        data: newUnit
      });
    }
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    if (stryMutAct_9fa48("3844")) {
      {}
    } else {
      stryCov_9fa48("3844");
      if (stryMutAct_9fa48("3847") ? false : stryMutAct_9fa48("3846") ? true : stryMutAct_9fa48("3845") ? unitId : (stryCov_9fa48("3845", "3846", "3847"), !unitId)) {
        if (stryMutAct_9fa48("3848")) {
          {}
        } else {
          stryCov_9fa48("3848");
          throw new Error(stryMutAct_9fa48("3849") ? "" : (stryCov_9fa48("3849"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3852") ? false : stryMutAct_9fa48("3851") ? true : stryMutAct_9fa48("3850") ? existingUnit : (stryCov_9fa48("3850", "3851", "3852"), !existingUnit)) {
        if (stryMutAct_9fa48("3853")) {
          {}
        } else {
          stryCov_9fa48("3853");
          throw new Error(stryMutAct_9fa48("3854") ? "" : (stryCov_9fa48("3854"), 'Unit not found'));
        }
      }
      const updatedUnit = await moduleAdminRepository.updateUnit(unitId, unitData);
      return stryMutAct_9fa48("3855") ? {} : (stryCov_9fa48("3855"), {
        success: stryMutAct_9fa48("3856") ? false : (stryCov_9fa48("3856"), true),
        message: stryMutAct_9fa48("3857") ? "" : (stryCov_9fa48("3857"), 'Unit updated successfully'),
        data: updatedUnit
      });
    }
  }

  /**
   * Delete a unit
   */
  async deleteUnit(unitId) {
    if (stryMutAct_9fa48("3858")) {
      {}
    } else {
      stryCov_9fa48("3858");
      if (stryMutAct_9fa48("3861") ? false : stryMutAct_9fa48("3860") ? true : stryMutAct_9fa48("3859") ? unitId : (stryCov_9fa48("3859", "3860", "3861"), !unitId)) {
        if (stryMutAct_9fa48("3862")) {
          {}
        } else {
          stryCov_9fa48("3862");
          throw new Error(stryMutAct_9fa48("3863") ? "" : (stryCov_9fa48("3863"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3866") ? false : stryMutAct_9fa48("3865") ? true : stryMutAct_9fa48("3864") ? existingUnit : (stryCov_9fa48("3864", "3865", "3866"), !existingUnit)) {
        if (stryMutAct_9fa48("3867")) {
          {}
        } else {
          stryCov_9fa48("3867");
          throw new Error(stryMutAct_9fa48("3868") ? "" : (stryCov_9fa48("3868"), 'Unit not found'));
        }
      }
      const deletedUnit = await moduleAdminRepository.deleteUnit(unitId);
      return stryMutAct_9fa48("3869") ? {} : (stryCov_9fa48("3869"), {
        success: stryMutAct_9fa48("3870") ? false : (stryCov_9fa48("3870"), true),
        message: stryMutAct_9fa48("3871") ? "" : (stryCov_9fa48("3871"), 'Unit deleted successfully'),
        data: deletedUnit
      });
    }
  }

  // ==================== Lesson Operations ====================

  /**
   * Create a new lesson
   */
  async createLesson(unitId, lessonData) {
    if (stryMutAct_9fa48("3872")) {
      {}
    } else {
      stryCov_9fa48("3872");
      if (stryMutAct_9fa48("3875") ? false : stryMutAct_9fa48("3874") ? true : stryMutAct_9fa48("3873") ? unitId : (stryCov_9fa48("3873", "3874", "3875"), !unitId)) {
        if (stryMutAct_9fa48("3876")) {
          {}
        } else {
          stryCov_9fa48("3876");
          throw new Error(stryMutAct_9fa48("3877") ? "" : (stryCov_9fa48("3877"), 'Unit ID is required'));
        }
      }
      if (stryMutAct_9fa48("3880") ? !lessonData.title && !lessonData.content_type : stryMutAct_9fa48("3879") ? false : stryMutAct_9fa48("3878") ? true : (stryCov_9fa48("3878", "3879", "3880"), (stryMutAct_9fa48("3881") ? lessonData.title : (stryCov_9fa48("3881"), !lessonData.title)) || (stryMutAct_9fa48("3882") ? lessonData.content_type : (stryCov_9fa48("3882"), !lessonData.content_type)))) {
        if (stryMutAct_9fa48("3883")) {
          {}
        } else {
          stryCov_9fa48("3883");
          throw new Error(stryMutAct_9fa48("3884") ? "" : (stryCov_9fa48("3884"), 'Lesson title and content type are required'));
        }
      }

      // Verify unit exists
      const unit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("3887") ? false : stryMutAct_9fa48("3886") ? true : stryMutAct_9fa48("3885") ? unit : (stryCov_9fa48("3885", "3886", "3887"), !unit)) {
        if (stryMutAct_9fa48("3888")) {
          {}
        } else {
          stryCov_9fa48("3888");
          throw new Error(stryMutAct_9fa48("3889") ? "" : (stryCov_9fa48("3889"), 'Unit not found'));
        }
      }

      // Prepare lesson data
      const lesson = stryMutAct_9fa48("3890") ? {} : (stryCov_9fa48("3890"), {
        unit_id: unitId,
        title: lessonData.title,
        content_type: lessonData.content_type,
        description: stryMutAct_9fa48("3893") ? lessonData.description && '' : stryMutAct_9fa48("3892") ? false : stryMutAct_9fa48("3891") ? true : (stryCov_9fa48("3891", "3892", "3893"), lessonData.description || (stryMutAct_9fa48("3894") ? "Stryker was here!" : (stryCov_9fa48("3894"), ''))),
        media_url: stryMutAct_9fa48("3897") ? lessonData.media_url && null : stryMutAct_9fa48("3896") ? false : stryMutAct_9fa48("3895") ? true : (stryCov_9fa48("3895", "3896", "3897"), lessonData.media_url || null),
        key_phrases: stryMutAct_9fa48("3900") ? lessonData.key_phrases && [] : stryMutAct_9fa48("3899") ? false : stryMutAct_9fa48("3898") ? true : (stryCov_9fa48("3898", "3899", "3900"), lessonData.key_phrases || (stryMutAct_9fa48("3901") ? ["Stryker was here"] : (stryCov_9fa48("3901"), []))),
        vocabulary: stryMutAct_9fa48("3904") ? lessonData.vocabulary && {} : stryMutAct_9fa48("3903") ? false : stryMutAct_9fa48("3902") ? true : (stryCov_9fa48("3902", "3903", "3904"), lessonData.vocabulary || {}),
        grammar_points: stryMutAct_9fa48("3907") ? lessonData.grammar_points && {} : stryMutAct_9fa48("3906") ? false : stryMutAct_9fa48("3905") ? true : (stryCov_9fa48("3905", "3906", "3907"), lessonData.grammar_points || {}),
        exercises: stryMutAct_9fa48("3910") ? lessonData.exercises && {} : stryMutAct_9fa48("3909") ? false : stryMutAct_9fa48("3908") ? true : (stryCov_9fa48("3908", "3909", "3910"), lessonData.exercises || {}),
        xp_reward: stryMutAct_9fa48("3913") ? lessonData.xp_reward && 0 : stryMutAct_9fa48("3912") ? false : stryMutAct_9fa48("3911") ? true : (stryCov_9fa48("3911", "3912", "3913"), lessonData.xp_reward || 0)
      });
      const newLesson = await moduleAdminRepository.createLesson(lesson);
      return stryMutAct_9fa48("3914") ? {} : (stryCov_9fa48("3914"), {
        success: stryMutAct_9fa48("3915") ? false : (stryCov_9fa48("3915"), true),
        message: stryMutAct_9fa48("3916") ? "" : (stryCov_9fa48("3916"), 'Lesson created successfully'),
        data: newLesson
      });
    }
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    if (stryMutAct_9fa48("3917")) {
      {}
    } else {
      stryCov_9fa48("3917");
      if (stryMutAct_9fa48("3920") ? false : stryMutAct_9fa48("3919") ? true : stryMutAct_9fa48("3918") ? lessonId : (stryCov_9fa48("3918", "3919", "3920"), !lessonId)) {
        if (stryMutAct_9fa48("3921")) {
          {}
        } else {
          stryCov_9fa48("3921");
          throw new Error(stryMutAct_9fa48("3922") ? "" : (stryCov_9fa48("3922"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("3925") ? false : stryMutAct_9fa48("3924") ? true : stryMutAct_9fa48("3923") ? existingLesson : (stryCov_9fa48("3923", "3924", "3925"), !existingLesson)) {
        if (stryMutAct_9fa48("3926")) {
          {}
        } else {
          stryCov_9fa48("3926");
          throw new Error(stryMutAct_9fa48("3927") ? "" : (stryCov_9fa48("3927"), 'Lesson not found'));
        }
      }
      const updatedLesson = await moduleAdminRepository.updateLesson(lessonId, lessonData);
      return stryMutAct_9fa48("3928") ? {} : (stryCov_9fa48("3928"), {
        success: stryMutAct_9fa48("3929") ? false : (stryCov_9fa48("3929"), true),
        message: stryMutAct_9fa48("3930") ? "" : (stryCov_9fa48("3930"), 'Lesson updated successfully'),
        data: updatedLesson
      });
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    if (stryMutAct_9fa48("3931")) {
      {}
    } else {
      stryCov_9fa48("3931");
      if (stryMutAct_9fa48("3934") ? false : stryMutAct_9fa48("3933") ? true : stryMutAct_9fa48("3932") ? lessonId : (stryCov_9fa48("3932", "3933", "3934"), !lessonId)) {
        if (stryMutAct_9fa48("3935")) {
          {}
        } else {
          stryCov_9fa48("3935");
          throw new Error(stryMutAct_9fa48("3936") ? "" : (stryCov_9fa48("3936"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("3939") ? false : stryMutAct_9fa48("3938") ? true : stryMutAct_9fa48("3937") ? existingLesson : (stryCov_9fa48("3937", "3938", "3939"), !existingLesson)) {
        if (stryMutAct_9fa48("3940")) {
          {}
        } else {
          stryCov_9fa48("3940");
          throw new Error(stryMutAct_9fa48("3941") ? "" : (stryCov_9fa48("3941"), 'Lesson not found'));
        }
      }
      const deletedLesson = await moduleAdminRepository.deleteLesson(lessonId);
      return stryMutAct_9fa48("3942") ? {} : (stryCov_9fa48("3942"), {
        success: stryMutAct_9fa48("3943") ? false : (stryCov_9fa48("3943"), true),
        message: stryMutAct_9fa48("3944") ? "" : (stryCov_9fa48("3944"), 'Lesson deleted successfully'),
        data: deletedLesson
      });
    }
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   */
  async getPublishedLanguages() {
    if (stryMutAct_9fa48("3945")) {
      {}
    } else {
      stryCov_9fa48("3945");
      const languages = await moduleAdminRepository.getPublishedLanguages();
      return stryMutAct_9fa48("3946") ? {} : (stryCov_9fa48("3946"), {
        success: stryMutAct_9fa48("3947") ? false : (stryCov_9fa48("3947"), true),
        data: languages
      });
    }
  }

  /**
   * Get published courses for a specific language for learners
   */
  async getPublishedCoursesByLanguage(language) {
    if (stryMutAct_9fa48("3948")) {
      {}
    } else {
      stryCov_9fa48("3948");
      if (stryMutAct_9fa48("3951") ? false : stryMutAct_9fa48("3950") ? true : stryMutAct_9fa48("3949") ? language : (stryCov_9fa48("3949", "3950", "3951"), !language)) {
        if (stryMutAct_9fa48("3952")) {
          {}
        } else {
          stryCov_9fa48("3952");
          throw new Error(stryMutAct_9fa48("3953") ? "" : (stryCov_9fa48("3953"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getPublishedCoursesByLanguage(language);
      return stryMutAct_9fa48("3954") ? {} : (stryCov_9fa48("3954"), {
        success: stryMutAct_9fa48("3955") ? false : (stryCov_9fa48("3955"), true),
        data: courses
      });
    }
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("3956")) {
      {}
    } else {
      stryCov_9fa48("3956");
      if (stryMutAct_9fa48("3959") ? false : stryMutAct_9fa48("3958") ? true : stryMutAct_9fa48("3957") ? courseId : (stryCov_9fa48("3957", "3958", "3959"), !courseId)) {
        if (stryMutAct_9fa48("3960")) {
          {}
        } else {
          stryCov_9fa48("3960");
          throw new Error(stryMutAct_9fa48("3961") ? "" : (stryCov_9fa48("3961"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getPublishedCourseDetails(courseId);
      if (stryMutAct_9fa48("3964") ? false : stryMutAct_9fa48("3963") ? true : stryMutAct_9fa48("3962") ? course : (stryCov_9fa48("3962", "3963", "3964"), !course)) {
        if (stryMutAct_9fa48("3965")) {
          {}
        } else {
          stryCov_9fa48("3965");
          throw new Error(stryMutAct_9fa48("3966") ? "" : (stryCov_9fa48("3966"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("3967") ? {} : (stryCov_9fa48("3967"), {
        success: stryMutAct_9fa48("3968") ? false : (stryCov_9fa48("3968"), true),
        data: course
      });
    }
  }
}
export default new ModuleAdminService();