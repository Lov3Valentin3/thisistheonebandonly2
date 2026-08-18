type ElfLook = {
  name: string;
  hatColor: string;
  tunicColor: string;
  hairColor: string;
  skin: string;
  eyes: string;
  accessory: string;
  photo?: string | null;
};
export function ElfAvatar({ elf, size = 120 }: { elf: ElfLook; size?: number }) {
  if (elf.photo) {
    return (
      <img
        src={elf.photo}
        alt={elf.name}
        width={size}
        height={size}
        className="rounded-full object-cover ring-4 ring-[#e0b14a]/70 shadow-xl"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={elf.name} className="drop-shadow-xl">
      <defs>
        <radialGradient id={`bg-${elf.name}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fff7e6" />
          <stop offset="100%" stopColor={elf.hatColor} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#bg-${elf.name})`} />
      <circle cx="60" cy="60" r="56" fill="none" stroke="#e0b14a" strokeWidth="3" />
      <ellipse cx="60" cy="98" rx="28" ry="14" fill={elf.tunicColor} />
      <path d="M32 46 C28 18, 92 18, 88 46 L84 40 L60 8 L36 40 Z" fill={elf.hatColor} />
      <circle cx="60" cy="10" r="6" fill="#f8fafc" />
      <circle cx="60" cy="10" r="3" fill="#e0b14a" />
      <circle cx="60" cy="62" r="24" fill={elf.skin} />
      <path d="M38 58 Q40 42 60 40 Q80 42 82 58" fill={elf.hairColor} />
      <ellipse cx="51" cy="64" rx="3.2" ry="3.6" fill={elf.eyes} />
      <ellipse cx="69" cy="64" rx="3.2" ry="3.6" fill={elf.eyes} />
      <circle cx="51.6" cy="63.2" r="1" fill="#fff" />
      <circle cx="69.6" cy="63.2" r="1" fill="#fff" />
      <path d="M54 74 Q60 79 66 74" fill="none" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="48" cy="70" rx="4" ry="2.2" fill="#f9a8d4" opacity="0.7" />
      <ellipse cx="72" cy="70" rx="4" ry="2.2" fill="#f9a8d4" opacity="0.7" />
      {elf.accessory === "bell" && <circle cx="88" cy="38" r="5" fill="#facc15" />}
      {elf.accessory === "star" && <text x="84" y="36" fontSize="14">★</text>}
      {elf.accessory === "mug" && <text x="82" y="92" fontSize="14">mug</text>}
    </svg>
  );
}
