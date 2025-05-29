const { ManagementClient } = require('auth0');
const axios = require('axios');

class Auth0ManagementService {
    constructor() {
        this.management = new ManagementClient({
            clientId: process.env.Auth0_M2M_CLIENT_ID,
            clientSecret: process.env.Auth0_M2M_CLIENT_SECRET,
            domain: process.env.REACT_APP_AUTH0_domain,
            audience: process.env.Auth0_M2M_AUDIENCE,
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

    async getUserRoles(userId) {
        try {
            return await this.management.users.getRoles({
                id: userId
            });
        } catch (error) {
            console.error('Auth0 Management Error:', error);
            throw new Error('Failed to fetch roles from Auth0');
        }
    }

    
    async deleteUser(userId) {
      try {
        return await this.management.users.delete({ id: userId });
      }  catch (error) {
        console.error('Auth0 Management Error:', error);
        throw new Error('Failed to delete user from Auth0');
      }
    }

    async getUserRoles(userId) {
        try {
            return await this.management.users.getRoles({ id: userId });
        } catch (error) {
            console.error('Auth0 Management Error:', error);
            throw new Error('Failed to fetch user roles from Auth0');
        }
    }

    async assignAdmin(userId) {
            let data = JSON.stringify({
            "roles": [
                "admin_role"
            ]   
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://'+ process.env.REACT_APP_AUTH0_domain +'/api/v2/users/'+userId+'/roles',
            headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async removeAdmin(userId) {
            let data = JSON.stringify({
            "roles": [
                "admin_role"
            ]   
        });

        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: 'https://'+ process.env.REACT_APP_AUTH0_domain +'/api/v2/users/'+userId+'/roles',
            headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async assignRegistered(userId) {
            let data = JSON.stringify({
            "roles": [
                "registered_role"
            ]   
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://'+ process.env.REACT_APP_AUTH0_domain +'/api/v2/users/'+userId+'/roles',
            headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async removeRegistered(userId) {
            let data = JSON.stringify({
            "roles": [
                "registered_role"
            ]   
        });

        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: 'https://'+ process.env.REACT_APP_AUTH0_domain +'/api/v2/users/'+userId+'/roles',
            headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
        

module.exports = new Auth0ManagementService();