const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getAccessTokenSilently();

      const [usersResponse, requestMetadataResponse] = await Promise.all([
        axios.get("/api/admin/get-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/access-requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const requestMetadataByEmail = new Map(
        (requestMetadataResponse.data || []).map((request) => [
          (request.email || "").toLowerCase(),
          request,
        ])
      );

      const rawUsers = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : Object.values(usersResponse.data || {}).find((value) => Array.isArray(value)) || [];

      const enrichedUsers = [];

      // FIX: Use a sequential for...of loop instead of Promise.all
      // This prevents rate-limiting by not spamming the API all at once.
      for (const user of rawUsers) {
        try {
          const roleResponse = await axios.get("/api/admin/get-user-roles", {
            params: { userId: user.user_id },
            headers: { Authorization: `Bearer ${token}` },
          });

          const roles = parseRoles(roleResponse.data).map((role) => role.name);
          const isAdmin = roles.includes("admin_role");
          const isRegistered = roles.includes("registered_role");
          const normalizedEmail = (user.email || "").toLowerCase();
          const requestMetadata = requestMetadataByEmail.get(normalizedEmail);
          const status = requestMetadata?.decisionStatus || getStatusFromRole(isRegistered);

          enrichedUsers.push({
            userId: user.user_id,
            name: user.name || "Unknown",
            email: user.email || "No email",
            requestSubmittedAt: requestMetadata?.requestSubmittedAt || null,
            decisionAt: requestMetadata?.decisionAt || null,
            isAdmin,
            isRegistered,
            status,
          });
        } catch (userError) {
          // FIX: If one user fails (e.g. rate limit), log it but don't break the whole page.
          console.warn(`Failed to load roles for ${user.email}. Skipping user.`, userError);
        }
      }

      const requestRows = enrichedUsers
        .filter((user) => !user.isAdmin)
        .sort((a, b) => Number(b.isRegistered) - Number(a.isRegistered));

      setRows(requestRows);
    } catch (fetchError) {
      console.error("Error loading admin requests:", fetchError);
      setError("Could not load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };