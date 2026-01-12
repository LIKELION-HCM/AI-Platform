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
          background: `conic-gradient(from 0deg, rgb(20 184 166) 0%, rgb(99 102 241) ${score}%, rgb(229 231 235) ${score}% 100%)`,
        }}
      />
      <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
        <div className="text-4xl font-bold text-[#176D81]">{score}%</div>
      </div>
    </div>
  );
}
