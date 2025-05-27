const { ManagementClient } = require('auth0');

class Auth0ManagementService {
    constructor() {
        this.management = new ManagementClient({
            client_id: process.env.Auth0_M2M_CLIENT_ID,
            client_secret: process.env.Auth0_M2M_CLIENT_SECRET,
            domain: process.env.REACT_APP_AUTH0_domain,
            scope: 'read:users read:user_idp_tokens update:client_grants update:users delete:users create:users read:clients read:roles create:role_members read:role_members delete:role_members'
        });
    }

    async getAllUsers() {
        try {
            return await this.management.users.getAll();
        } catch (error) {
            console.error('Auth0 Management Error:', error);
            throw new Error('Failed to fetch users from Auth0');
        }
    }

    /*
    async deleteUser(userId) {
        
    }

    // Add to auth0Management.service.js
    async function verifyRolesExist(roles) {
        try {
            const existingRoles = await this.management.roles.getAll();
            const existingRoleNames = existingRoles.map(role => role.name);
            
            return roles.every(role => existingRoleNames.includes(role));
        } catch (error) {
            console.error('Error verifying roles:', error);
            return false;
        }
    }

    // Then update the assignRolesToUser method:
    async assignRolesToUser(userId, roles) {
        if (!await this.verifyRolesExist(roles)) {
            throw new Error('One or more roles do not exist');
        }
        // ... rest of the implementation
        } */
    }
        

module.exports = new Auth0ManagementService();