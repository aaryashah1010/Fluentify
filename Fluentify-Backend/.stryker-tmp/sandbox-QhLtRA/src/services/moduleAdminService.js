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
    if (stryMutAct_9fa48("828")) {
      {}
    } else {
      stryCov_9fa48("828");
      const languages = await moduleAdminRepository.getLanguages();
      return stryMutAct_9fa48("829") ? {} : (stryCov_9fa48("829"), {
        success: stryMutAct_9fa48("830") ? false : (stryCov_9fa48("830"), true),
        data: languages
      });
    }
  }

  /**
   * Get all courses for a specific language
   */
  async getCoursesByLanguage(language) {
    if (stryMutAct_9fa48("831")) {
      {}
    } else {
      stryCov_9fa48("831");
      if (stryMutAct_9fa48("834") ? false : stryMutAct_9fa48("833") ? true : stryMutAct_9fa48("832") ? language : (stryCov_9fa48("832", "833", "834"), !language)) {
        if (stryMutAct_9fa48("835")) {
          {}
        } else {
          stryCov_9fa48("835");
          throw new Error(stryMutAct_9fa48("836") ? "" : (stryCov_9fa48("836"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getCoursesByLanguage(language);
      return stryMutAct_9fa48("837") ? {} : (stryCov_9fa48("837"), {
        success: stryMutAct_9fa48("838") ? false : (stryCov_9fa48("838"), true),
        data: courses
      });
    }
  }

  // ==================== Course (Module) Operations ====================

  /**
   * Create a new course
   */
  async createCourse(adminId, courseData) {
    if (stryMutAct_9fa48("839")) {
      {}
    } else {
      stryCov_9fa48("839");
      // Validate required fields
      if (stryMutAct_9fa48("842") ? !courseData.title && !courseData.language : stryMutAct_9fa48("841") ? false : stryMutAct_9fa48("840") ? true : (stryCov_9fa48("840", "841", "842"), (stryMutAct_9fa48("843") ? courseData.title : (stryCov_9fa48("843"), !courseData.title)) || (stryMutAct_9fa48("844") ? courseData.language : (stryCov_9fa48("844"), !courseData.language)))) {
        if (stryMutAct_9fa48("845")) {
          {}
        } else {
          stryCov_9fa48("845");
          throw new Error(stryMutAct_9fa48("846") ? "" : (stryCov_9fa48("846"), 'Title and language are required'));
        }
      }
      if (stryMutAct_9fa48("849") ? false : stryMutAct_9fa48("848") ? true : stryMutAct_9fa48("847") ? courseData.level : (stryCov_9fa48("847", "848", "849"), !courseData.level)) {
        if (stryMutAct_9fa48("850")) {
          {}
        } else {
          stryCov_9fa48("850");
          throw new Error(stryMutAct_9fa48("851") ? "" : (stryCov_9fa48("851"), 'Level is required (e.g., Beginner, Intermediate, Advanced)'));
        }
      }

      // Prepare course data
      const course = stryMutAct_9fa48("852") ? {} : (stryCov_9fa48("852"), {
        admin_id: adminId,
        language: courseData.language,
        level: courseData.level,
        title: courseData.title,
        description: stryMutAct_9fa48("855") ? courseData.description && '' : stryMutAct_9fa48("854") ? false : stryMutAct_9fa48("853") ? true : (stryCov_9fa48("853", "854", "855"), courseData.description || (stryMutAct_9fa48("856") ? "Stryker was here!" : (stryCov_9fa48("856"), ''))),
        thumbnail_url: stryMutAct_9fa48("859") ? courseData.thumbnail_url && null : stryMutAct_9fa48("858") ? false : stryMutAct_9fa48("857") ? true : (stryCov_9fa48("857", "858", "859"), courseData.thumbnail_url || null),
        estimated_duration: stryMutAct_9fa48("862") ? courseData.estimated_duration && null : stryMutAct_9fa48("861") ? false : stryMutAct_9fa48("860") ? true : (stryCov_9fa48("860", "861", "862"), courseData.estimated_duration || null),
        is_published: stryMutAct_9fa48("865") ? courseData.is_published && false : stryMutAct_9fa48("864") ? false : stryMutAct_9fa48("863") ? true : (stryCov_9fa48("863", "864", "865"), courseData.is_published || (stryMutAct_9fa48("866") ? true : (stryCov_9fa48("866"), false)))
      });
      const newCourse = await moduleAdminRepository.createCourse(course);
      return stryMutAct_9fa48("867") ? {} : (stryCov_9fa48("867"), {
        success: stryMutAct_9fa48("868") ? false : (stryCov_9fa48("868"), true),
        message: stryMutAct_9fa48("869") ? "" : (stryCov_9fa48("869"), 'Course created successfully'),
        data: newCourse
      });
    }
  }

  /**
   * Get course details with units and lessons
   */
  async getCourseDetails(courseId) {
    if (stryMutAct_9fa48("870")) {
      {}
    } else {
      stryCov_9fa48("870");
      if (stryMutAct_9fa48("873") ? false : stryMutAct_9fa48("872") ? true : stryMutAct_9fa48("871") ? courseId : (stryCov_9fa48("871", "872", "873"), !courseId)) {
        if (stryMutAct_9fa48("874")) {
          {}
        } else {
          stryCov_9fa48("874");
          throw new Error(stryMutAct_9fa48("875") ? "" : (stryCov_9fa48("875"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("878") ? false : stryMutAct_9fa48("877") ? true : stryMutAct_9fa48("876") ? course : (stryCov_9fa48("876", "877", "878"), !course)) {
        if (stryMutAct_9fa48("879")) {
          {}
        } else {
          stryCov_9fa48("879");
          throw new Error(stryMutAct_9fa48("880") ? "" : (stryCov_9fa48("880"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("881") ? {} : (stryCov_9fa48("881"), {
        success: stryMutAct_9fa48("882") ? false : (stryCov_9fa48("882"), true),
        data: course
      });
    }
  }

  /**
   * Update a course
   */
  async updateCourse(courseId, courseData) {
    if (stryMutAct_9fa48("883")) {
      {}
    } else {
      stryCov_9fa48("883");
      if (stryMutAct_9fa48("886") ? false : stryMutAct_9fa48("885") ? true : stryMutAct_9fa48("884") ? courseId : (stryCov_9fa48("884", "885", "886"), !courseId)) {
        if (stryMutAct_9fa48("887")) {
          {}
        } else {
          stryCov_9fa48("887");
          throw new Error(stryMutAct_9fa48("888") ? "" : (stryCov_9fa48("888"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("891") ? false : stryMutAct_9fa48("890") ? true : stryMutAct_9fa48("889") ? existingCourse : (stryCov_9fa48("889", "890", "891"), !existingCourse)) {
        if (stryMutAct_9fa48("892")) {
          {}
        } else {
          stryCov_9fa48("892");
          throw new Error(stryMutAct_9fa48("893") ? "" : (stryCov_9fa48("893"), 'Course not found'));
        }
      }
      const updatedCourse = await moduleAdminRepository.updateCourse(courseId, courseData);
      return stryMutAct_9fa48("894") ? {} : (stryCov_9fa48("894"), {
        success: stryMutAct_9fa48("895") ? false : (stryCov_9fa48("895"), true),
        message: stryMutAct_9fa48("896") ? "" : (stryCov_9fa48("896"), 'Course updated successfully'),
        data: updatedCourse
      });
    }
  }

  /**
   * Delete a course
   */
  async deleteCourse(courseId) {
    if (stryMutAct_9fa48("897")) {
      {}
    } else {
      stryCov_9fa48("897");
      if (stryMutAct_9fa48("900") ? false : stryMutAct_9fa48("899") ? true : stryMutAct_9fa48("898") ? courseId : (stryCov_9fa48("898", "899", "900"), !courseId)) {
        if (stryMutAct_9fa48("901")) {
          {}
        } else {
          stryCov_9fa48("901");
          throw new Error(stryMutAct_9fa48("902") ? "" : (stryCov_9fa48("902"), 'Course ID is required'));
        }
      }

      // Check if course exists
      const existingCourse = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("905") ? false : stryMutAct_9fa48("904") ? true : stryMutAct_9fa48("903") ? existingCourse : (stryCov_9fa48("903", "904", "905"), !existingCourse)) {
        if (stryMutAct_9fa48("906")) {
          {}
        } else {
          stryCov_9fa48("906");
          throw new Error(stryMutAct_9fa48("907") ? "" : (stryCov_9fa48("907"), 'Course not found'));
        }
      }
      const deletedCourse = await moduleAdminRepository.deleteCourse(courseId);
      return stryMutAct_9fa48("908") ? {} : (stryCov_9fa48("908"), {
        success: stryMutAct_9fa48("909") ? false : (stryCov_9fa48("909"), true),
        message: stryMutAct_9fa48("910") ? "" : (stryCov_9fa48("910"), 'Course deleted successfully'),
        data: deletedCourse
      });
    }
  }

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   */
  async createUnit(courseId, unitData) {
    if (stryMutAct_9fa48("911")) {
      {}
    } else {
      stryCov_9fa48("911");
      if (stryMutAct_9fa48("914") ? false : stryMutAct_9fa48("913") ? true : stryMutAct_9fa48("912") ? courseId : (stryCov_9fa48("912", "913", "914"), !courseId)) {
        if (stryMutAct_9fa48("915")) {
          {}
        } else {
          stryCov_9fa48("915");
          throw new Error(stryMutAct_9fa48("916") ? "" : (stryCov_9fa48("916"), 'Course ID is required'));
        }
      }
      if (stryMutAct_9fa48("919") ? false : stryMutAct_9fa48("918") ? true : stryMutAct_9fa48("917") ? unitData.title : (stryCov_9fa48("917", "918", "919"), !unitData.title)) {
        if (stryMutAct_9fa48("920")) {
          {}
        } else {
          stryCov_9fa48("920");
          throw new Error(stryMutAct_9fa48("921") ? "" : (stryCov_9fa48("921"), 'Unit title is required'));
        }
      }

      // Verify course exists
      const course = await moduleAdminRepository.getCourseDetails(courseId);
      if (stryMutAct_9fa48("924") ? false : stryMutAct_9fa48("923") ? true : stryMutAct_9fa48("922") ? course : (stryCov_9fa48("922", "923", "924"), !course)) {
        if (stryMutAct_9fa48("925")) {
          {}
        } else {
          stryCov_9fa48("925");
          throw new Error(stryMutAct_9fa48("926") ? "" : (stryCov_9fa48("926"), 'Course not found'));
        }
      }

      // Prepare unit data
      const unit = stryMutAct_9fa48("927") ? {} : (stryCov_9fa48("927"), {
        module_id: courseId,
        title: unitData.title,
        description: stryMutAct_9fa48("930") ? unitData.description && '' : stryMutAct_9fa48("929") ? false : stryMutAct_9fa48("928") ? true : (stryCov_9fa48("928", "929", "930"), unitData.description || (stryMutAct_9fa48("931") ? "Stryker was here!" : (stryCov_9fa48("931"), ''))),
        difficulty: stryMutAct_9fa48("934") ? unitData.difficulty && 'Beginner' : stryMutAct_9fa48("933") ? false : stryMutAct_9fa48("932") ? true : (stryCov_9fa48("932", "933", "934"), unitData.difficulty || (stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), 'Beginner'))),
        estimated_time: stryMutAct_9fa48("938") ? unitData.estimated_time && 0 : stryMutAct_9fa48("937") ? false : stryMutAct_9fa48("936") ? true : (stryCov_9fa48("936", "937", "938"), unitData.estimated_time || 0)
      });
      const newUnit = await moduleAdminRepository.createUnit(unit);
      return stryMutAct_9fa48("939") ? {} : (stryCov_9fa48("939"), {
        success: stryMutAct_9fa48("940") ? false : (stryCov_9fa48("940"), true),
        message: stryMutAct_9fa48("941") ? "" : (stryCov_9fa48("941"), 'Unit created successfully'),
        data: newUnit
      });
    }
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    if (stryMutAct_9fa48("942")) {
      {}
    } else {
      stryCov_9fa48("942");
      if (stryMutAct_9fa48("945") ? false : stryMutAct_9fa48("944") ? true : stryMutAct_9fa48("943") ? unitId : (stryCov_9fa48("943", "944", "945"), !unitId)) {
        if (stryMutAct_9fa48("946")) {
          {}
        } else {
          stryCov_9fa48("946");
          throw new Error(stryMutAct_9fa48("947") ? "" : (stryCov_9fa48("947"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("950") ? false : stryMutAct_9fa48("949") ? true : stryMutAct_9fa48("948") ? existingUnit : (stryCov_9fa48("948", "949", "950"), !existingUnit)) {
        if (stryMutAct_9fa48("951")) {
          {}
        } else {
          stryCov_9fa48("951");
          throw new Error(stryMutAct_9fa48("952") ? "" : (stryCov_9fa48("952"), 'Unit not found'));
        }
      }
      const updatedUnit = await moduleAdminRepository.updateUnit(unitId, unitData);
      return stryMutAct_9fa48("953") ? {} : (stryCov_9fa48("953"), {
        success: stryMutAct_9fa48("954") ? false : (stryCov_9fa48("954"), true),
        message: stryMutAct_9fa48("955") ? "" : (stryCov_9fa48("955"), 'Unit updated successfully'),
        data: updatedUnit
      });
    }
  }

  /**
   * Delete a unit
   */
  async deleteUnit(unitId) {
    if (stryMutAct_9fa48("956")) {
      {}
    } else {
      stryCov_9fa48("956");
      if (stryMutAct_9fa48("959") ? false : stryMutAct_9fa48("958") ? true : stryMutAct_9fa48("957") ? unitId : (stryCov_9fa48("957", "958", "959"), !unitId)) {
        if (stryMutAct_9fa48("960")) {
          {}
        } else {
          stryCov_9fa48("960");
          throw new Error(stryMutAct_9fa48("961") ? "" : (stryCov_9fa48("961"), 'Unit ID is required'));
        }
      }

      // Check if unit exists
      const existingUnit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("964") ? false : stryMutAct_9fa48("963") ? true : stryMutAct_9fa48("962") ? existingUnit : (stryCov_9fa48("962", "963", "964"), !existingUnit)) {
        if (stryMutAct_9fa48("965")) {
          {}
        } else {
          stryCov_9fa48("965");
          throw new Error(stryMutAct_9fa48("966") ? "" : (stryCov_9fa48("966"), 'Unit not found'));
        }
      }
      const deletedUnit = await moduleAdminRepository.deleteUnit(unitId);
      return stryMutAct_9fa48("967") ? {} : (stryCov_9fa48("967"), {
        success: stryMutAct_9fa48("968") ? false : (stryCov_9fa48("968"), true),
        message: stryMutAct_9fa48("969") ? "" : (stryCov_9fa48("969"), 'Unit deleted successfully'),
        data: deletedUnit
      });
    }
  }

  // ==================== Lesson Operations ====================

  /**
   * Create a new lesson
   */
  async createLesson(unitId, lessonData) {
    if (stryMutAct_9fa48("970")) {
      {}
    } else {
      stryCov_9fa48("970");
      if (stryMutAct_9fa48("973") ? false : stryMutAct_9fa48("972") ? true : stryMutAct_9fa48("971") ? unitId : (stryCov_9fa48("971", "972", "973"), !unitId)) {
        if (stryMutAct_9fa48("974")) {
          {}
        } else {
          stryCov_9fa48("974");
          throw new Error(stryMutAct_9fa48("975") ? "" : (stryCov_9fa48("975"), 'Unit ID is required'));
        }
      }
      if (stryMutAct_9fa48("978") ? !lessonData.title && !lessonData.content_type : stryMutAct_9fa48("977") ? false : stryMutAct_9fa48("976") ? true : (stryCov_9fa48("976", "977", "978"), (stryMutAct_9fa48("979") ? lessonData.title : (stryCov_9fa48("979"), !lessonData.title)) || (stryMutAct_9fa48("980") ? lessonData.content_type : (stryCov_9fa48("980"), !lessonData.content_type)))) {
        if (stryMutAct_9fa48("981")) {
          {}
        } else {
          stryCov_9fa48("981");
          throw new Error(stryMutAct_9fa48("982") ? "" : (stryCov_9fa48("982"), 'Lesson title and content type are required'));
        }
      }

      // Verify unit exists
      const unit = await moduleAdminRepository.getUnitById(unitId);
      if (stryMutAct_9fa48("985") ? false : stryMutAct_9fa48("984") ? true : stryMutAct_9fa48("983") ? unit : (stryCov_9fa48("983", "984", "985"), !unit)) {
        if (stryMutAct_9fa48("986")) {
          {}
        } else {
          stryCov_9fa48("986");
          throw new Error(stryMutAct_9fa48("987") ? "" : (stryCov_9fa48("987"), 'Unit not found'));
        }
      }

      // Prepare lesson data
      const lesson = stryMutAct_9fa48("988") ? {} : (stryCov_9fa48("988"), {
        unit_id: unitId,
        title: lessonData.title,
        content_type: lessonData.content_type,
        description: stryMutAct_9fa48("991") ? lessonData.description && '' : stryMutAct_9fa48("990") ? false : stryMutAct_9fa48("989") ? true : (stryCov_9fa48("989", "990", "991"), lessonData.description || (stryMutAct_9fa48("992") ? "Stryker was here!" : (stryCov_9fa48("992"), ''))),
        media_url: stryMutAct_9fa48("995") ? lessonData.media_url && null : stryMutAct_9fa48("994") ? false : stryMutAct_9fa48("993") ? true : (stryCov_9fa48("993", "994", "995"), lessonData.media_url || null),
        key_phrases: stryMutAct_9fa48("998") ? lessonData.key_phrases && [] : stryMutAct_9fa48("997") ? false : stryMutAct_9fa48("996") ? true : (stryCov_9fa48("996", "997", "998"), lessonData.key_phrases || (stryMutAct_9fa48("999") ? ["Stryker was here"] : (stryCov_9fa48("999"), []))),
        vocabulary: stryMutAct_9fa48("1002") ? lessonData.vocabulary && {} : stryMutAct_9fa48("1001") ? false : stryMutAct_9fa48("1000") ? true : (stryCov_9fa48("1000", "1001", "1002"), lessonData.vocabulary || {}),
        grammar_points: stryMutAct_9fa48("1005") ? lessonData.grammar_points && {} : stryMutAct_9fa48("1004") ? false : stryMutAct_9fa48("1003") ? true : (stryCov_9fa48("1003", "1004", "1005"), lessonData.grammar_points || {}),
        exercises: stryMutAct_9fa48("1008") ? lessonData.exercises && {} : stryMutAct_9fa48("1007") ? false : stryMutAct_9fa48("1006") ? true : (stryCov_9fa48("1006", "1007", "1008"), lessonData.exercises || {}),
        xp_reward: stryMutAct_9fa48("1011") ? lessonData.xp_reward && 0 : stryMutAct_9fa48("1010") ? false : stryMutAct_9fa48("1009") ? true : (stryCov_9fa48("1009", "1010", "1011"), lessonData.xp_reward || 0)
      });
      const newLesson = await moduleAdminRepository.createLesson(lesson);
      return stryMutAct_9fa48("1012") ? {} : (stryCov_9fa48("1012"), {
        success: stryMutAct_9fa48("1013") ? false : (stryCov_9fa48("1013"), true),
        message: stryMutAct_9fa48("1014") ? "" : (stryCov_9fa48("1014"), 'Lesson created successfully'),
        data: newLesson
      });
    }
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    if (stryMutAct_9fa48("1015")) {
      {}
    } else {
      stryCov_9fa48("1015");
      if (stryMutAct_9fa48("1018") ? false : stryMutAct_9fa48("1017") ? true : stryMutAct_9fa48("1016") ? lessonId : (stryCov_9fa48("1016", "1017", "1018"), !lessonId)) {
        if (stryMutAct_9fa48("1019")) {
          {}
        } else {
          stryCov_9fa48("1019");
          throw new Error(stryMutAct_9fa48("1020") ? "" : (stryCov_9fa48("1020"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("1023") ? false : stryMutAct_9fa48("1022") ? true : stryMutAct_9fa48("1021") ? existingLesson : (stryCov_9fa48("1021", "1022", "1023"), !existingLesson)) {
        if (stryMutAct_9fa48("1024")) {
          {}
        } else {
          stryCov_9fa48("1024");
          throw new Error(stryMutAct_9fa48("1025") ? "" : (stryCov_9fa48("1025"), 'Lesson not found'));
        }
      }
      const updatedLesson = await moduleAdminRepository.updateLesson(lessonId, lessonData);
      return stryMutAct_9fa48("1026") ? {} : (stryCov_9fa48("1026"), {
        success: stryMutAct_9fa48("1027") ? false : (stryCov_9fa48("1027"), true),
        message: stryMutAct_9fa48("1028") ? "" : (stryCov_9fa48("1028"), 'Lesson updated successfully'),
        data: updatedLesson
      });
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    if (stryMutAct_9fa48("1029")) {
      {}
    } else {
      stryCov_9fa48("1029");
      if (stryMutAct_9fa48("1032") ? false : stryMutAct_9fa48("1031") ? true : stryMutAct_9fa48("1030") ? lessonId : (stryCov_9fa48("1030", "1031", "1032"), !lessonId)) {
        if (stryMutAct_9fa48("1033")) {
          {}
        } else {
          stryCov_9fa48("1033");
          throw new Error(stryMutAct_9fa48("1034") ? "" : (stryCov_9fa48("1034"), 'Lesson ID is required'));
        }
      }

      // Check if lesson exists
      const existingLesson = await moduleAdminRepository.getLessonById(lessonId);
      if (stryMutAct_9fa48("1037") ? false : stryMutAct_9fa48("1036") ? true : stryMutAct_9fa48("1035") ? existingLesson : (stryCov_9fa48("1035", "1036", "1037"), !existingLesson)) {
        if (stryMutAct_9fa48("1038")) {
          {}
        } else {
          stryCov_9fa48("1038");
          throw new Error(stryMutAct_9fa48("1039") ? "" : (stryCov_9fa48("1039"), 'Lesson not found'));
        }
      }
      const deletedLesson = await moduleAdminRepository.deleteLesson(lessonId);
      return stryMutAct_9fa48("1040") ? {} : (stryCov_9fa48("1040"), {
        success: stryMutAct_9fa48("1041") ? false : (stryCov_9fa48("1041"), true),
        message: stryMutAct_9fa48("1042") ? "" : (stryCov_9fa48("1042"), 'Lesson deleted successfully'),
        data: deletedLesson
      });
    }
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   */
  async getPublishedLanguages() {
    if (stryMutAct_9fa48("1043")) {
      {}
    } else {
      stryCov_9fa48("1043");
      const languages = await moduleAdminRepository.getPublishedLanguages();
      return stryMutAct_9fa48("1044") ? {} : (stryCov_9fa48("1044"), {
        success: stryMutAct_9fa48("1045") ? false : (stryCov_9fa48("1045"), true),
        data: languages
      });
    }
  }

  /**
   * Get published courses for a specific language for learners
   */
  async getPublishedCoursesByLanguage(language) {
    if (stryMutAct_9fa48("1046")) {
      {}
    } else {
      stryCov_9fa48("1046");
      if (stryMutAct_9fa48("1049") ? false : stryMutAct_9fa48("1048") ? true : stryMutAct_9fa48("1047") ? language : (stryCov_9fa48("1047", "1048", "1049"), !language)) {
        if (stryMutAct_9fa48("1050")) {
          {}
        } else {
          stryCov_9fa48("1050");
          throw new Error(stryMutAct_9fa48("1051") ? "" : (stryCov_9fa48("1051"), 'Language parameter is required'));
        }
      }
      const courses = await moduleAdminRepository.getPublishedCoursesByLanguage(language);
      return stryMutAct_9fa48("1052") ? {} : (stryCov_9fa48("1052"), {
        success: stryMutAct_9fa48("1053") ? false : (stryCov_9fa48("1053"), true),
        data: courses
      });
    }
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("1054")) {
      {}
    } else {
      stryCov_9fa48("1054");
      if (stryMutAct_9fa48("1057") ? false : stryMutAct_9fa48("1056") ? true : stryMutAct_9fa48("1055") ? courseId : (stryCov_9fa48("1055", "1056", "1057"), !courseId)) {
        if (stryMutAct_9fa48("1058")) {
          {}
        } else {
          stryCov_9fa48("1058");
          throw new Error(stryMutAct_9fa48("1059") ? "" : (stryCov_9fa48("1059"), 'Course ID is required'));
        }
      }
      const course = await moduleAdminRepository.getPublishedCourseDetails(courseId);
      if (stryMutAct_9fa48("1062") ? false : stryMutAct_9fa48("1061") ? true : stryMutAct_9fa48("1060") ? course : (stryCov_9fa48("1060", "1061", "1062"), !course)) {
        if (stryMutAct_9fa48("1063")) {
          {}
        } else {
          stryCov_9fa48("1063");
          throw new Error(stryMutAct_9fa48("1064") ? "" : (stryCov_9fa48("1064"), 'Course not found'));
        }
      }
      return stryMutAct_9fa48("1065") ? {} : (stryCov_9fa48("1065"), {
        success: stryMutAct_9fa48("1066") ? false : (stryCov_9fa48("1066"), true),
        data: course
      });
    }
  }
}
export default new ModuleAdminService();