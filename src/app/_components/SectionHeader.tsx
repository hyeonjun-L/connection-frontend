import Link from 'next/link';

interface ISectionHeader {
  icon: React.ReactNode;
  title: string;
  link: string;
}

const SectionHeader = ({ icon, title, link }: ISectionHeader) => (
  <h2 className="mb-3 flex w-full items-center justify-between px-4 sm:px-9">
    <span className="flex items-center gap-1 text-lg font-bold">
      {icon}
      {title}
    </span>
    <Link href={link} className="text-sm text-gray-500 underline">
      전체보기
    </Link>
  </h2>
);

export default SectionHeader;
