function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-40 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4 text-center">
            <div className="h-6 w-14 mx-auto bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4 text-center">
            <div className="h-4 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
}
export default TableSkeleton;
