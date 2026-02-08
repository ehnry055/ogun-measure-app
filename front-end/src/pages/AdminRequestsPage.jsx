import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import "../styles/App.css";

const AdminRequestsPage = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [actingUserId, setActingUserId] = useState("");
  const targetEmail = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("requesterEmail") || "").trim().toLowerCase();
  }, [location.search]);

  const parseRoles = (roleResponseData) => {
    if (Array.isArray(roleResponseData)) {
      return roleResponseData;
    }

    if (roleResponseData && typeof roleResponseData === "object") {
      const maybeArray = Object.values(roleResponseData).find((value) => Array.isArray(value));
      return maybeArray || [];
    }

    return [];
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getAccessTokenSilently();

      const usersResponse = await axios.get("/api/admin/get-users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawUsers = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : Object.values(usersResponse.data || {}).find((value) => Array.isArray(value)) || [];

      const enrichedUsers = await Promise.all(
        rawUsers.map(async (user) => {
          const roleResponse = await axios.get("/api/admin/get-user-roles", {
            params: { userId: user.user_id },
            headers: { Authorization: `Bearer ${token}` },
          });

          const roles = parseRoles(roleResponse.data).map((role) => role.name);
          const isAdmin = roles.includes("admin_role");
          const isRegistered = roles.includes("registered_role");

          return {
            userId: user.user_id,
            name: user.name || "Unknown",
            email: user.email || "No email",
            lastLogin: user.last_login || "Never",
            isAdmin,
            isRegistered,
          };
        })
      );

      const requestRows = enrichedUsers
        .filter((user) => !user.isAdmin)
        .sort((a, b) => Number(b.isRegistered) - Number(a.isRegistered));

      setRows(requestRows);
    } catch (fetchError) {
      console.error("Error loading admin requests:", fetchError);
      setError("Could not load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated, isLoading]);

  const requestSummary = useMemo(() => {
    const approved = rows.filter((row) => row.isRegistered).length;
    const pending = rows.length - approved;
    return { approved, pending };
  }, [rows]);
  const visibleRows = useMemo(() => {
    if (!targetEmail) {
      return rows;
    }

    return rows.filter((row) => (row.email || "").toLowerCase() === targetEmail);
  }, [rows, targetEmail]);

  const approveRequest = async (userId) => {
    try {
      setActingUserId(userId);
      const token = await getAccessTokenSilently();

      await axios.post(
        "/api/admin/assign-registered",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRows((prev) => prev.map((row) => (row.userId === userId ? { ...row, isRegistered: true } : row)));
    } catch (actionError) {
      console.error("Error approving request:", actionError);
      alert("Unable to approve this request.");
    } finally {
      setActingUserId("");
    }
  };

  const rejectRequest = async (userId) => {
    try {
      setActingUserId(userId);
      const token = await getAccessTokenSilently();

      await axios.delete("/api/admin/remove-registered", {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setRows((prev) => prev.map((row) => (row.userId === userId ? { ...row, isRegistered: false } : row)));
    } catch (actionError) {
      console.error("Error rejecting request:", actionError);
      alert("Unable to reject this request.");
    } finally {
      setActingUserId("");
    }
  };

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="admin-requests-page">
      <div className="admin-requests-header">
        <h1>Review Access Requests</h1>
        <button className="btn btn-outline-primary" type="button" onClick={fetchRequests}>
          Refresh
        </button>
      </div>

      <p className="admin-requests-subtitle">
        Pending requests are users without registered access. Approve grants registered access, reject removes it.
      </p>
      {targetEmail ? (
        <p className="admin-requests-subtitle">
          Showing request for: <strong>{targetEmail}</strong>
        </p>
      ) : null}

      <div className="admin-requests-summary">
        <span>Pending: {requestSummary.pending}</span>
        <span>Approved: {requestSummary.approved}</span>
      </div>

      {loading ? <p>Loading requests...</p> : null}
      {error ? <p className="admin-requests-error">{error}</p> : null}

      {!loading && !error ? (
        <div className="admin-requests-table-wrap">
          <table className="admin-requests-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const isBusy = actingUserId === row.userId;
                const isTargeted = targetEmail && (row.email || "").toLowerCase() === targetEmail;

                return (
                  <tr key={row.userId} className={isTargeted ? "admin-requests-target-row" : ""}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.lastLogin}</td>
                    <td>
                      <span className={row.isRegistered ? "status-approved" : "status-pending"}>
                        {row.isRegistered ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="admin-requests-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        disabled={isBusy || row.isRegistered}
                        onClick={() => approveRequest(row.userId)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        disabled={isBusy || !row.isRegistered}
                        onClick={() => rejectRequest(row.userId)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {targetEmail && visibleRows.length === 0 ? (
            <p className="admin-requests-error" style={{ marginTop: "10px" }}>
              No user matched {targetEmail}. Ask the requester to log in first so their account appears.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default AdminRequestsPage;
