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

    getToken = async () => {
        console.log("trying getToken")
        const response = await axios.post(`https://${process.env.REACT_APP_AUTH0_domain}/oauth/token`, {
            client_id: process.env.Auth0_M2M_CLIENT_ID,
            client_secret: process.env.Auth0_M2M_CLIENT_SECRET,
            audience: process.env.Auth0_M2M_AUDIENCE,
            grant_type: "client_credentials"
        }, {
        headers: { "Content-Type": "application/json" }
        });

        console.log(response.data);
        return response.data.access_token;
    }

    async assignAdmin(userId) {
        let data = JSON.stringify({
            "roles": [
                "rol_XQpYexn0DuyyZRll"
            ]   
        });
        const token = await this.getToken();
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://${process.env.Auth0_M2M_AUDIENCE}users/${userId}/roles`,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
        },
        data : data
        };

        const response = await axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
        return response;
    }

    async removeAdmin(userId) {
        console.log('removing');
        let data = JSON.stringify({
            "roles": [
                "rol_XQpYexn0DuyyZRll"
            ]   
        });

        const token = await this.getToken();
        
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `https://${process.env.Auth0_M2M_AUDIENCE}users/${userId}/roles`,
            headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data : data
        };

        const response = await axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
        return response;
    }
}
        

module.exports = new Auth0ManagementService();