export function BrandAvatar({
  avatar,
  name,
  size = 20,
}: {
  avatar: string;
  name: string;
  size?: number;
}) {
  if (avatar.startsWith("<svg")) {
    return (
      <span
        className="inline-flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size, color: "var(--color-gray-700)" }}
        dangerouslySetInnerHTML={{ __html: avatar }}
      />
    );
  }
  return (
    <img
      src={avatar}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className="flex-shrink-0"
      style={{ borderRadius: "25%", display: "inline-block" }}
    />
  );
}
