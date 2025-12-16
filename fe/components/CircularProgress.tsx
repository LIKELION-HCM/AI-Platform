export default function CircularProgress({
  score,
  size = 120,
}: {
  score: number;
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, rgb(249 115 22) 0%, rgb(236 72 153) ${score}%, rgb(55 65 81) ${score}% 100%)`,
        }}
      />
      <div className="absolute inset-2 rounded-full bg-gray-800 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-white">{score}%</div>
        <div className="text-xs text-gray-400">Match</div>
      </div>
    </div>
  );
}
