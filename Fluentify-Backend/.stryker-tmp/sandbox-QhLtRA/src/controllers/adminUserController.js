// @ts-nocheck
import adminUserRepository from '../repositories/adminUserRepository.js';
import courseRepository from '../repositories/courseRepository.js';
import { listResponse, successResponse } from '../utils/response.js';
import { validateEmail, validateName } from '../utils/validation.js';
import { ERRORS } from '../utils/error.js';
import emailService from '../utils/emailService.js';

class AdminUserController {
  async listLearners(req, res, next) {
    try {
      const page = Math.max(parseInt(req.query.page || '1', 10), 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
      const offset = (page - 1) * limit;
      const search = (req.query.search || '').trim();

      const [items, total] = await Promise.all([
        adminUserRepository.findLearners({ search, limit, offset }),
        adminUserRepository.countLearners({ search })
      ]);

      res.json(listResponse(items, total, page, limit));
    } catch (error) {
      next(error);
    }
  }

  async getLearnerDetails(req, res, next) {
    try {
      const { id } = req.params;

      const basic = await adminUserRepository.getLearnerBasicById(id);
      if (!basic) {
        throw ERRORS.USER_NOT_FOUND;
      }

      const [summary, courses] = await Promise.all([
        adminUserRepository.getLearnerProgressSummary(id),
        courseRepository.findLearnerCoursesWithStats(id)
      ]);

      res.json(successResponse({ user: basic, summary, courses }, 'Learner details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async updateLearner(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email } = req.body || {};

      if (!name && !email) {
        return res.status(400).json({ success: false, message: 'Nothing to update' });
      }

      if (name) {
        const nv = validateName(name);
        if (!nv.isValid) {
          return res.status(400).json({ success: false, message: nv.errors.join(', ') });
        }
      }

      if (email) {
        const ev = validateEmail(email);
        if (!ev.isValid) {
          return res.status(400).json({ success: false, message: ev.errors.join(', ') });
        }
      }

      const before = await adminUserRepository.getLearnerBasicById(id);
      if (!before) {
        throw ERRORS.USER_NOT_FOUND;
      }

      const updated = await adminUserRepository.updateLearnerProfile(id, { name, email });
      if (!updated) {
        throw ERRORS.USER_NOT_FOUND;
      }

      // Email notify learner (non-blocking)
      try {
        const changes = [];
        if (name && name !== before.name) {
          changes.push({ field: 'Name', from: before.name, to: updated.name });
        }
        if (email && email.toLowerCase() !== before.email.toLowerCase()) {
          changes.push({ field: 'Email', from: before.email, to: updated.email });
        }
        emailService
          .sendAdminProfileChangeNotification(updated.email, updated.name || before.name, changes)
          .catch(() => {});
      } catch {}

      res.json(successResponse({ user: updated }, 'Learner updated successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminUserController();


