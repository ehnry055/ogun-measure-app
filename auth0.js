const { ManagementClient } = require("auth0");
const axios = require("axios");

class Auth0ManagementService {
  constructor() {
    this.management = new ManagementClient({
      clientId: process.env.Auth0_M2M_CLIENT_ID,
      clientSecret: process.env.Auth0_M2M_CLIENT_SECRET,
      domain: process.env.REACT_APP_AUTH0_domain,
      audience: process.env.Auth0_M2M_AUDIENCE,
      scope:
        "read:users read:user_idp_tokens update:client_grants update:users delete:users create:users read:clients read:roles create:role_members read:role_members delete:role_members",
    });
  }

  async getAllUsers() {
    try {
      return await this.management.users.getAll();
    } catch (error) {
      console.error("Auth0 Management Error:", error);
      throw new Error("Failed to fetch users from Auth0");
    }
  }

  async getUserRoles(userId) {
    try {
      return await this.management.users.getRoles({ id: userId });
    } catch (error) {
      console.error("Auth0 Management Error:", error);
      throw new Error("Failed to fetch roles from Auth0");
    }
  }

  async deleteUser(userId) {
    try {
      return await this.management.users.delete({ id: userId });
    } catch (error) {
      console.error("Auth0 Management Error:", error);
      throw new Error("Failed to delete user from Auth0");
    }
  }

  getToken = async () => {
    const response = await axios.post(
      `https://${process.env.REACT_APP_AUTH0_domain}/oauth/token`,
      {
        client_id: process.env.Auth0_M2M_CLIENT_ID,
        client_secret: process.env.Auth0_M2M_CLIENT_SECRET,
        audience: process.env.Auth0_M2M_AUDIENCE,
        grant_type: "client_credentials",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.access_token;
  };

  async assignRegistered(userId) {
    const data = JSON.stringify({
      roles: ["rol_s0gbfVEc1ktAU3Lv"],
    });

    const token = await this.getToken();

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.Auth0_M2M_AUDIENCE}users/${userId}/roles`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data,
    };

    // Return response so callers can detect success/failure
    return await axios.request(config);
  }

  async removeRegistered(userId) {
    const data = JSON.stringify({
      roles: ["rol_s0gbfVEc1ktAU3Lv"],
    });

    const token = await this.getToken();

    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.Auth0_M2M_AUDIENCE}users/${userId}/roles`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data,
    };

    // Return response so callers can detect success/failure
    return await axios.request(config);
  }

  // NEW: lookup users by email
  async getUsersByEmail(email) {
    try {
      if (!email) throw new Error("Email is required");

      const token = await this.getToken();
      const url = `${process.env.Auth0_M2M_AUDIENCE}users-by-email?email=${encodeURIComponent(
        email
      )}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; // array of users
    } catch (error) {
      console.error(
        "Auth0 Management Error (getUsersByEmail):",
        error?.response?.data || error
      );
      throw new Error("Failed to fetch user by email from Auth0");
    }
  }

  // NEW: convenience method for approve endpoint
  async getUserIdByEmail(email) {
    const users = await this.getUsersByEmail(email);
    if (!users || users.length === 0) return null;
    return users[0].user_id;
  }
}

module.exports = new Auth0ManagementService();
