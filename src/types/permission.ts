export type Permissions = {
  dashboard: { canRead: boolean; canExport: boolean }
  syncMonitor: { canReadSync: boolean; canExportStoreData: boolean }
  userManagement: { canInvite: boolean; canRead: boolean }
  dtr: { canUploadDtr: boolean }
  storeManagement: {
    canCreate: boolean
    canRead: boolean
    canEdit: boolean
    canDisable: boolean
  }
  deviceManagement: {
    canCreate: boolean
    canRead: boolean
    canUpdate: boolean
    canDelete: boolean
  }
}
