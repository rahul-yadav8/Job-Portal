export interface IPermission {
    _id: string; // Unique identifier for the permission
    status: string; // e.g., "active", "inactive"
    name: string; // The name of the permission (e.g., "me")
    role: string; // The role associated with the permission (e.g., "pulse-admin")
    read: 'none' | 'own' | 'all'; // Access level for read permission
    write: 'none' | 'own' | 'all'; // Access level for write permission
    update: 'none' | 'own' | 'all'; // Access level for update permission
    delete: 'none' | 'own' | 'all'; // Access level for delete permission
  }
  