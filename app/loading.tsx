export default function Loading() {
  return (
    <div className="h-screen w-screen bg-white fixed top-0 left-0 flex justify-center items-center z-[9999]">
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
