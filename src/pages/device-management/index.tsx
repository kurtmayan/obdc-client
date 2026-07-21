import DeviceManagementTable from "./table"

export default function StoreManagementPage() {
  return (
    <div className="grid gap-3">
      <div>
        <p className="text-lg font-semibold">Store Management</p>
        <p className="text-[14px] text-[#8A96A3]">
          Manage biometric devices and store assignments
        </p>
      </div>
      <div className="bg-white p-6">
        <DeviceManagementTable />
      </div>
    </div>
  )
}
