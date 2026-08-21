const ROLES = {
    ADMIN: 'Admin',
    QA: 'QA',
    DEVELOPER: 'Developer'
};

const PERMISSIONS = {
    CREATE_TASK: 'create:task',
    DELETE_TASK: 'delete:task',
    EDIT_ALL_FIELDS: 'edit:all_fields',
    REASSIGN_TASK: 'reassign:task',
    MOVE_TO_DONE: 'move:to_done',
    ADD_COMMENTS: 'add:comments',
    CONFIGURE_NOTIFICATIONS: 'configure:notifications'
};

const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS),
    [ROLES.QA]: [
        PERMISSIONS.MOVE_TO_DONE,
        PERMISSIONS.ADD_COMMENTS
    ],
    [ROLES.DEVELOPER]: [
        PERMISSIONS.ADD_COMMENTS
    ]
};

class RBAC {
    /**
     * Check if a role has a specific permission
     * @param {string} role 
     * @param {string} permission 
     * @returns {boolean}
     */
    static hasPermission(role, permission) {
        if (!role || !ROLE_PERMISSIONS[role]) return false;
        return ROLE_PERMISSIONS[role].includes(permission);
    }

    /**
     * Get all permissions for a role
     * @param {string} role 
     * @returns {string[]}
     */
    static getPermissions(role) {
        return ROLE_PERMISSIONS[role] || [];
    }

    /**
     * Validate if an action is allowed for a user
     * @param {Object} user 
     * @param {string} permission 
     * @returns {boolean}
     */
    static canUserPerformAction(user, permission) {
        if (!user || !user.role) return false;
        return this.hasPermission(user.role, permission);
    }
}

export { ROLES, PERMISSIONS, RBAC };
export default RBAC;

