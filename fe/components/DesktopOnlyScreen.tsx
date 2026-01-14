export default function DesktopOnlyScreen() {
  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-[#EDFFFF] px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-[#176D81]">Desktop Only</h1>

        <p className="text-gray-600">
          This application is currently optimized for desktop devices.
          <br />
          Please access it on a laptop or desktop computer.
        </p>

        <div className="text-sm text-gray-400">
          Mobile & tablet versions are coming soon 🚀
        </div>
      </div>
    </div>
  );
}
