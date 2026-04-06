module.exports = {
    // Timeout errors
    TIMEOUT: "Roblox did not respond.",
    
    // Command errors
    UNKNOWN_COMMAND: (cmd) => `Unknown command: ${cmd}`,
    MISSING_USERID: "No user ID was provided.",
    MISSING_VERSION: "A version ID is required for rollback.",
    COMMAND_FAILED: (err) => `Command failed: ${err}`,
    
    // Player errors
    PLAYER_NOT_FOUND: (userId) => `Player ${userId} is not on any server.`,
    PLAYER_OFFLINE: (userId) => `Player ${userId} is not currently online.`,
    
    // Action results
    KICK_SUCCESS: (name, reason) => `Successfully kicked ${name}. Reason: ${reason}`,
    WIPE_SUCCESS: (userId) => `Data wipe successful for user ${userId}.`,
    WIPE_FAILED: (userId, err) => `Data wipe failed for user ${userId}: ${err}`,
    ROLLBACK_SUCCESS: (userId, version) => `Rollback successful for user ${userId} to version ${version}.`,
    ROLLBACK_FAILED: (userId, err) => `Rollback failed for user ${userId}: ${err}`,
    
    // Method errors
    METHOD_NOT_ALLOWED: "This endpoint does not support that request method.",
    MISSING_FIELDS: "Required fields are missing from the request.",
}
