export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[5px] bg-[#191919] font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.62,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
      aria-label="Khwarz logo"
    >
      K
    </span>
  );
}
