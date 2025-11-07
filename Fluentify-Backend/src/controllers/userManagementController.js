import userManagementService from '../services/userManagementService.js';
import { validationResult } from 'express-validator';

class UserManagementController {
    /**
     * Get all users with pagination
     * GET /api/admin/users
     * Query params: page (default: 1), limit (default: 20)
     */
    async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const users = await userManagementService.getUsersList(page, limit);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Search users by name or email
     * GET /api/admin/users/search?q=searchTerm
     */
    async searchUsers(req, res, next) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ message: 'Search query is required' });
            }
            const users = await userManagementService.findUsers(q);
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user details and progress
     * GET /api/admin/users/:userId
     */
    async getUserDetails(req, res, next) {
        try {
            const user = await userManagementService.getUserWithProgress(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user profile
     * PUT /api/admin/users/:userId
     */
    async updateUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const updatedUser = await userManagementService.updateUserData(
                req.params.userId,
                req.body
            );
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a user
     * DELETE /api/admin/users/:userId
     */
    async deleteUser(req, res, next) {
        try {
            await userManagementService.deleteUser(req.params.userId);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserManagementController();
